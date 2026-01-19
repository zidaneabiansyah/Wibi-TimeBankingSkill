package models

import (
	"time"

	"gorm.io/gorm"
)

// User represents a platform user (student/teacher)
type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Basic Info
	Email     string `gorm:"uniqueIndex;not null" json:"email"`
	Password  string `gorm:"not null" json:"-"` // Never return password in JSON
	FullName  string `gorm:"not null" json:"full_name"`
	Username  string `gorm:"uniqueIndex;not null" json:"username"`
	
	// Profile Info
	School      string  `json:"school"`
	Grade       string  `json:"grade"`        
	Major       string  `json:"major"`        
	Bio         string  `gorm:"type:text" json:"bio"`
	Avatar      string  `json:"avatar"`       
	PhoneNumber string  `json:"phone_number"`
	Location    string  `json:"location"`     
	
	// Time Banking
	CreditBalance float64 `gorm:"default:3.0" json:"credit_balance"` 
	CreditHeld    float64 `gorm:"default:0" json:"credit_held"`       
	TotalEarned   float64 `gorm:"default:0" json:"total_earned"`
	TotalSpent    float64 `gorm:"default:0" json:"total_spent"`
	
	// Stats
	TotalSessionsAsTeacher int     `gorm:"default:0" json:"total_sessions_as_teacher"`
	TotalSessionsAsStudent int     `gorm:"default:0" json:"total_sessions_as_student"`
	AverageRatingAsTeacher float64 `gorm:"default:0" json:"average_rating_as_teacher"`
	AverageRatingAsStudent float64 `gorm:"default:0" json:"average_rating_as_student"`
	
	// Relationships
	TeachingSkills []UserSkill    `gorm:"foreignKey:UserID" json:"teaching_skills,omitempty"`
	LearningSkills []LearningSkill `gorm:"foreignKey:UserID" json:"learning_skills,omitempty"`
	SessionsAsTeacher []Session   `gorm:"foreignKey:TeacherID" json:"-"`
	SessionsAsStudent []Session   `gorm:"foreignKey:StudentID" json:"-"`
	Transactions   []Transaction  `gorm:"foreignKey:UserID" json:"-"`
	UserBadges     []UserBadge    `gorm:"foreignKey:UserID" json:"badges,omitempty"`
	
	// Account Status
	IsActive           bool       `gorm:"default:true" json:"is_active"`
	IsVerified         bool       `gorm:"default:false" json:"is_verified"`
	VerificationCode   string     `gorm:"size:6" json:"-"`
	VerificationCodeExpiry *time.Time `json:"-"`
	
	// Token versioning - increment this to invalidate all existing tokens
	// Used for security: invalidate tokens after password change
	TokenVersion int `gorm:"default:0" json:"-"`
}

// TableName specifies the table name for User model
func (User) TableName() string {
	return "users"
}

// BeforeCreate hook - runs before creating a new user
func (u *User) BeforeCreate(tx *gorm.DB) error {
	// Set default credit balance if not set
	if u.CreditBalance == 0 {
		u.CreditBalance = 3.0
	}
	return nil
}
// DailyStat represents daily aggregated statistics
type DailyStat struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}
