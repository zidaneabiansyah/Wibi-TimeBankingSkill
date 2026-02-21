package validator

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

// Init custom validation if needed
func Init() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Register custom validation functions here if needed
		// _ = v.RegisterValidation("custom_tag", customValidationFunc)
		_ = v
	}
}

// FormatValidationError converts gin validation errors into a friendlier format
func FormatValidationError(err error) []map[string]string {
	var errors []map[string]string

	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, e := range validationErrors {
			errors = append(errors, map[string]string{
				"field":   strings.ToLower(e.Field()),
				"message": getErrorMsg(e),
			})
		}
	} else {
		// Fallback for non-validator errors
		errors = append(errors, map[string]string{
			"message": err.Error(),
		})
	}

	return errors
}

func getErrorMsg(fe validator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email format"
	case "min":
		return fmt.Sprintf("Must be at least %s characters", fe.Param())
	case "max":
		return fmt.Sprintf("Must be at most %s characters", fe.Param())
	case "oneof":
		return fmt.Sprintf("Must be one of: %s", fe.Param())
	default:
		return fmt.Sprintf("Failed on the '%s' tag", fe.Tag())
	}
}
