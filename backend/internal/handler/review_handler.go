package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// ReviewHandler handles review-related HTTP requests
type ReviewHandler struct {
	reviewService *service.ReviewService
}

// NewReviewHandler creates a new review handler
func NewReviewHandler(reviewService *service.ReviewService) *ReviewHandler {
	return &ReviewHandler{
		reviewService: reviewService,
	}
}

// CreateReview creates a new review for a completed session
// POST /api/v1/reviews
func (h *ReviewHandler) CreateReview(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req dto.CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	review, err := h.reviewService.CreateReview(userID, &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		return
	}

	utils.SendSuccess(c, http.StatusCreated, "Review created successfully", review)
}

// GetReview retrieves a specific review by ID
// GET /api/v1/reviews/:id
func (h *ReviewHandler) GetReview(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid review ID", err)
		return
	}

	review, err := h.reviewService.GetReview(uint(id))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Review not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Review retrieved successfully", review)
}

// GetUserReviews retrieves all reviews for a user
// GET /api/v1/users/:userId/reviews
func (h *ReviewHandler) GetUserReviews(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	// Get pagination parameters
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	reviews, total, err := h.reviewService.GetReviewsForUser(uint(userID), limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch reviews", err)
		return
	}

	response := gin.H{
		"reviews": reviews,
		"total":   total,
		"limit":   limit,
		"offset":  offset,
	}

	utils.SendSuccess(c, http.StatusOK, "Reviews retrieved successfully", response)
}

// GetUserReviewsByType retrieves reviews for a user filtered by type (teacher/student)
// GET /api/v1/users/:userId/reviews/:type
func (h *ReviewHandler) GetUserReviewsByType(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	reviewType := c.Param("type")
	if reviewType != "teacher" && reviewType != "student" {
		utils.SendError(c, http.StatusBadRequest, "Invalid review type. Must be 'teacher' or 'student'", nil)
		return
	}

	// Get pagination parameters
	limitStr := c.DefaultQuery("limit", "10")
	offsetStr := c.DefaultQuery("offset", "0")

	limit, err := strconv.Atoi(limitStr)
	if err != nil || limit < 1 || limit > 100 {
		limit = 10
	}

	offset, err := strconv.Atoi(offsetStr)
	if err != nil || offset < 0 {
		offset = 0
	}

	reviews, total, err := h.reviewService.GetReviewsForUserByType(uint(userID), reviewType, limit, offset)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch reviews", err)
		return
	}

	response := gin.H{
		"reviews": reviews,
		"total":   total,
		"limit":   limit,
		"offset":  offset,
	}

	utils.SendSuccess(c, http.StatusOK, "Reviews retrieved successfully", response)
}

// GetUserRatingSummary retrieves rating summary for a user
// GET /api/v1/users/:userId/rating-summary
func (h *ReviewHandler) GetUserRatingSummary(c *gin.Context) {
	userIDStr := c.Param("id")
	userID, err := strconv.ParseUint(userIDStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	summary, err := h.reviewService.GetUserRatingSummary(uint(userID))
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to fetch rating summary", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Rating summary retrieved successfully", summary)
}

// UpdateReview updates a review
// PUT /api/v1/reviews/:id
func (h *ReviewHandler) UpdateReview(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid review ID", err)
		return
	}

	var req dto.UpdateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
		return
	}

	review, err := h.reviewService.UpdateReview(uint(id), userID, &req)
	if err != nil {
		if err.Error() == "you can only edit your own reviews" {
			utils.SendError(c, http.StatusForbidden, err.Error(), nil)
		} else {
			utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		}
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Review updated successfully", review)
}

// DeleteReview deletes a review
// DELETE /api/v1/reviews/:id
func (h *ReviewHandler) DeleteReview(c *gin.Context) {
	userID, ok := getUserID(c)
	if !ok {
		utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid review ID", err)
		return
	}

	err = h.reviewService.DeleteReview(uint(id), userID)
	if err != nil {
		if err.Error() == "you can only delete your own reviews" {
			utils.SendError(c, http.StatusForbidden, err.Error(), nil)
		} else {
			utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
		}
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Review deleted successfully", nil)
}
