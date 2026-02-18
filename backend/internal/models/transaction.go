package models

import (
	"time"

	"gorm.io/gorm"
)

// TransactionType represents the type of credit transaction
type TransactionType string

const (
	TransactionEarned  TransactionType = "earned"  // Earned from teaching
	TransactionSpent   TransactionType = "spent"   // Spent on learning
	TransactionBonus   TransactionType = "bonus"   // Bonus credits (achievements, etc)
	TransactionRefund  TransactionType = "refund"  // Refunded from cancelled session
	TransactionPenalty TransactionType = "penalty" // Penalty for no-show, etc
	TransactionInitial TransactionType = "initial" // Initial free credits
	TransactionHold    TransactionType = "hold"    // Credits held in escrow for pending session
)

// Transaction represents a credit transaction history
type Transaction struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// User
	UserID uint `gorm:"not null;index" json:"user_id"`

	// Transaction Details
	Type          TransactionType `gorm:"not null;index" json:"type"`
	Amount        float64         `gorm:"not null" json:"amount"` // Positive for credit, negative for debit
	BalanceBefore float64         `gorm:"not null" json:"balance_before"`
	BalanceAfter  float64         `gorm:"not null" json:"balance_after"`

	// Reference
	SessionID   *uint  `gorm:"index" json:"session_id"` // Related session (if applicable)
	Description string `gorm:"type:text" json:"description"`

	// Metadata
	Metadata string `gorm:"type:jsonb" json:"metadata"` // Additional data in JSON format

	// Relationships
	User    User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Session *Session `gorm:"foreignKey:SessionID" json:"session,omitempty"`
}

// TableName specifies the table name for Transaction model
func (Transaction) TableName() string {
	return "transactions"
}

// BeforeCreate hook to ensure Metadata has valid JSON
func (t *Transaction) BeforeCreate(tx *gorm.DB) error {
	if t.Metadata == "" {
		t.Metadata = "{}"
	}
	return nil
}

// IsCredit checks if transaction adds credits
func (t *Transaction) IsCredit() bool {
	return t.Amount > 0
}

// IsDebit checks if transaction deducts credits
func (t *Transaction) IsDebit() bool {
	return t.Amount < 0
}