package utils

import (
	"errors"
	"fmt"
	"net/http"
)

// AppError represents a standardized application error
// Provides consistent error handling across all handlers
//
// Benefits:
//   - Consistent error response format
//   - HTTP status code mapping
//   - Internal error wrapping for debugging
//   - Error categorization for monitoring
//
// Usage:
//
//	return nil, NewAppError(ErrCodeValidation, "Invalid email format", nil)
//	return nil, NewAppErrorWithStatus(http.StatusConflict, "Email already exists", originalErr)
type AppError struct {
	Code       ErrorCode   `json:"code"`           // Machine-readable error code
	Message    string      `json:"message"`        // User-friendly error message
	Details    interface{} `json:"details,omitempty"` // Additional error details
	HTTPStatus int         `json:"-"`              // HTTP status code (not serialized)
	Internal   error       `json:"-"`              // Internal error (not exposed to client)
	Category   string      `json:"-"`              // Error category for monitoring
}

// ErrorCode represents machine-readable error codes
type ErrorCode string

// Standard error codes
const (
	// Validation errors (400)
	ErrCodeValidation    ErrorCode = "VALIDATION_ERROR"
	ErrCodeInvalidInput  ErrorCode = "INVALID_INPUT"
	ErrCodeMissingField  ErrorCode = "MISSING_REQUIRED_FIELD"
	ErrCodeInvalidFormat ErrorCode = "INVALID_FORMAT"

	// Authentication errors (401)
	ErrCodeUnauthorized     ErrorCode = "UNAUTHORIZED"
	ErrCodeInvalidToken     ErrorCode = "INVALID_TOKEN"
	ErrCodeTokenExpired     ErrorCode = "TOKEN_EXPIRED"
	ErrCodeInvalidCredentials ErrorCode = "INVALID_CREDENTIALS"

	// Authorization errors (403)
	ErrCodeForbidden       ErrorCode = "FORBIDDEN"
	ErrCodeInsufficientPermission ErrorCode = "INSUFFICIENT_PERMISSION"

	// Not found errors (404)
	ErrCodeNotFound     ErrorCode = "NOT_FOUND"
	ErrCodeUserNotFound ErrorCode = "USER_NOT_FOUND"
	ErrCodeResourceNotFound ErrorCode = "RESOURCE_NOT_FOUND"

	// Conflict errors (409)
	ErrCodeConflict       ErrorCode = "CONFLICT"
	ErrCodeDuplicate      ErrorCode = "DUPLICATE_ENTRY"
	ErrCodeAlreadyExists  ErrorCode = "ALREADY_EXISTS"

	// Rate limit errors (429)
	ErrCodeRateLimited ErrorCode = "RATE_LIMITED"
	ErrCodeTooManyRequests ErrorCode = "TOO_MANY_REQUESTS"

	// Server errors (500)
	ErrCodeInternal   ErrorCode = "INTERNAL_ERROR"
	ErrCodeDatabase   ErrorCode = "DATABASE_ERROR"
	ErrCodeExternal   ErrorCode = "EXTERNAL_SERVICE_ERROR"

	// Business logic errors
	ErrCodeInsufficientCredits ErrorCode = "INSUFFICIENT_CREDITS"
	ErrCodeInvalidOperation    ErrorCode = "INVALID_OPERATION"
	ErrCodeBusinessRule        ErrorCode = "BUSINESS_RULE_VIOLATION"
)

// Error implements the error interface
func (e *AppError) Error() string {
	if e.Internal != nil {
		return fmt.Sprintf("%s: %s (internal: %v)", e.Code, e.Message, e.Internal)
	}
	return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

// Unwrap returns the internal error for errors.Is/As support
func (e *AppError) Unwrap() error {
	return e.Internal
}

// NewAppError creates a new application error with code
//
// Parameters:
//   - code: Machine-readable error code
//   - message: User-friendly error message
//   - internal: Internal error (optional, for debugging)
//
// Returns:
//   - *AppError: Standardized application error
//
// Example:
//
//	err := NewAppError(ErrCodeValidation, "Email format is invalid", nil)
func NewAppError(code ErrorCode, message string, internal error) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		HTTPStatus: codeToHTTPStatus(code),
		Internal:   internal,
		Category:   codeToCategory(code),
	}
}

// NewAppErrorWithStatus creates an error with explicit HTTP status
func NewAppErrorWithStatus(status int, message string, internal error) *AppError {
	return &AppError{
		Code:       statusToCode(status),
		Message:    message,
		HTTPStatus: status,
		Internal:   internal,
		Category:   statusToCategory(status),
	}
}

// NewAppErrorWithDetails creates an error with additional details
func NewAppErrorWithDetails(code ErrorCode, message string, details interface{}, internal error) *AppError {
	err := NewAppError(code, message, internal)
	err.Details = details
	return err
}

// WithDetails adds details to an existing AppError
func (e *AppError) WithDetails(details interface{}) *AppError {
	e.Details = details
	return e
}

// WithInternal adds internal error for debugging
func (e *AppError) WithInternal(internal error) *AppError {
	e.Internal = internal
	return e
}

// ========================================
// Common Error Constructors
// ========================================

// ValidationError creates a validation error (400)
func ValidationError(message string) *AppError {
	return NewAppError(ErrCodeValidation, message, nil)
}

// ValidationErrorWithDetails creates a validation error with field details
func ValidationErrorWithDetails(message string, fields map[string]string) *AppError {
	return NewAppErrorWithDetails(ErrCodeValidation, message, fields, nil)
}

// UnauthorizedError creates an authentication error (401)
func UnauthorizedError(message string) *AppError {
	if message == "" {
		message = "Authentication required"
	}
	return NewAppError(ErrCodeUnauthorized, message, nil)
}

// ForbiddenError creates an authorization error (403)
func ForbiddenError(message string) *AppError {
	if message == "" {
		message = "You don't have permission to perform this action"
	}
	return NewAppError(ErrCodeForbidden, message, nil)
}

// NotFoundError creates a not found error (404)
func NotFoundError(resource string) *AppError {
	message := "Resource not found"
	if resource != "" {
		message = resource + " not found"
	}
	return NewAppError(ErrCodeNotFound, message, nil)
}

// ConflictError creates a conflict error (409)
func ConflictError(message string) *AppError {
	return NewAppError(ErrCodeConflict, message, nil)
}

// RateLimitError creates a rate limit error (429)
func RateLimitError(message string) *AppError {
	if message == "" {
		message = "Too many requests, please try again later"
	}
	return NewAppError(ErrCodeRateLimited, message, nil)
}

// InternalError creates an internal server error (500)
func InternalError(message string, internal error) *AppError {
	if message == "" {
		message = "An internal error occurred"
	}
	return NewAppError(ErrCodeInternal, message, internal)
}

// DatabaseError creates a database error (500)
func DatabaseError(operation string, internal error) *AppError {
	message := "Database operation failed"
	if operation != "" {
		message = "Failed to " + operation
	}
	return NewAppError(ErrCodeDatabase, message, internal)
}

// BusinessError creates a business rule error
func BusinessError(code ErrorCode, message string) *AppError {
	return NewAppError(code, message, nil)
}

// ========================================
// Error Conversion Helpers
// ========================================

// ToAppError converts any error to AppError
// Preserves AppError if already one, wraps others as internal error
func ToAppError(err error) *AppError {
	if err == nil {
		return nil
	}

	// Check if already an AppError
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr
	}

	// Convert known errors
	if err == ErrUserNotFound {
		return NotFoundError("User")
	}
	if err == ErrUnauthorized || err == ErrInvalidToken {
		return UnauthorizedError(err.Error())
	}
	if err == ErrNotAuthorized {
		return ForbiddenError(err.Error())
	}
	if err == ErrInsufficientCredits {
		return BusinessError(ErrCodeInsufficientCredits, err.Error())
	}

	// Wrap unknown errors as internal
	return InternalError("An error occurred", err)
}

// IsAppError checks if an error is an AppError
func IsAppError(err error) bool {
	var appErr *AppError
	return errors.As(err, &appErr)
}

// GetHTTPStatus returns HTTP status from error (defaults to 500)
func GetHTTPStatus(err error) int {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return appErr.HTTPStatus
	}
	return http.StatusInternalServerError
}

// ========================================
// Helper Functions
// ========================================

// codeToHTTPStatus maps error code to HTTP status
func codeToHTTPStatus(code ErrorCode) int {
	switch code {
	case ErrCodeValidation, ErrCodeInvalidInput, ErrCodeMissingField, ErrCodeInvalidFormat:
		return http.StatusBadRequest
	case ErrCodeUnauthorized, ErrCodeInvalidToken, ErrCodeTokenExpired, ErrCodeInvalidCredentials:
		return http.StatusUnauthorized
	case ErrCodeForbidden, ErrCodeInsufficientPermission:
		return http.StatusForbidden
	case ErrCodeNotFound, ErrCodeUserNotFound, ErrCodeResourceNotFound:
		return http.StatusNotFound
	case ErrCodeConflict, ErrCodeDuplicate, ErrCodeAlreadyExists:
		return http.StatusConflict
	case ErrCodeRateLimited, ErrCodeTooManyRequests:
		return http.StatusTooManyRequests
	case ErrCodeInsufficientCredits, ErrCodeInvalidOperation, ErrCodeBusinessRule:
		return http.StatusUnprocessableEntity
	default:
		return http.StatusInternalServerError
	}
}

// statusToCode maps HTTP status to error code
func statusToCode(status int) ErrorCode {
	switch status {
	case http.StatusBadRequest:
		return ErrCodeValidation
	case http.StatusUnauthorized:
		return ErrCodeUnauthorized
	case http.StatusForbidden:
		return ErrCodeForbidden
	case http.StatusNotFound:
		return ErrCodeNotFound
	case http.StatusConflict:
		return ErrCodeConflict
	case http.StatusTooManyRequests:
		return ErrCodeRateLimited
	case http.StatusUnprocessableEntity:
		return ErrCodeBusinessRule
	default:
		return ErrCodeInternal
	}
}

// codeToCategory maps error code to monitoring category
func codeToCategory(code ErrorCode) string {
	switch code {
	case ErrCodeValidation, ErrCodeInvalidInput, ErrCodeMissingField, ErrCodeInvalidFormat:
		return ErrorCategoryValidation
	case ErrCodeUnauthorized, ErrCodeInvalidToken, ErrCodeTokenExpired, ErrCodeInvalidCredentials:
		return ErrorCategoryAuth
	case ErrCodeForbidden, ErrCodeInsufficientPermission:
		return ErrorCategoryAuthorization
	case ErrCodeDatabase:
		return ErrorCategoryDatabase
	case ErrCodeExternal:
		return ErrorCategoryExternal
	default:
		return ErrorCategoryInternal
	}
}

// statusToCategory maps HTTP status to monitoring category
func statusToCategory(status int) string {
	switch {
	case status >= 400 && status < 500:
		return ErrorCategoryValidation
	case status >= 500:
		return ErrorCategoryInternal
	default:
		return ErrorCategoryInternal
	}
}
