package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// VoteHandler handles upvote (forum threads) and like (success stories) requests.
type VoteHandler struct {
	voteService *service.VoteService
}

// NewVoteHandler creates a new VoteHandler.
func NewVoteHandler(voteService *service.VoteService) *VoteHandler {
	return &VoteHandler{voteService: voteService}
}

// ─────────────────────────────────────────────
// THREAD UPVOTE
// ─────────────────────────────────────────────

// ToggleThreadUpvote toggles the authenticated user's upvote on a forum thread.
// POST /api/v1/forum/threads/:id/upvote
// Requires: Auth middleware (user_id must be in context)
func (h *VoteHandler) ToggleThreadUpvote(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	threadID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid thread ID", err)
		return
	}

	result, err := h.voteService.ToggleThreadUpvote(userID.(uint), uint(threadID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	msg := "Upvote added"
	if !result.Voted {
		msg = "Upvote removed"
	}

	utils.SendSuccess(c, http.StatusOK, msg, gin.H{
		"voted": result.Voted,
		"count": result.Count,
	})
}

// GetThreadVoteStatus returns whether the authenticated user has upvoted a thread.
// GET /api/v1/forum/threads/:id/upvote
// Optionally Auth — returns voted=false for guests.
func (h *VoteHandler) GetThreadVoteStatus(c *gin.Context) {
	threadID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid thread ID", err)
		return
	}

	// Guest users get voted=false
	userIDRaw, authenticated := c.Get("user_id")
	if !authenticated {
		count, _ := h.voteService.GetThreadUpvoteCountOnly(uint(threadID))
		utils.SendSuccess(c, http.StatusOK, "Vote status fetched", gin.H{
			"voted": false,
			"count": count,
		})
		return
	}

	result, err := h.voteService.GetThreadVoteStatus(userIDRaw.(uint), uint(threadID))
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch vote status", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Vote status fetched", gin.H{
		"voted": result.Voted,
		"count": result.Count,
	})
}

// ─────────────────────────────────────────────
// STORY LIKE
// ─────────────────────────────────────────────

// ToggleStoryLike toggles the authenticated user's like on a success story.
// POST /api/v1/stories/:id/like
// Requires: Auth middleware
func (h *VoteHandler) ToggleStoryLike(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	storyID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid story ID", err)
		return
	}

	result, err := h.voteService.ToggleStoryLike(userID.(uint), uint(storyID))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	msg := "Story liked"
	if !result.Voted {
		msg = "Story unliked"
	}

	utils.SendSuccess(c, http.StatusOK, msg, gin.H{
		"liked": result.Voted,
		"count": result.Count,
	})
}

// GetStoryLikeStatus returns whether the authenticated user has liked a story.
// GET /api/v1/stories/:id/like
// Optionally Auth — returns liked=false for guests.
func (h *VoteHandler) GetStoryLikeStatus(c *gin.Context) {
	storyID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid story ID", err)
		return
	}

	userIDRaw, authenticated := c.Get("user_id")
	if !authenticated {
		count, _ := h.voteService.GetStoryLikeCountOnly(uint(storyID))
		utils.SendSuccess(c, http.StatusOK, "Like status fetched", gin.H{
			"liked": false,
			"count": count,
		})
		return
	}

	result, err := h.voteService.GetStoryLikeStatus(userIDRaw.(uint), uint(storyID))
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch like status", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Like status fetched", gin.H{
		"liked": result.Voted,
		"count": result.Count,
	})
}
