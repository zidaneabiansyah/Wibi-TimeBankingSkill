package handler

import (
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/middleware"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// AuthHandler handles authentication HTTP requests
type AuthHandler struct {
  authService *service.AuthService
  tracker      *middleware.LoginBruteForceTracker
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *service.AuthService, tracker *middleware.LoginBruteForceTracker) *AuthHandler {
  return &AuthHandler{
    authService: authService,
    tracker:     tracker,
  }
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
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
    if h.tracker != nil {
      h.tracker.RecordFailure(c.ClientIP())
    }
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
    return
  }

  if h.tracker != nil {
    h.tracker.Reset(c.ClientIP())
  }

  // Set httpOnly cookie for security (protects from XSS)
  utils.SetAuthCookie(c, response.Token)

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
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
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
  // Clear httpOnly cookie
  utils.ClearAuthCookie(c)

  // Also support client-side token removal for backward compatibility
  utils.SendSuccess(c, http.StatusOK, "Logout successful", nil)
}

// VerifyEmail handles email verification via 6-digit code
// @Summary Verify user email with code
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.VerifyEmailRequest true "Email and verification code"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/verify-email [post]
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
  var req dto.VerifyEmailRequest
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
    return
  }

  err := h.authService.VerifyEmailWithCode(req.Email, req.Code)
  if err != nil {
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Email verified successfully! You can now login.", nil)
}

// ResendVerificationCode sends a new verification code to the user
// @Summary Resend verification code
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.ResendCodeRequest true "Email"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/resend-verification [post]
func (h *AuthHandler) ResendVerificationCode(c *gin.Context) {
  var req dto.ResendCodeRequest
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request data", err)
    return
  }

  err := h.authService.ResendVerificationCode(req.Email)
  if err != nil {
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "New verification code has been sent to your email", nil)
}

// ForgotPassword handles password reset request
// @Summary Initiate password reset
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.ForgotPasswordRequest true "Email"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/forgot-password [post]
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
  var req dto.ForgotPasswordRequest
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request", nil)
    return
  }

  err := h.authService.ForgotPassword(&req)
  if err != nil {
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Password reset email has been sent to your email address", nil)
}

// ResetPassword handles password reset completion
// @Summary Reset password with token
// @Tags auth
// @Accept json
// @Produce json
// @Param request body dto.ResetPasswordRequest true "Reset password details"
// @Success 200 {object} utils.SuccessResponse
// @Failure 400 {object} utils.ErrorResponse
// @Router /auth/reset-password [post]
func (h *AuthHandler) ResetPassword(c *gin.Context) {
  var req dto.ResetPasswordRequest
  if err := c.ShouldBindJSON(&req); err != nil {
    utils.SendError(c, http.StatusBadRequest, "Invalid request", nil)
    return
  }

  err := h.authService.ResetPassword(&req)
  if err != nil {
    // Debug: log the actual error
    log.Printf("DEBUG ResetPassword error: %v", err)
    
    // Token parse/validation errors should be 400, not 500
    errStr := err.Error()
    if strings.Contains(errStr, "token") || strings.Contains(errStr, "expired") || strings.Contains(errStr, "invalid") {
      utils.SendError(c, http.StatusBadRequest, "Invalid or expired reset token. Please request a new password reset.", nil)
      return
    }
    utils.SendError(c, utils.MapErrorToStatus(err), err.Error(), nil)
    return
  }

  utils.SendSuccess(c, http.StatusOK, "Password has been reset successfully. You can now login with your new password", nil)
}