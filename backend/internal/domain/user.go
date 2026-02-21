package domain

import (
	"context"

	"github.com/timebankingskill/backend/internal/models"
)

// UserRepository represents the capabilities of user storage
type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id uint) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetByUsername(ctx context.Context, username string) (*models.User, error)
	Update(ctx context.Context, user *models.User) error
	Delete(ctx context.Context, id uint) error
}

// UserService represents the capabilities of the user business logic
type UserService interface {
	Register(ctx context.Context, req *models.User) (*models.User, error)
	Login(ctx context.Context, email, password string) (string, *models.User, error)
	GetProfile(ctx context.Context, id uint) (*models.User, error)
	UpdateProfile(ctx context.Context, id uint, req *models.User) (*models.User, error)
}
