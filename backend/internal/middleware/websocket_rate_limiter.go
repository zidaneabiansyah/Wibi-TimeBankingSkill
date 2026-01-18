package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// WebSocketRateLimiter provides rate limiting for WebSocket connections
// It tracks connections per user and cleans up expired entries
type WebSocketRateLimiter struct {
	mu              sync.RWMutex
	connections     map[uint]int       // userID -> active connection count
	lastCleanup     time.Time
	maxConnections  int
	cleanupInterval time.Duration
}

// NewWebSocketRateLimiter creates a new WebSocket rate limiter
// maxConnections: maximum concurrent WebSocket connections per user
func NewWebSocketRateLimiter(maxConnections int) *WebSocketRateLimiter {
	return &WebSocketRateLimiter{
		connections:     make(map[uint]int),
		lastCleanup:     time.Now(),
		maxConnections:  maxConnections,
		cleanupInterval: 5 * time.Minute,
	}
}

// CanConnect checks if a user can create a new WebSocket connection
func (r *WebSocketRateLimiter) CanConnect(userID uint) bool {
	r.mu.RLock()
	count := r.connections[userID]
	r.mu.RUnlock()
	return count < r.maxConnections
}

// AddConnection increments the connection count for a user
func (r *WebSocketRateLimiter) AddConnection(userID uint) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	// Periodic cleanup of stale entries
	if time.Since(r.lastCleanup) > r.cleanupInterval {
		r.cleanup()
	}

	if r.connections[userID] >= r.maxConnections {
		return false
	}

	r.connections[userID]++
	return true
}

// RemoveConnection decrements the connection count for a user
func (r *WebSocketRateLimiter) RemoveConnection(userID uint) {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.connections[userID] > 0 {
		r.connections[userID]--
	}

	// Clean up if no connections remain
	if r.connections[userID] == 0 {
		delete(r.connections, userID)
	}
}

// GetConnectionCount returns the current connection count for a user
func (r *WebSocketRateLimiter) GetConnectionCount(userID uint) int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.connections[userID]
}

// cleanup removes entries with zero connections (internal, must be called with lock held)
func (r *WebSocketRateLimiter) cleanup() {
	for userID, count := range r.connections {
		if count <= 0 {
			delete(r.connections, userID)
		}
	}
	r.lastCleanup = time.Now()
}

// Global WebSocket rate limiter instance
var wsRateLimiter = NewWebSocketRateLimiter(5) // Max 5 concurrent WS connections per user

// GetWebSocketRateLimiter returns the global WebSocket rate limiter
func GetWebSocketRateLimiter() *WebSocketRateLimiter {
	return wsRateLimiter
}

// WebSocketRateLimitMiddleware is a middleware that limits WebSocket connections per user
// This should be applied to WebSocket upgrade endpoints
// It requires that user_id is already set in the context (e.g., after token validation)
func WebSocketRateLimitMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: user not identified"})
			c.Abort()
			return
		}

		uid, ok := userID.(uint)
		if !ok {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID format"})
			c.Abort()
			return
		}

		if !wsRateLimiter.CanConnect(uid) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Too many WebSocket connections",
				"message": "Maximum concurrent connections reached. Please close some connections and try again.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
