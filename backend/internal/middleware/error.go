package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ErrorResponse represents a standard error response
type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Error   string `json:"error,omitempty"`
}

// ErrorHandler returns error handling middleware
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors
		if len(c.Errors) > 0 {
			err := c.Errors.Last()

			// Log the error
			log.Printf("Error: %v", err.Err)

			// Determine status code
			statusCode := http.StatusInternalServerError
			if c.Writer.Status() != http.StatusOK {
				statusCode = c.Writer.Status()
			}

			// Send error response
			c.JSON(statusCode, ErrorResponse{
				Success: false,
				Message: "An error occurred",
				Error:   err.Error(),
			})
		}
	}
}

// Recovery returns recovery middleware for panic handling
func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		log.Printf("Panic recovered: %v", recovered)

		c.JSON(http.StatusInternalServerError, ErrorResponse{
			Success: false,
			Message: "Internal server error",
			Error:   "An unexpected error occurred",
		})
	})
}