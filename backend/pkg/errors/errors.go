package errors

import (
	"net/http"
)

// AppError represents a predefined application error
type AppError struct {
	Code       string `json:"code"`
	Message    string `json:"message"`
	StatusCode int    `json:"-"`
	Details    any    `json:"details,omitempty"`
}

// Error implements the error interface
func (e *AppError) Error() string {
	return e.Message
}

// NewAppError creates a new AppError
func NewAppError(code string, statusCode int, message string) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
	}
}

// WithDetails adds details to the error and returns it
func (e *AppError) WithDetails(details any) *AppError {
	return &AppError{
		Code:       e.Code,
		Message:    e.Message,
		StatusCode: e.StatusCode,
		Details:    details,
	}
}

// Predefined Errors
var (
	ErrUnauthorized   = NewAppError("UNAUTHORIZED", http.StatusUnauthorized, "Authentication is required or has failed")
	ErrForbidden      = NewAppError("FORBIDDEN", http.StatusForbidden, "You do not have permission to access this resource")
	ErrNotFound       = NewAppError("NOT_FOUND", http.StatusNotFound, "The requested resource was not found")
	ErrConflict       = NewAppError("CONFLICT", http.StatusConflict, "The request could not be completed due to a conflict")
	ErrBadRequest     = NewAppError("BAD_REQUEST", http.StatusBadRequest, "The request was invalid or cannot be served")
	ErrTooManyRequests = NewAppError("TOO_MANY_REQUESTS", http.StatusTooManyRequests, "Rate limit exceeded")
	ErrInternalServer = NewAppError("INTERNAL_SERVER_ERROR", http.StatusInternalServerError, "An unexpected error occurred")
	ErrValidation     = NewAppError("VALIDATION_ERROR", http.StatusUnprocessableEntity, "The provided data is invalid")
)

// WrapError allows wrapping a standard error into an AppError
func WrapError(err error, baseErr *AppError) *AppError {
	if err == nil {
		return nil
	}
	return baseErr.WithDetails(err.Error())
}
