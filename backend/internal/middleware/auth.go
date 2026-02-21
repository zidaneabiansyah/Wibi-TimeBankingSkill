package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/utils"
	"github.com/timebankingskill/backend/pkg/errors"
	"github.com/timebankingskill/backend/pkg/response"
)

// AuthMiddleware validates JWT token from cookie or Authorization header
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		var token string

		// Try to get token from cookie first (more secure)
		token = utils.GetAuthCookie(c)

		// Fallback to Authorization header if no cookie
		if token == "" {
			authHeader := c.GetHeader("Authorization")
			if authHeader == "" {
				response.Error(c, errors.ErrUnauthorized.WithDetails("Authentication required"))
				c.Abort()
				return
			}

			// Check if it's a Bearer token
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || parts[0] != "Bearer" {
				response.Error(c, errors.ErrUnauthorized.WithDetails("Invalid authorization header format"))
				c.Abort()
				return
			}

			token = parts[1]
		}

		// Validate token
		claims, err := utils.ValidateToken(token)
		if err != nil {
			response.Error(c, errors.ErrUnauthorized.WithDetails("Invalid or expired token: "+err.Error()))
			c.Abort()
			return
		}

		// Set user ID in context (use snake_case for consistency with handlers)
		c.Set("user_id", claims.UserID)
		c.Set("email", claims.Email)

		c.Next()
	}
}

// OptionalAuth is like AuthMiddleware but doesn't abort if no token
func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && parts[0] == "Bearer" {
			token := parts[1]
			claims, err := utils.ValidateToken(token)
			if err == nil {
				c.Set("user_id", claims.UserID)
				c.Set("email", claims.Email)
			}
		}

		c.Next()
	}
}
