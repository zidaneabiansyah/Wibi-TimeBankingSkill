package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/domain"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
)

type UserHandler struct {
	userService domain.UserService // Intentionally using interface
}

func NewUserHandler(userService domain.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

// GetProfile handles GET /api/v1/user/profile
func (h *UserHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	user, err := h.userService.GetUserProfile(userID.(uint))
	if err != nil {
		response.Error(c, err)
		return
	}

	res := dto.ToUserProfileResponse(user)
	response.OK(c, "Profile retrieved successfully", res)
}

// UpdateProfile handles PUT /api/v1/user/profile
func (h *UserHandler) UpdateProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	var req dto.UpdateProfileRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	updates := &models.User{
		FullName:    req.FullName,
		Username:    req.Username,
		School:      req.School,
		Grade:       req.Grade,
		Major:       req.Major,
		Bio:         req.Bio,
		PhoneNumber: req.PhoneNumber,
		Location:    req.Location,
		Avatar:      req.Avatar,
	}

	err := h.userService.UpdateUserProfile(userID.(uint), updates)
	if err != nil {
		response.Error(c, err)
		return
	}

	updatedUser, _ := h.userService.GetUserProfile(userID.(uint))
	res := dto.ToUserProfileResponse(updatedUser)
	response.OK(c, "Profile updated successfully", res)
}

// ChangePassword handles POST /api/v1/user/change-password
func (h *UserHandler) ChangePassword(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	var req dto.ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	err := h.userService.ChangePassword(userID.(uint), req.CurrentPassword, req.NewPassword)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Password changed successfully", nil)
}

// GetStats handles GET /api/v1/user/stats
func (h *UserHandler) GetStats(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	stats, err := h.userService.GetUserStats(userID.(uint))
	if err != nil {
		response.Error(c, err)
		return
	}

	res := dto.UserStatsResponse{
		CreditBalance:         stats.CreditBalance,
		TotalCreditsEarned:   stats.TotalCreditsEarned,
		TotalCreditsSpent:    stats.TotalCreditsSpent,
		TotalSessionsAsTeacher: stats.TotalSessionsAsTeacher,
		TotalSessionsAsStudent: stats.TotalSessionsAsStudent,
		AverageRatingAsTeacher: stats.AverageRatingAsTeacher,
		AverageRatingAsStudent: stats.AverageRatingAsStudent,
		TotalTeachingHours:   stats.TotalTeachingHours,
		TotalLearningHours:   stats.TotalLearningHours,
	}
	response.OK(c, "User stats retrieved successfully", res)
}

// UpdateAvatar handles POST /api/v1/user/avatar
func (h *UserHandler) UpdateAvatar(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	var req dto.UpdateAvatarRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, err.Error())
		return
	}

	err := h.userService.UpdateAvatar(userID.(uint), req.Avatar)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Avatar updated successfully", gin.H{"avatar": req.Avatar})
}

// GetPublicProfile handles GET /api/v1/users/:id/profile
func (h *UserHandler) GetPublicProfile(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		response.ValidationError(c, "Invalid user ID")
		return
	}

	profile, err := h.userService.GetPublicProfile(uint(id))
	if err != nil {
		response.Error(c, err)
		return
	}

	res := dto.PublicProfileResponse{
		ID:                    profile.ID,
		FullName:             profile.FullName,
		Username:             profile.Username,
		School:               profile.School,
		Grade:                profile.Grade,
		Major:                profile.Major,
		Bio:                  profile.Bio,
		Avatar:               profile.Avatar,
		Location:             profile.Location,
		TotalSessionsAsTeacher: profile.TotalSessionsAsTeacher,
		AverageRatingAsTeacher: profile.AverageRatingAsTeacher,
		TotalTeachingHours:   profile.TotalTeachingHours,
	}
	response.OK(c, "Public profile retrieved successfully", res)
}

// GetPublicProfileByUsername handles GET /api/v1/users/@:username
func (h *UserHandler) GetPublicProfileByUsername(c *gin.Context) {
	username := c.Param("username")
	if username == "" {
		response.ValidationError(c, "Username is required")
		return
	}

	user, err := h.userService.GetUserByUsername(username)
	if err != nil {
		response.Error(c, err)
		return
	}
	
	if user == nil {
		response.Error(c, errors.ErrNotFound)
		return
	}

	profile, err := h.userService.GetPublicProfile(user.ID)
	if err != nil {
		response.Error(c, err)
		return
	}

	res := dto.PublicProfileResponse{
		ID:                    profile.ID,
		FullName:             profile.FullName,
		Username:             profile.Username,
		School:               profile.School,
		Grade:                profile.Grade,
		Major:                profile.Major,
		Bio:                  profile.Bio,
		Avatar:               profile.Avatar,
		Location:             profile.Location,
		TotalSessionsAsTeacher: profile.TotalSessionsAsTeacher,
		AverageRatingAsTeacher: profile.AverageRatingAsTeacher,
		TotalTeachingHours:   profile.TotalTeachingHours,
	}
	response.OK(c, "Public profile retrieved successfully", res)
}
