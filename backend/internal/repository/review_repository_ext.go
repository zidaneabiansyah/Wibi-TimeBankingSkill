package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// GetAveragePlatformRating calculates average rating across all reviews
func (r *ReviewRepository) GetAveragePlatformRating() (float64, error) {
	var avgRating float64
	err := r.db.Model(&models.Review{}).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&avgRating).Error
	return avgRating, err
}
