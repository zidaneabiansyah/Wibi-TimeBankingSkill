package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Cookie constants
const (
	AuthCookieName = "auth_token"
	CookieMaxAge   = 7 * 24 * 3600 // 7 days in seconds
)

// SetAuthCookie sets httpOnly authentication cookie
// This is more secure than localStorage as JavaScript cannot access it
//
// Security features:
//   - httpOnly: true - JavaScript cannot read cookie (prevents XSS)
//   - Secure: true - Only sent over HTTPS (prevents MITM)
//   - SameSite: Strict - Prevents CSRF attacks
//
// Parameters:
//   - c: Gin context
//   - token: JWT token to store
//
// Example:
//
//	SetAuthCookie(c, jwtToken)
//	// Cookie will be automatically sent by browser on subsequent requests
func SetAuthCookie(c *gin.Context, token string) {
	// Detect if running in development (localhost)
	isDevelopment := c.Request.Host == "localhost:8080" || c.Request.Host == "localhost:3000"

	c.SetSameSite(http.SameSiteStrictMode)
	c.SetCookie(
		AuthCookieName, // name
		token,          // value
		CookieMaxAge,   // maxAge (7 days)
		"/",            // path
		"",             // domain (empty = current domain)
		!isDevelopment, // secure (HTTPS only, but false for localhost development)
		true,           // httpOnly (JavaScript cannot access)
	)
}

// ClearAuthCookie removes the authentication cookie
// Call this on logout
//
// Example:
//
//	ClearAuthCookie(c)
//	c.JSON(200, gin.H{"message": "Logged out successfully"})
func ClearAuthCookie(c *gin.Context) {
	c.SetCookie(
		AuthCookieName,
		"",    // empty value
		-1,    // negative maxAge = delete immediately
		"/",   // path
		"",    // domain
		false, // secure (doesn't matter when deleting)
		true,  // httpOnly
	)
}

// GetAuthCookie retrieves the authentication token from cookie
// Returns empty string if cookie doesn't exist
//
// Example:
//
//	token := GetAuthCookie(c)
//	if token == "" {
//	    return // No auth cookie
//	}
func GetAuthCookie(c *gin.Context) string {
	token, err := c.Cookie(AuthCookieName)
	if err != nil {
		return ""
	}
	return token
}
