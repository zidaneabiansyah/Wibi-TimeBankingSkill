package repository

import (
  "github.com/timebankingskill/backend/internal/models"
  "gorm.io/gorm"
)

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
