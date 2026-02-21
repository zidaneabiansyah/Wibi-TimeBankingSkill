package main

import (
  "fmt"
  "log"
  "time"

  "github.com/gin-gonic/gin"
  "github.com/timebankingskill/backend/internal/config"
  "github.com/timebankingskill/backend/internal/database"
  "github.com/timebankingskill/backend/internal/middleware"
  "github.com/timebankingskill/backend/internal/routes"
)

// @title Wibi Time Banking Skill API
// @version 1.0
// @description This is the backend server for Wibi Time Banking Skill Platform.
// @termsOfService http://swagger.io/terms/

// @contact.name OwlDane
// @contact.url https://github.com/OwlDane
// @contact.email support@wibi.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:8080
// @BasePath /api/v1

// @securityDefinitions.apikey Bearer
// @in header
// @name Authorization
// @description Type "Bearer <your_token>" to authenticate.

func main() {
  // Load configuration
  cfg, err := config.Load()
  if err != nil {
    log.Fatalf("Failed to load config: %v", err)
  }

  // Set Gin mode
  gin.SetMode(cfg.Server.GinMode)

  // Connect to database
  if err := database.Connect(&cfg.Database); err != nil {
    log.Fatalf("Failed to connect to database: %v", err)
  }
  defer database.Close()

  // Run migrations only if explicitly enabled
  if cfg.Server.RunMigrations {
    if err := database.AutoMigrate(); err != nil {
      log.Fatalf("❌ Failed to run migrations: %v", err)
    }
    
    // Create materialized views for query optimization
    if err := database.CreateMaterializedViews(database.DB); err != nil {
      log.Printf("⚠️  Warning: Failed to create materialized views: %v", err)
    }
  } else {
    log.Println("⏭️ Skipping database migrations & materialized views (RUN_MIGRATIONS=false)")
  }

  // Seed initial data (skills, badges) only if enabled
  if cfg.Server.SeedData {
    if err := database.SeedInitialData(); err != nil {
      log.Printf("⚠️  Warning: Failed to seed data: %v", err)
    }
  } else {
    log.Println("⏭️ Skipping initial data seeding (SEED_DATA=false)")
  }

  // Start materialized view auto-refresher (every 10 minutes)
  stopRefresher := database.StartMaterializedViewRefresher(database.DB, 10*time.Minute)
  defer close(stopRefresher)

  // Initialize Gin router
  router := gin.New()

  // Set trusted proxies for security
  // Only trust localhost and internal IPs in development
  // In production, set this to your actual proxy/load balancer IPs
  if cfg.Server.GinMode == "debug" {
    // Development: trust localhost only
    router.SetTrustedProxies([]string{"127.0.0.1", "::1"})
  } else {
    // Production: trust specific IPs (configure via environment)
    // Example: TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12
    trustedProxies := []string{"127.0.0.1"}
    if proxies := cfg.Server.TrustedProxies; proxies != "" {
      trustedProxies = append(trustedProxies, proxies)
    }
    router.SetTrustedProxies(trustedProxies)
  }

  // Apply middleware
  router.Use(middleware.RequestIDMiddleware())
  router.Use(middleware.Logger())
  router.Use(middleware.Recovery())
  router.Use(middleware.CORSWithConfig(cfg))
  router.Use(middleware.ErrorHandler())
  // Rate limiting: 100 requests per minute per IP
  router.Use(middleware.RateLimitMiddleware(100))
  // Monitoring: track metrics and errors
  router.Use(middleware.MonitoringMiddleware())

  // Setup routes
  routes.SetupRoutes(router, database.DB, cfg)

  // Add monitoring endpoints
  router.GET("/health", middleware.HealthCheckMiddleware())
  router.GET("/ready", middleware.ReadinessCheckMiddleware())
  router.GET("/live", middleware.LivenessCheckMiddleware())
  router.GET("/metrics", middleware.MetricsMiddleware())

  // Start server
  addr := fmt.Sprintf(":%s", cfg.Server.Port)
  log.Printf("🚀 WIBI Server starting on http://localhost%s", addr)
  log.Printf("📚 WIBI API Documentation: http://localhost%s/api/v1/health", addr)
  log.Printf("🔐 WIBI Auth endpoints: http://localhost%s/api/v1/auth", addr)

  if err := router.Run(addr); err != nil {
    log.Fatalf("❌ Failed to start server: %v", err)
  }
}
