package models

import (
	"time"

	"gorm.io/gorm"
)

// UsedToken tracks tokens that have already been used
// Prevents token replay attacks for password reset and email verification
//
// Security Features:
//   - One-time use tokens for password reset
//   - Automatic expiration for cleanup
//   - Prevents replay attacks
//
// Usage:
//   Before using a token, check if it's in this table
//   After using a token, add it to this table
type UsedToken struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Token hash (we store hash, not actual token for security)
	TokenHash string `gorm:"uniqueIndex;not null;size:64" json:"-"`

	// Token type (password_reset, email_verification, etc)
	TokenType string `gorm:"not null;size:50;index" json:"token_type"`

	// User who used this token
	UserID uint `gorm:"index" json:"user_id"`

	// When the original token expires (for cleanup)
	OriginalExpiry time.Time `gorm:"index" json:"original_expiry"`

	// IP address that used the token (for audit)
	UsedFromIP string `gorm:"size:45" json:"used_from_ip"`
}

// TableName specifies the table name for UsedToken model
func (UsedToken) TableName() string {
	return "used_tokens"
}

// TokenType constants
const (
	TokenTypePasswordReset     = "password_reset"
	TokenTypeEmailVerification = "email_verification"
	TokenTypeWebSocket         = "websocket"
)
