package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
	customErr "github.com/timebankingskill/backend/pkg/errors"
)

// BaseResponse is the standard API response structure
type BaseResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    any    `json:"data,omitempty"`
	Error   any    `json:"error,omitempty"`
}

// Success writes a successful response
func Success(c *gin.Context, statusCode int, message string, data any) {
	c.JSON(statusCode, BaseResponse{
		Success: true,
		Message: message,
		Data:    data,
	})
}

// OK is a shorthand for 200 OK
func OK(c *gin.Context, message string, data any) {
	Success(c, http.StatusOK, message, data)
}

// Created is a shorthand for 201 Created
func Created(c *gin.Context, message string, data any) {
	Success(c, http.StatusCreated, message, data)
}

// Error writes an error response
func Error(c *gin.Context, err error) {
	var appErr *customErr.AppError

	// Check if the error is our custom AppError type
	if e, ok := err.(*customErr.AppError); ok {
		appErr = e
	} else {
		// Default to Internal Server Error for unhandled types
		appErr = customErr.ErrInternalServer.WithDetails(err.Error())
	}

	c.JSON(appErr.StatusCode, BaseResponse{
		Success: false,
		Message: appErr.Message,
		Error:   appErr, // Can omit StatusCode since it has `json:"-"`
	})
}

// ValidationError specifically formats validation errors
func ValidationError(c *gin.Context, details any) {
	err := customErr.ErrValidation.WithDetails(details)
	c.JSON(err.StatusCode, BaseResponse{
		Success: false,
		Message: err.Message,
		Error:   err,
	})
}
