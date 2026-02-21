package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal total sess
func (r *SessionRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).Count(&count).Error
	return count, err
}

// CountCompleted total sess completed
func (r *SessionRepository) CountCompleted() (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).Where("status = ?", models.StatusCompleted).Count(&count).Error
	return count, err
}

// GetAllWithFilters admin all session
func (r *SessionRepository) GetAllWithFilters(limit, offset int, search, status string) ([]models.Session, int64, error) {
	var sessions []models.Session
	var total int64
	q := r.db.Model(&models.Session{})
	if status != "" {
		q = q.Where("status = ?", status)
	}
	if err := q.Count(&total).Error; err != nil {
		return nil, 0, err
	}
	err := q.Order("created_at DESC").Limit(limit).Offset(offset).Find(&sessions).Error
	return sessions, total, err
}

// GetSessionTrend trend over days
func (r *SessionRepository) GetSessionTrend(days int) ([]models.DailyStat, error) {
	return nil, nil // Stub for now
}

// GetAverageDuration daily avg
func (r *SessionRepository) GetAverageDuration() (float64, error) {
	return 0, nil // Stub for now
}
