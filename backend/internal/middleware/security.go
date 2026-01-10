package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// SecurityHeadersMiddleware adds security-related headers to the response
func SecurityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent page from being displayed in a frame (Clickjacking protection)
		c.Header("X-Frame-Options", "DENY")

		// Prevent browser from sniffing the MIME type
		c.Header("X-Content-Type-Options", "nosniff")

		// Enable XSS protection in older browsers
		c.Header("X-XSS-Protection", "1; mode=block")

		// Content Security Policy
		// Restrict where resources can be loaded from
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:8080 ws://localhost:8080;")

		// Referrer Policy
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Strict-Transport-Security (HSTS) - only in production/HTTPS
		// c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		// Permitted Cross-Domain Policies
		c.Header("X-Permitted-Cross-Domain-Policies", "none")

		c.Next()
	}
}

// LoginBruteForceMiddleware tracks failed login attempts
type LoginBruteForceTracker struct {
	attempts map[string]*FailCount
	mu       sync.Mutex
	maxFails int
	window   time.Duration
}

type FailCount struct {
	Count     int
	BlockedUntil time.Time
}

func NewLoginBruteForceTracker(maxFails int, window time.Duration) *LoginBruteForceTracker {
	return &LoginBruteForceTracker{
		attempts: make(map[string]*FailCount),
		maxFails: maxFails,
		window:   window,
	}
}

// IsBlocked checks if an IP is currently blocked
func (t *LoginBruteForceTracker) IsBlocked(ip string) bool {
	t.mu.Lock()
	defer t.mu.Unlock()

	fc, exists := t.attempts[ip]
	if !exists {
		return false
	}

	if time.Now().Before(fc.BlockedUntil) {
		return true
	}

	// Reset if window has passed and not blocked
	// Simple cleanup: if not blocked and last access was long ago, we could delete,
	// but for now just returning false is enough.
	return false
}

// RecordFailure increments fail count and blocks if necessary
func (t *LoginBruteForceTracker) RecordFailure(ip string) {
	t.mu.Lock()
	defer t.mu.Unlock()

	fc, exists := t.attempts[ip]
	if !exists {
		t.attempts[ip] = &FailCount{Count: 1}
		return
	}

	fc.Count++
	if fc.Count >= t.maxFails {
		fc.BlockedUntil = time.Now().Add(t.window)
		fc.Count = 0 // Reset for next cycle after block ends
	}
}

// Reset clears the count for an IP (call on successful login)
func (t *LoginBruteForceTracker) Reset(ip string) {
	t.mu.Lock()
	defer t.mu.Unlock()
	delete(t.attempts, ip)
}

// BruteForceMiddleware protects login endpoints
func BruteForceMiddleware(tracker *LoginBruteForceTracker) gin.HandlerFunc {
	return func(c *gin.Context) {
		clientIP := c.ClientIP()

		if tracker.IsBlocked(clientIP) {
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "Account temporarily locked",
				"message": "Too many failed login attempts. Please try again later.",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
