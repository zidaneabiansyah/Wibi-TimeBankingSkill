package routes

import (
  "github.com/timebankingskill/backend/internal/handler"
  "github.com/timebankingskill/backend/internal/repository"
  "github.com/timebankingskill/backend/internal/service"
  "gorm.io/gorm"
)

// InitializeAuthHandler initializes auth handler with dependencies
func InitializeAuthHandler(db *gorm.DB) *handler.AuthHandler {
  userRepo := repository.NewUserRepository(db)
  transactionRepo := repository.NewTransactionRepository(db)
  authService := service.NewAuthService(userRepo, transactionRepo)
  return handler.NewAuthHandler(authService)
}
