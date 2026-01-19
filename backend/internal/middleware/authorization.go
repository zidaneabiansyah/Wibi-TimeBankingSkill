package middleware

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/repository"
)

// SessionAuthorizationMiddleware verifies that the current user is a participant
// (teacher or student) in the requested session. This prevents IDOR attacks
// where users try to access sessions they're not part of.
//
// IDOR Prevention:
//   - Validates session ID from URL parameter
//   - Checks if authenticated user is teacher or student of the session
//   - Stores session in context if authorized for downstream handlers
//
// Usage:
//
//	sessions.GET("/:id/files",
//	    RequireSessionParticipant(sessionRepo),
//	    fileHandler.GetSessionFiles)
//
// Security:
//   - Must be used AFTER AuthMiddleware
//   - Prevents unauthorized access to session data
//   - Logs unauthorized access attempts
func RequireSessionParticipant(sessionRepo *repository.SessionRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get authenticated user ID
		userID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error":   "Authentication required",
				"message": "Please login to access this resource",
			})
			c.Abort()
			return
		}

		// Parse session ID from URL
		sessionIDStr := c.Param("id")
		if sessionIDStr == "" {
			sessionIDStr = c.Param("sessionId")
		}

		sessionID, err := strconv.ParseUint(sessionIDStr, 10, 32)
		if err != nil || sessionID == 0 {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "Invalid session ID",
				"message": "Session ID must be a valid number",
			})
			c.Abort()
			return
		}

		// Fetch session from database
		session, err := sessionRepo.GetByID(uint(sessionID))
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{
				"error":   "Session not found",
				"message": "The requested session does not exist",
			})
			c.Abort()
			return
		}

		// Check if user is a participant (teacher or student)
		uid := userID.(uint)
		if session.TeacherID != uid && session.StudentID != uid {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Access denied",
				"message": "You are not authorized to access this session",
			})
			c.Abort()
			return
		}

		// Store session in context for downstream handlers
		c.Set("session", session)
		c.Set("session_id", uint(sessionID))
		c.Set("is_teacher", session.TeacherID == uid)
		c.Set("is_student", session.StudentID == uid)

		c.Next()
	}
}

// RequireSessionTeacher ensures only the teacher can access the resource
// Use for teacher-only operations like approving sessions
func RequireSessionTeacher(sessionRepo *repository.SessionRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// First run the participant check
		RequireSessionParticipant(sessionRepo)(c)
		if c.IsAborted() {
			return
		}

		// Check if user is specifically the teacher
		isTeacher, _ := c.Get("is_teacher")
		if !isTeacher.(bool) {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Teacher access required",
				"message": "Only the session teacher can perform this action",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireSessionStudent ensures only the student can access the resource
// Use for student-only operations like booking sessions
func RequireSessionStudent(sessionRepo *repository.SessionRepository) gin.HandlerFunc {
	return func(c *gin.Context) {
		// First run the participant check
		RequireSessionParticipant(sessionRepo)(c)
		if c.IsAborted() {
			return
		}

		// Check if user is specifically the student
		isStudent, _ := c.Get("is_student")
		if !isStudent.(bool) {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Student access required",
				"message": "Only the session student can perform this action",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireResourceOwner is a generic middleware for resources with user_id field
// Prevents IDOR for user-owned resources like profiles, favorites, etc.
//
// Usage:
//
//	router.DELETE("/favorites/:id",
//	    RequireResourceOwner("user_id"),
//	    favoriteHandler.Delete)
func RequireResourceOwner(userIDField string) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get authenticated user ID
		authUserID, exists := c.Get("user_id")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Authentication required",
			})
			c.Abort()
			return
		}

		// Get resource owner ID from context (set by previous handler)
		resourceOwnerID, exists := c.Get(userIDField)
		if !exists {
			// If not in context, this middleware doesn't apply
			c.Next()
			return
		}

		// Compare user IDs
		if authUserID.(uint) != resourceOwnerID.(uint) {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Access denied",
				"message": "You can only access your own resources",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

// RequireAdmin ensures only admin users can access the resource
func RequireAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		isAdmin, exists := c.Get("is_admin")
		if !exists || !isAdmin.(bool) {
			c.JSON(http.StatusForbidden, gin.H{
				"error":   "Admin access required",
				"message": "You don't have permission to access this resource",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}
