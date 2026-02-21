package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal total user
func (r *UserRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Count(&count).Error
	return count, err
}

// CountActive active user
func (r *UserRepository) CountActive() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("is_active = ?", true).Count(&count).Error
	return count, err
}

func (r *UserRepository) GetAllWithFilters(limit, offset int, search, status string) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.db.Model(&models.User{})

	if search != "" {
		query = query.Where("full_name ILIKE ? OR email ILIKE ? OR username ILIKE ?", "%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status != "" {
		if status == "active" {
			query = query.Where("is_active = ?", true)
		} else if status == "inactive" {
			query = query.Where("is_active = ?", false)
		}
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&users).Error; err != nil {
		return nil, 0, err
	}

	return users, total, nil
}
