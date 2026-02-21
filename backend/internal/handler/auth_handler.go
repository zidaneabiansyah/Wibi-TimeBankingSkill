package handler

import (
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/middleware"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
)

// AuthHandler handles authentication HTTP requests
type AuthHandler struct {
	authService *service.AuthService
	tracker     *middleware.LoginBruteForceTracker
}

// NewAuthHandler creates a new auth handler
func NewAuthHandler(authService *service.AuthService, tracker *middleware.LoginBruteForceTracker) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		tracker:     tracker,
	}
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req dto.RegisterRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	// Call service
	res, err := h.authService.Register(&req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.Created(c, "Registration successful", res)
}

// Login handles user login
func (h *AuthHandler) Login(c *gin.Context) {
	var req dto.LoginRequest

	// Bind and validate request
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	// Call service
	res, err := h.authService.Login(&req)
	if err != nil {
		if h.tracker != nil {
			h.tracker.RecordFailure(c.ClientIP())
		}
		response.Error(c, err)
		return
	}

	if h.tracker != nil {
		h.tracker.Reset(c.ClientIP())
	}

	// Set httpOnly cookie for security (protects from XSS)
	utils.SetAuthCookie(c, res.Token)

	response.OK(c, "Login successful", res)
}

// GetProfile gets current user profile
func (h *AuthHandler) GetProfile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		response.Error(c, errors.ErrUnauthorized)
		return
	}

	// Call service
	profile, err := h.authService.GetProfile(userID.(uint))
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Profile retrieved successfully", profile)
}

// Logout handles user logout (client-side token removal)
func (h *AuthHandler) Logout(c *gin.Context) {
	// Clear httpOnly cookie
	utils.ClearAuthCookie(c)

	response.OK(c, "Logout successful", nil)
}

// VerifyEmail handles email verification via 6-digit code
func (h *AuthHandler) VerifyEmail(c *gin.Context) {
	var req dto.VerifyEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	err := h.authService.VerifyEmailWithCode(req.Email, req.Code)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Email verified successfully! You can now login.", nil)
}

// ResendVerificationCode sends a new verification code to the user
func (h *AuthHandler) ResendVerificationCode(c *gin.Context) {
	var req dto.ResendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request data: "+err.Error())
		return
	}

	err := h.authService.ResendVerificationCode(req.Email)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "New verification code has been sent to your email", nil)
}

// ForgotPassword handles password reset request
func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req dto.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request: "+err.Error())
		return
	}

	err := h.authService.ForgotPassword(&req)
	if err != nil {
		response.Error(c, err)
		return
	}

	response.OK(c, "Password reset email has been sent to your email address", nil)
}

// ResetPassword handles password reset completion
func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req dto.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.ValidationError(c, "Invalid request: "+err.Error())
		return
	}

	err := h.authService.ResetPassword(&req)
	if err != nil {
		// Debug: log the actual error
		log.Printf("DEBUG ResetPassword error: %v", err)

		// Token parse/validation errors should be 400, not 500
		errStr := err.Error()
		if strings.Contains(errStr, "token") || strings.Contains(errStr, "expired") || strings.Contains(errStr, "invalid") {
			response.Error(c, errors.ErrBadRequest.WithDetails("Invalid or expired reset token. Please request a new password reset."))
			return
		}
		response.Error(c, err)
		return
	}

	response.OK(c, "Password has been reset successfully. You can now login with your new password", nil)
}