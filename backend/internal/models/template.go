package models

import (
	"time"

	"gorm.io/gorm"
)

// SessionTemplate represents a reusable session configuration created by a teacher
type SessionTemplate struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	UserID      uint   `gorm:"not null;index" json:"user_id"` // The teacher who owns the template
	UserSkillID uint   `gorm:"not null;index" json:"user_skill_id"`
	Title       string `gorm:"not null" json:"title"`
	Description string `gorm:"type:text" json:"description"`
	Duration    float64 `gorm:"not null" json:"duration"` // In hours
	Mode        SessionMode `gorm:"not null;default:'online'" json:"mode"`
	Location    string `json:"location"`
	MeetingLink string `json:"meeting_link"`

	// Relationships
	User      User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	UserSkill UserSkill `gorm:"foreignKey:UserSkillID" json:"user_skill,omitempty"`
}

// TableName specifies the table name for SessionTemplate model
func (SessionTemplate) TableName() string {
	return "session_templates"
}
