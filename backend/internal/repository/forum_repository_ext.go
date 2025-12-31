package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// GetAllThreads gets all threads with filters (admin use)
func (r *ForumRepository) GetAllThreads(limit, offset int, search string) ([]models.ForumThread, int64, error) {
	var threads []models.ForumThread
	var total int64

	query := r.db.Model(&models.ForumThread{})

	if search != "" {
		query = query.Where("title ILIKE ? OR content ILIKE ?", "%"+search+"%", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Preload("Author").Preload("Category").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&threads).Error; err != nil {
		return nil, 0, err
	}

	return threads, total, nil
}
