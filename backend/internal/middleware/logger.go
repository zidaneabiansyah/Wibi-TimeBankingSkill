package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

// Logger returns a custom logger middleware
func Logger() gin.HandlerFunc {
  return func(c *gin.Context) {
    // Start timer
    start := time.Now()
    path := c.Request.URL.Path
    raw := c.Request.URL.RawQuery

    // Process request
    c.Next()

    // Calculate latency
    latency := time.Since(start)

    // Get status code
    statusCode := c.Writer.Status()

    // Build query string
    if raw != "" {
		path = path + "?" + raw
    }

    // Log request details
    log.Printf("[%s] %s %s | Status: %d | Latency: %v | IP: %s",
		c.Request.Method,
		path,
		c.Request.Proto,
		statusCode,
		latency,
		c.ClientIP(),
	)
}
}
