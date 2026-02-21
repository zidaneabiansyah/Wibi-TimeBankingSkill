package app

import (
	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/config"
	"gorm.io/gorm"
)

// App container holds all dependencies like db, config, logger, repos, services
// This allows for clean Dependency Injection across the application
type App struct {
	DB     *gorm.DB
	Config *config.Config
	Router *gin.Engine

	// We will register repositories & services here as we migrate them
}

// NewApp initializes the application dependency container
func NewApp(cfg *config.Config, db *gorm.DB, router *gin.Engine) *App {
	app := &App{
		DB:     db,
		Config: cfg,
		Router: router,
	}

	app.setupDependencies()
	
	return app
}

// setupDependencies initializes repositories and services 
// and injects them where needed.
// Next will fill this logic.
func (a *App) setupDependencies() {
	// e.g. a.userRepo = postgres.NewUserRepository(a.DB)
	// a.userService = service.NewUserService(a.userRepo)
}
