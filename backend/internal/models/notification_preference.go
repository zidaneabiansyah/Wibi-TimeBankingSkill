package models

import "time"

// NotificationPreference stores per-user notification settings.
// If no record exists for a user, all notifications default to enabled.
// Uses upsert pattern (FirstOrCreate + Save) for thread-safe updates.
type NotificationPreference struct {
	ID                       uint      `gorm:"primaryKey" json:"id"`
	UserID                   uint      `gorm:"uniqueIndex;not null" json:"user_id"`
	SessionNotifications     bool      `gorm:"default:true" json:"session_notifications"`
	CreditNotifications      bool      `gorm:"default:true" json:"credit_notifications"`
	AchievementNotifications bool      `gorm:"default:true" json:"achievement_notifications"`
	ReviewNotifications      bool      `gorm:"default:true" json:"review_notifications"`
	EmailNotifications       bool      `gorm:"default:true" json:"email_notifications"`
	PushNotifications        bool      `gorm:"default:false" json:"push_notifications"`
	QuietHours               bool      `gorm:"default:false" json:"quiet_hours"`
	QuietHoursStart          string    `gorm:"default:'22:00'" json:"quiet_hours_start"`
	QuietHoursEnd            string    `gorm:"default:'07:00'" json:"quiet_hours_end"`
	CreatedAt                time.Time `json:"created_at"`
	UpdatedAt                time.Time `json:"updated_at"`
}

// TableName specifies the table name for GORM
func (NotificationPreference) TableName() string {
	return "notification_preferences"
}
