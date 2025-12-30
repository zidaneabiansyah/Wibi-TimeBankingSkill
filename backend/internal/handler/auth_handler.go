package handler

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/timebankingskill/backend/internal/dto"
  "github.com/timebankingskill/backend/internal/service"
  "github.com/timebankingskill/backend/internal/utils"
)

// AuthHandler handles authentication HTTP requests
type AuthHandler struct {
  authService *service.AuthService
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *service.AuthService) *AuthHandler {
  return &AuthHandler{authService: authService}
}

// Register handles user registration
// @Summary Register a new user
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.RegisterRequest true "Registration request"
// @Success 201 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
  var req dto.RegisterRequest

  // Bind and validate request
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
    return
  }

  // Call service
  response, err := h.authService.Register(&req)
  if err != nil {
    utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusCreated, "Registration successful", response)
}

// Login handles user login
// @Summary Login user
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.LoginRequest true "Login request"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
  var req dto.LoginRequest

  // Bind and validate request
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
    return
  }

  // Call service
  response, err := h.authService.Login(&req)
  if err != nil {
    utils.SendError(c, http.StatusUnauthorized, err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Login successful", response)
}

// GetProfile gets current user profile
// @Summary Get current user profile
// @Tags auth
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.SuccessResponse
// @Failure 401 {object} utils.ErrorResponse
// @Router /auth/profile [get]
func (h *AuthHandler) GetProfile(c *gin.Context) {
  // Get user ID from context (set by auth middleware)
  userID, exists := c.Get("user_id")
  if !exists {
    utils.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
    return
  }

  // Call service
  profile, err := h.authService.GetProfile(userID.(uint))
  if err != nil {
    utils.SendError(c, http.StatusNotFound, "User not found", err)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Profile retrieved successfully", profile)
}

// Logout handles user logout (client-side token removal)
// @Summary Logout user
// @Tags auth
// @Produce json
// @Security BearerAuth
// @Success 200 {object} utils.SuccessResponse
// @Router /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
  // Since we're using JWT, logout is handled client-side by removing the token
  // This endpoint is just for consistency and can be used for logging/analytics
  utils.SendSuccess(c, http.StatusOK, "Logout successful", nil)
}

// VerifyEmail handles email verification via link
// @Summary Verify user email
// @Tags auth
// @Accept json
// @Produce json
// @Param token query string true "Verification token"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/verify-email [get]
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
  token := c.Query("token")
  if token == "" {
    utils.SendError(c, http.StatusBadRequest, "Verification token is required", nil)
    return
  }

  err := h.authService.VerifyEmail(token)
  if err != nil {
    utils.SendError(c, http.StatusBadRequest, err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Email verified successfully", nil)
}

