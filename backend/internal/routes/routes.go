package routes

import (
  "github.com/gin-gonic/gin"
  "github.com/timebankingskill/backend/internal/middleware"
  "gorm.io/gorm"
)

// SetupRoutes configures all application routes
func SetupRoutes(router *gin.Engine, db *gorm.DB) {
  // Initialize handlers
  authHandler := InitializeAuthHandler(db)

  // API v1 group
  v1 := router.Group("/api/v1")
  {
    // Health check
    v1.GET("/health", func(c *gin.Context) {
      c.JSON(200, gin.H{
        "status":  "ok",
        "message": "Time Banking API v1 is running",
      })
    })

    // Auth routes (public)
    auth := v1.Group("/auth")
    {
      auth.POST("/register", authHandler.Register)
      auth.POST("/login", authHandler.Login)
      auth.POST("/logout", middleware.AuthMiddleware(), authHandler.Logout)
      auth.GET("/profile", middleware.AuthMiddleware(), authHandler.GetProfile)
    }

    // Protected routes (require authentication)
    protected := v1.Group("")
    protected.Use(middleware.AuthMiddleware())
    {
      // User routes
      users := protected.Group("/users")
      {
        users.GET("/me", authHandler.GetProfile)
        // More user routes will be added here
      }

      // Skills routes will be added here
      // Sessions routes will be added here
      // Reviews routes will be added here
    }
  }
}
