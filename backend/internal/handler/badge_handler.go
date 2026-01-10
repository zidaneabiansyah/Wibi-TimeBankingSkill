package handler

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// BadgeHandler handles badge-related HTTP requests
type BadgeHandler struct {
	badgeService *service.BadgeService
}

// NewBadgeHandler creates a new badge handler
func NewBadgeHandler(badgeService *service.BadgeService) *BadgeHandler {
	return &BadgeHandler{
		badgeService: badgeService,
	}
}

// GetAllBadges retrieves all available badges
// GET /api/v1/badges
func (h *BadgeHandler) GetAllBadges(c *gin.Context) {
	badges, err := h.badgeService.GetAllBadges()
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch badges", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Badges retrieved successfully", gin.H{
		"badges": badges,
		"total":  len(badges),
	})
}

// GetBadge retrieves a specific badge by ID
// GET /api/v1/badges/:id
func (h *BadgeHandler) GetBadge(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid badge ID", err)
		return
	}

	badge, err := h.badgeService.GetBadge(uint(id))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Badge not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Badge retrieved successfully", badge)
}

// GetUserBadges retrieves all badges earned by the current user
// GET /api/v1/user/badges
func (h *BadgeHandler) GetUserBadges(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	badges, err := h.badgeService.GetUserBadges(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch user badges", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "User badges retrieved successfully", gin.H{
		"badges": badges,
		"total":  len(badges),
	})
}

// GetUserBadgesByType retrieves user badges filtered by type
// GET /api/v1/user/badges/:type
func (h *BadgeHandler) GetUserBadgesByType(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	badgeType := c.Param("type")
	if badgeType == "" {
		utils.SendError(c, http.StatusBadRequest, "Badge type is required", nil)
		return
	}

	badges, err := h.badgeService.GetUserBadgesByType(userID, badgeType)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "User badges retrieved successfully", gin.H{
		"badges": badges,
		"total":  len(badges),
	})
}

// CheckAndAwardBadges checks if user qualifies for any badges and awards them
// POST /api/v1/user/badges/check
func (h *BadgeHandler) CheckAndAwardBadges(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	awardedBadges, err := h.badgeService.CheckAndAwardBadges(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to check badges", err)
		return
	}

	if len(awardedBadges) > 0 {
		utils.SendSuccess(c, http.StatusOK, "New badges awarded!", gin.H{
			"awarded_badges": awardedBadges,
			"count":          len(awardedBadges),
		})
	} else {
		utils.SendSuccess(c, http.StatusOK, "No new badges earned", gin.H{
			"awarded_badges": []interface{}{},
			"count":          0,
		})
	}
}

// PinBadge pins/unpins a badge for the user
// POST /api/v1/user/badges/:id/pin
// Request body: { "is_pinned": true/false }
func (h *BadgeHandler) PinBadge(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Parse badge ID from URL parameter
	badgeIDStr := c.Param("id")
	badgeID, err := strconv.ParseUint(badgeIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid badge ID", err)
		return
	}

	// Parse request body
	var req struct {
		IsPinned *bool `json:"is_pinned" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data - is_pinned field required", err)
		return
	}

	// Call service to pin/unpin badge
	if err := h.badgeService.PinBadge(userID, uint(badgeID), *req.IsPinned); err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	// Return success response
	statusMsg := "Badge pinned successfully"
	if !*req.IsPinned {
		statusMsg = "Badge unpinned successfully"
	}
	utils.SendSuccess(c, http.StatusOK, statusMsg, gin.H{
		"badge_id": badgeID,
		"is_pinned": *req.IsPinned,
	})
}

func (h *BadgeHandler) GetBadgeLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Try to get from cache
	cacheKey := fmt.Sprintf("%s:%d", utils.CacheKeyLeaderboardBadge, limit)
	var cachedLeaderboard []dto.LeaderboardEntry
	if utils.GetCache().GetJSON(cacheKey, &cachedLeaderboard) {
		utils.SendSuccess(c, http.StatusOK, "Badge leaderboard retrieved from cache", gin.H{
			"type":    "badges",
			"entries": cachedLeaderboard,
			"total":   len(cachedLeaderboard),
		})
		return
	}

	leaderboard, err := h.badgeService.GetBadgeLeaderboard(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch leaderboard", err)
		return
	}

	// Add rank
	for i := range leaderboard {
		leaderboard[i].Rank = i + 1
	}

	// Save to cache (TTL: 5 minutes)
	utils.GetCache().SetWithTTL(cacheKey, leaderboard, 5*time.Minute)

	utils.SendSuccess(c, http.StatusOK, "Badge leaderboard retrieved successfully", gin.H{
		"type":    "badges",
		"entries": leaderboard,
		"total":   len(leaderboard),
	})
}

func (h *BadgeHandler) GetRarityLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Try to get from cache
	cacheKey := fmt.Sprintf("%s:%d", utils.CacheKeyLeaderboardRarity, limit)
	var cachedLeaderboard []dto.LeaderboardEntry
	if utils.GetCache().GetJSON(cacheKey, &cachedLeaderboard) {
		utils.SendSuccess(c, http.StatusOK, "Rarity leaderboard retrieved from cache", gin.H{
			"type":    "rarity",
			"entries": cachedLeaderboard,
			"total":   len(cachedLeaderboard),
		})
		return
	}

	leaderboard, err := h.badgeService.GetRarityLeaderboard(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch leaderboard", err)
		return
	}

	// Add rank
	for i := range leaderboard {
		leaderboard[i].Rank = i + 1
	}

	// Save to cache
	utils.GetCache().SetWithTTL(cacheKey, leaderboard, 5*time.Minute)

	utils.SendSuccess(c, http.StatusOK, "Rarity leaderboard retrieved successfully", gin.H{
		"type":    "rarity",
		"entries": leaderboard,
		"total":   len(leaderboard),
	})
}

func (h *BadgeHandler) GetSessionLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Try to get from cache
	cacheKey := fmt.Sprintf("%s:%d", utils.CacheKeyLeaderboardSession, limit)
	var cachedLeaderboard []dto.LeaderboardEntry
	if utils.GetCache().GetJSON(cacheKey, &cachedLeaderboard) {
		utils.SendSuccess(c, http.StatusOK, "Session leaderboard retrieved from cache", gin.H{
			"type":    "sessions",
			"entries": cachedLeaderboard,
			"total":   len(cachedLeaderboard),
		})
		return
	}

	leaderboard, err := h.badgeService.GetSessionLeaderboard(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch leaderboard", err)
		return
	}

	// Add rank
	for i := range leaderboard {
		leaderboard[i].Rank = i + 1
	}

	// Save to cache
	utils.GetCache().SetWithTTL(cacheKey, leaderboard, 5*time.Minute)

	utils.SendSuccess(c, http.StatusOK, "Session leaderboard retrieved successfully", gin.H{
		"type":    "sessions",
		"entries": leaderboard,
		"total":   len(leaderboard),
	})
}

func (h *BadgeHandler) GetRatingLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Try to get from cache
	cacheKey := fmt.Sprintf("%s:%d", utils.CacheKeyLeaderboardRating, limit)
	var cachedLeaderboard []dto.LeaderboardEntry
	if utils.GetCache().GetJSON(cacheKey, &cachedLeaderboard) {
		utils.SendSuccess(c, http.StatusOK, "Rating leaderboard retrieved from cache", gin.H{
			"type":    "rating",
			"entries": cachedLeaderboard,
			"total":   len(cachedLeaderboard),
		})
		return
	}

	leaderboard, err := h.badgeService.GetRatingLeaderboard(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch leaderboard", err)
		return
	}

	// Add rank
	for i := range leaderboard {
		leaderboard[i].Rank = i + 1
	}

	// Save to cache
	utils.GetCache().SetWithTTL(cacheKey, leaderboard, 5*time.Minute)

	utils.SendSuccess(c, http.StatusOK, "Rating leaderboard retrieved successfully", gin.H{
		"type":    "rating",
		"entries": leaderboard,
		"total":   len(leaderboard),
	})
}

func (h *BadgeHandler) GetCreditLeaderboard(c *gin.Context) {
	limitStr := c.DefaultQuery("limit", "10")
	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	// Try to get from cache
	cacheKey := fmt.Sprintf("%s:%d", utils.CacheKeyLeaderboardCredit, limit)
	var cachedLeaderboard []dto.LeaderboardEntry
	if utils.GetCache().GetJSON(cacheKey, &cachedLeaderboard) {
		utils.SendSuccess(c, http.StatusOK, "Credit leaderboard retrieved from cache", gin.H{
			"type":    "credits",
			"entries": cachedLeaderboard,
			"total":   len(cachedLeaderboard),
		})
		return
	}

	leaderboard, err := h.badgeService.GetCreditLeaderboard(limit)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch leaderboard", err)
		return
	}

	// Add rank
	for i := range leaderboard {
		leaderboard[i].Rank = i + 1
	}

	// Save to cache
	utils.GetCache().SetWithTTL(cacheKey, leaderboard, 5*time.Minute)

	utils.SendSuccess(c, http.StatusOK, "Credit leaderboard retrieved successfully", gin.H{
		"type":    "credits",
		"entries": leaderboard,
		"total":   len(leaderboard),
	})
}

// DeleteBadge deletes a badge by ID (admin only)
// DELETE /api/v1/admin/badges/:id
func (h *BadgeHandler) DeleteBadge(c *gin.Context) {
	badgeID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid badge ID", err)
		return
	}

	if err := h.badgeService.DeleteBadge(uint(badgeID)); err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to delete badge", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Badge deleted successfully", nil)
}
