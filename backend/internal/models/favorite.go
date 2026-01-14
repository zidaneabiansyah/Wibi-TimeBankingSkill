package models

import (
	"time"

	"gorm.io/gorm"
)

// Favorite represents a teacher favorited by a student
type Favorite struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	UserID    uint `gorm:"not null;index" json:"user_id"`    // The user who favorited
	TeacherID uint `gorm:"not null;index" json:"teacher_id"` // The teacher being favorited

	// Relationships
	User    User `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Teacher User `gorm:"foreignKey:TeacherID" json:"teacher,omitempty"`
}

// TableName specifies the table name for Favorite model
func (Favorite) TableName() string {
	return "favorites"
}
