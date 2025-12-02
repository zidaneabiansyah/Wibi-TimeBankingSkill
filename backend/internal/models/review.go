package models

import (
	"time"

	"gorm.io/gorm"
)

// ReviewType indicates who is being reviewed
type ReviewType string

const (
	ReviewTypeTeacher ReviewType = "teacher" // Review for the teacher
	ReviewTypeStudent ReviewType = "student" // Review for the student
)

// Review represents a rating and review after a session
type Review struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Session & Users
	SessionID  uint `gorm:"not null;uniqueIndex:idx_session_reviewer" json:"session_id"`
	ReviewerID uint `gorm:"not null;uniqueIndex:idx_session_reviewer;index" json:"reviewer_id"` // Who wrote the review
	RevieweeID uint `gorm:"not null;index" json:"reviewee_id"` // Who is being reviewed
	
	// Review Type
	Type ReviewType `gorm:"not null" json:"type"`
	
	// Rating (1-5 stars)
	Rating int `gorm:"not null;check:rating >= 1 AND rating <= 5" json:"rating"`
	
	// Review Content
	Comment string `gorm:"type:text" json:"comment"`
	
	// Tags/Badges (e.g., "Patient", "Clear Explanation", "Punctual")
	Tags string `gorm:"type:text" json:"tags"` // Comma-separated or JSON array
	
	// Specific Ratings (optional, more detailed feedback)
	CommunicationRating *int `gorm:"check:communication_rating >= 1 AND communication_rating <= 5" json:"communication_rating"`
	PunctualityRating   *int `gorm:"check:punctuality_rating >= 1 AND punctuality_rating <= 5" json:"punctuality_rating"`
	KnowledgeRating     *int `gorm:"check:knowledge_rating >= 1 AND knowledge_rating <= 5" json:"knowledge_rating"`
	
	// Helpful votes (other users can upvote helpful reviews)
	HelpfulCount int `gorm:"default:0" json:"helpful_count"`
	
	// Moderation
	IsReported bool   `gorm:"default:false" json:"is_reported"`
	IsHidden   bool   `gorm:"default:false" json:"is_hidden"`
	
	// Relationships
	Session  Session `gorm:"foreignKey:SessionID" json:"session,omitempty"`
	Reviewer User    `gorm:"foreignKey:ReviewerID" json:"reviewer,omitempty"`
	Reviewee User    `gorm:"foreignKey:RevieweeID" json:"reviewee,omitempty"`
}

// TableName specifies the table name for Review model
func (Review) TableName() string {
	return "reviews"
}

// BeforeCreate hook
func (r *Review) BeforeCreate(tx *gorm.DB) error {
	// Ensure rating is within valid range
	if r.Rating < 1 || r.Rating > 5 {
		r.Rating = 5 // Default to 5 if invalid
	}
	return nil
}

// AverageDetailedRating calculates average of detailed ratings
func (r *Review) AverageDetailedRating() float64 {
	count := 0
	sum := 0
	
	if r.CommunicationRating != nil {
		sum += *r.CommunicationRating
		count++
	}
	if r.PunctualityRating != nil {
		sum += *r.PunctualityRating
		count++
	}
	if r.KnowledgeRating != nil {
		sum += *r.KnowledgeRating
		count++
	}
	
	if count == 0 {
		return float64(r.Rating)
	}
	
	return float64(sum) / float64(count)
}
