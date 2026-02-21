package middleware

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
)

// ErrorHandler intercepts errors from gin context and formats them
func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		// Check if there are any errors
		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err

			// Log the error
			log.Printf("[ErrorHandler] Intercepted Error: %v", err)

			// Try to handle it as our custom AppError
			if appErr, ok := err.(*errors.AppError); ok {
				response.Error(c, appErr)
				return
			}

			// Unknown error default to internal server error
			internalErr := errors.ErrInternalServer.WithDetails(err.Error())
			response.Error(c, internalErr)
		}
	}
}

// Recovery returns recovery middleware for panic handling
func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		log.Printf("[PanicRecovery] Panic recovered: %v", recovered)

		internalErr := errors.ErrInternalServer.WithDetails("An unexpected panic occurred")
		response.Error(c, internalErr)
		
		// Optional: Abort to prevent trailing execution
		c.Abort()
	})
}