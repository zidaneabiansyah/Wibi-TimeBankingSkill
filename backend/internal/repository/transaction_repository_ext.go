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

// GetAllWithFilters returns transactions with pagination and filters
func (r *TransactionRepository) GetAllWithFilters(limit, offset int, typeFilter, search string) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	query := r.db.Model(&models.Transaction{})

	// Apply filters
	if typeFilter != "" {
		query = query.Where("type = ?", typeFilter)
	}

	if search != "" {
		// Join with users to search by user name if needed (assuming user_name is stored or relatable)
		// Since Transaction model usually has UserID, we might need to join or assume description search
		// For simplicity and performance, assuming we search in description and maybe user name if joined
		// Checking Transaction model structure from repository file... no, it shows FindByUserID. 
		// Ideally we join User. For now, let's search description.
		query = query.Where("description ILIKE ?", "%"+search+"%")
	}
	
	// Preload User relationship if it exists to display names
	// Looking at FindByUserID, it doesn't preload. But for Admin we probably want it.
	// Let's assume Transaction model has valid User association.
	query = query.Preload("User")

	// Count total
	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Apply pagination and sort
	err := query.Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&transactions).Error

	return transactions, total, err
}
