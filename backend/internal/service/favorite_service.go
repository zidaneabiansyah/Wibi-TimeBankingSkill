package service

import (
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

type FavoriteService interface {
	AddFavorite(userID, teacherID uint) error
	RemoveFavorite(userID, teacherID uint) error
	GetFavorites(userID uint, limit, offset int) ([]models.Favorite, int64, error)
	IsFavorite(userID, teacherID uint) (bool, error)
}

type favoriteService struct {
	repo repository.FavoriteRepository
}

func NewFavoriteService(repo repository.FavoriteRepository) FavoriteService {
	return &favoriteService{repo: repo}
}

func (s *favoriteService) AddFavorite(userID, teacherID uint) error {
	exists, err := s.repo.Exists(userID, teacherID)
	if err != nil {
		return err
	}
	if exists {
		return nil // Already favorited
	}

	favorite := &models.Favorite{
		UserID:    userID,
		TeacherID: teacherID,
	}
	return s.repo.Create(favorite)
}

func (s *favoriteService) RemoveFavorite(userID, teacherID uint) error {
	return s.repo.Delete(userID, teacherID)
}

func (s *favoriteService) GetFavorites(userID uint, limit, offset int) ([]models.Favorite, int64, error) {
	return s.repo.GetByUserID(userID, limit, offset)
}

func (s *favoriteService) IsFavorite(userID, teacherID uint) (bool, error) {
	return s.repo.Exists(userID, teacherID)
}
