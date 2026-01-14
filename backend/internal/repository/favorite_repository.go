package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

type FavoriteRepository interface {
	Create(favorite *models.Favorite) error
	Delete(userID, teacherID uint) error
	GetByUserID(userID uint, limit, offset int) ([]models.Favorite, int64, error)
	Exists(userID, teacherID uint) (bool, error)
}

type favoriteRepository struct {
	db *gorm.DB
}

func NewFavoriteRepository(db *gorm.DB) FavoriteRepository {
	return &favoriteRepository{db: db}
}

func (r *favoriteRepository) Create(favorite *models.Favorite) error {
	return r.db.Create(favorite).Error
}

func (r *favoriteRepository) Delete(userID, teacherID uint) error {
	return r.db.Where("user_id = ? AND teacher_id = ?", userID, teacherID).Delete(&models.Favorite{}).Error
}

func (r *favoriteRepository) GetByUserID(userID uint, limit, offset int) ([]models.Favorite, int64, error) {
	var favorites []models.Favorite
	var total int64

	query := r.db.Model(&models.Favorite{}).Where("user_id = ?", userID)
	
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Teacher").Limit(limit).Offset(offset).Find(&favorites).Error
	return favorites, total, err
}

func (r *favoriteRepository) Exists(userID, teacherID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Favorite{}).Where("user_id = ? AND teacher_id = ?", userID, teacherID).Count(&count).Error
	return count > 0, err
}
