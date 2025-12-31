package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal counts all users
func (r *UserRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Count(&count).Error
	return count, err
}

// CountActive counts active users
func (r *UserRepository) CountActive() (int64, error) {
	var count int64
	err := r.db.Model(&models.User{}).Where("is_active = ?", true).Count(&count).Error
	return count, err
}

// GetAllWithFilters returns all users with optional filters and pagination
func (r *UserRepository) GetAllWithFilters(limit, offset int, search, status string) ([]models.User, int64, error) {
	var users []models.User
	var total int64

	query := r.db.Model(&models.User{})

	if search != "" {
		query = query.Where("full_name ILIKE ? OR email ILIKE ? OR username ILIKE ?", 
			"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status != "" {
		if status == "active" {
			query = query.Where("is_active = ?", true)
		} else if status == "suspended" {
			query = query.Where("is_active = ?", false)
		} else if status == "verification" {
			query = query.Where("is_verified = ?", false)
		}
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Order("created_at DESC").Limit(limit).Offset(offset).Find(&users).Error
	return users, total, err
}
