package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal counts all transactions
func (r *TransactionRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.Transaction{}).Count(&count).Error
	return count, err
}

// GetTotalVolume calculates total credit volume transferred
func (r *TransactionRepository) GetTotalVolume() (float64, error) {
	var total float64
	// Sum positive amounts (transfers)
	err := r.db.Model(&models.Transaction{}).
		Where("amount > 0").
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error
	return total, err
}
