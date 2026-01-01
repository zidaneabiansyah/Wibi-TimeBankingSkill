package models

import (
	"time"

	"gorm.io/gorm"
)

// BadgeType represents the category of badge
type BadgeType string

const (
	BadgeTypeAchievement BadgeType = "achievement" // General achievements
	BadgeTypeMilestone   BadgeType = "milestone"   // Session/credit milestones
	BadgeTypeQuality     BadgeType = "quality"     // Quality-based (ratings)
	BadgeTypeSpecial     BadgeType = "special"     // Special events, early adopter
)

// Badge represents an achievement badge
type Badge struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Badge Info
	Name        string    `gorm:"not null;uniqueIndex" json:"name"`
	Description string    `gorm:"type:text" json:"description"`
	Icon        string    `json:"icon"` // Icon URL or emoji
	Type        BadgeType `gorm:"not null" json:"type"`

	// Requirements (stored as JSON for flexibility)
	Requirements string `gorm:"type:jsonb" json:"requirements"` // e.g., {"sessions": 10, "rating": 4.5}

	// Reward
	BonusCredits float64 `gorm:"default:0" json:"bonus_credits"` // Bonus credits when earned

	// Rarity
	Rarity int `gorm:"default:1" json:"rarity"` // 1-5, higher = more rare

	// Stats
	TotalAwarded int `gorm:"default:0" json:"total_awarded"` // How many users have this badge
	TotalEarned  int `gorm:"-" json:"total_earned"`         // Alias for total_awarded for frontend consistency

	// Display
	Color        string `json:"color"` // Badge color (hex)
	IsActive     bool   `gorm:"default:true" json:"is_active"`
	DisplayOrder int    `gorm:"default:0" json:"display_order"`

	// Relationships
	UserBadges []UserBadge `gorm:"foreignKey:BadgeID" json:"-"`
}

// TableName specifies the table name for Badge model
func (Badge) TableName() string {
	return "badges"
}

// UserBadge represents a badge earned by a user
type UserBadge struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	UserID  uint `gorm:"not null;index" json:"user_id"`
	BadgeID uint `gorm:"not null;index" json:"badge_id"`

	// When earned
	EarnedAt time.Time `gorm:"not null" json:"earned_at"`

	// Progress tracking (for progressive badges)
	Progress     int `gorm:"default:0" json:"progress"`      // Current progress
	ProgressGoal int `gorm:"default:0" json:"progress_goal"` // Goal to achieve

	// Display
	IsPinned bool `gorm:"default:false" json:"is_pinned"` // User can pin favorite badges

	// Relationships
	User  User  `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Badge Badge `gorm:"foreignKey:BadgeID" json:"badge,omitempty"`
}

// TableName specifies the table name for UserBadge model
func (UserBadge) TableName() string {
	return "user_badges"
}

// IsCompleted checks if badge is fully earned
func (ub *UserBadge) IsCompleted() bool {
	if ub.ProgressGoal == 0 {
		return true
	}
	return ub.Progress >= ub.ProgressGoal
}

// ProgressPercentage calculates completion percentage
func (ub *UserBadge) ProgressPercentage() float64 {
	if ub.ProgressGoal == 0 {
		return 100.0
	}
	return (float64(ub.Progress) / float64(ub.ProgressGoal)) * 100.0
}
