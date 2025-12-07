package models

import (
	"encoding/json"
	"time"

	"gorm.io/gorm"
)

// NotificationType defines the type of notification
type NotificationType string

const (
	NotificationTypeSession     NotificationType = "session"
	NotificationTypeCredit      NotificationType = "credit"
	NotificationTypeAchievement NotificationType = "achievement"
	NotificationTypeReview      NotificationType = "review"
	NotificationTypeSocial      NotificationType = "social"
)

// Notification represents a user notification in the system
// Notifications are used to inform users about important events:
// - Session requests, approvals, reminders, completions
// - Credit earned, spent, bonus
// - Badge unlocked, milestones
// - Reviews received
// - Social interactions (followers, endorsements)
//
// The data field is JSONB to allow flexible payload structures
// Different notification types can have different data structures
type Notification struct {
	ID        uint                   `gorm:"primaryKey" json:"id"`
	UserID    uint                   `gorm:"index:idx_notifications_user_unread;index:idx_notifications_user_created" json:"user_id"`
	Type      NotificationType `gorm:"type:varchar(50)" json:"type"`
	Title     string           `gorm:"type:varchar(255)" json:"title"`
	Message   string           `gorm:"type:text" json:"message"`
	Data      json.RawMessage  `gorm:"type:jsonb" json:"data"`
	IsRead    bool             `gorm:"default:false;index:idx_notifications_user_unread" json:"is_read"`
	ReadAt    *time.Time             `json:"read_at"`
	CreatedAt time.Time              `gorm:"index:idx_notifications_user_unread;index:idx_notifications_user_created" json:"created_at"`
	UpdatedAt time.Time              `json:"updated_at"`
	DeletedAt gorm.DeletedAt         `gorm:"index" json:"deleted_at"`

	// Relationships
	User *User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE" json:"user,omitempty"`
}

// NotificationData represents the flexible data payload for notifications
// Different notification types use different fields
type NotificationData struct {
	// Session notifications
	SessionID   *uint   `json:"session_id,omitempty"`
	StudentName *string `json:"student_name,omitempty"`
	TeacherName *string `json:"teacher_name,omitempty"`
	SkillName   *string `json:"skill_name,omitempty"`

	// Credit notifications
	Amount *float64 `json:"amount,omitempty"`

	// Badge notifications
	BadgeID   *uint   `json:"badge_id,omitempty"`
	BadgeName *string `json:"badge_name,omitempty"`

	// Review notifications
	ReviewID *uint   `json:"review_id,omitempty"`
	Rating   *int    `json:"rating,omitempty"`
	Comment  *string `json:"comment,omitempty"`

	// Social notifications
	FollowerName *string `json:"follower_name,omitempty"`
	EndorserName *string `json:"endorser_name,omitempty"`
}

// TableName specifies the table name for Notification model
func (Notification) TableName() string {
	return "notifications"
}

// MarshalJSON implements custom JSON marshaling for Notification
func (n *Notification) MarshalJSON() ([]byte, error) {
	type Alias Notification
	return json.Marshal(&struct {
		*Alias
		CreatedAt string `json:"created_at"`
		UpdatedAt string `json:"updated_at"`
		ReadAt    string `json:"read_at,omitempty"`
	}{
		Alias:     (*Alias)(n),
		CreatedAt: n.CreatedAt.Format(time.RFC3339),
		UpdatedAt: n.UpdatedAt.Format(time.RFC3339),
		ReadAt:    func() string { if n.ReadAt != nil { return n.ReadAt.Format(time.RFC3339) }; return "" }(),
	})
}
