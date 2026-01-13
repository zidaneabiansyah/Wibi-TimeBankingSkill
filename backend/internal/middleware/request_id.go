package middleware

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// RequestIDMiddleware adds a unique request ID to each request
// This helps with debugging, logging, and tracing requests across services
//
// Features:
//   - Generates UUID v4 for each request
//   - Adds X-Request-ID header to response
//   - Stores request ID in context for logging
//   - Reuses existing request ID if provided by client
//
// Usage:
//   router.Use(middleware.RequestIDMiddleware())
//
// Example:
//   Request: GET /api/v1/sessions
//   Response Headers: X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Check if request ID already exists (from load balancer or client)
		requestID := c.GetHeader("X-Request-ID")
		
		// Generate new UUID if not provided
		if requestID == "" {
			requestID = uuid.New().String()
		}
		
		// Store in context for use in handlers and logging
		c.Set("request_id", requestID)
		
		// Add to response headers for client tracking
		c.Header("X-Request-ID", requestID)
		
		// Continue to next handler
		c.Next()
	}
}

// GetRequestID retrieves the request ID from context
// Returns empty string if not found
//
// Parameters:
//   - c: Gin context
//
// Returns:
//   - string: Request ID or empty string
//
// Example:
//   requestID := middleware.GetRequestID(c)
//   log.Printf("Processing request %s", requestID)
func GetRequestID(c *gin.Context) string {
	if requestID, exists := c.Get("request_id"); exists {
		if id, ok := requestID.(string); ok {
			return id
		}
	}
	return ""
}
