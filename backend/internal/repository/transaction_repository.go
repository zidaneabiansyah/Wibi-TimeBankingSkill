package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

type TransactionRepositoryInterface interface {
	Create(transaction *models.Transaction) error
	FindByUserID(userID uint, limit int) ([]models.Transaction, error)
	GetUserBalance(userID uint) (float64, error)
	GetByID(id uint) (*models.Transaction, error)
	GetUserTransactionHistory(userID uint, limit, offset int) ([]models.Transaction, int64, error)
	CountTotal() (int64, error)
	GetTotalVolume() (float64, error)
	GetAllWithFilters(limit, offset int, typeFilter, search string) ([]models.Transaction, int64, error)
}

// TransactionRepository handles database operations for transactions
type TransactionRepository struct {
	db *gorm.DB
}

// NewTransactionRepository creates a new transaction repository
func NewTransactionRepository(db *gorm.DB) *TransactionRepository {
	return &TransactionRepository{db: db}
}

// Create creates a new transaction
func (r *TransactionRepository) Create(transaction *models.Transaction) error {
	return r.db.Create(transaction).Error
}

// FindByUserID finds all transactions for a user
func (r *TransactionRepository) FindByUserID(userID uint, limit int) ([]models.Transaction, error) {
	var transactions []models.Transaction
	query := r.db.Where("user_id = ?", userID).Order("created_at DESC")

	if limit > 0 {
		query = query.Limit(limit)
	}

	err := query.Find(&transactions).Error
	return transactions, err
}

// GetUserBalance calculates user's current balance
func (r *TransactionRepository) GetUserBalance(userID uint) (float64, error) {
	var balance float64
	err := r.db.Model(&models.Transaction{}).
		Where("user_id = ?", userID).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&balance).Error
	return balance, err
}

// GetByID finds a transaction by ID
func (r *TransactionRepository) GetByID(id uint) (*models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.First(&transaction, id).Error
	return &transaction, err
}

// GetUserTransactionHistory gets paginated transaction history for a user
func (r *TransactionRepository) GetUserTransactionHistory(userID uint, limit, offset int) ([]models.Transaction, int64, error) {
	var transactions []models.Transaction
	var total int64

	// Count total transactions
	if err := r.db.Model(&models.Transaction{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated transactions
	err := r.db.Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&transactions).Error

	return transactions, total, err
}
