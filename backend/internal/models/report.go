package models

import (
	"time"

	"gorm.io/gorm"
)

// ReportType defines the type of content being reported
type ReportType string

const (
	ReportTypeForum ReportType = "forum"
	ReportTypeStory ReportType = "story"
	ReportTypeUser  ReportType = "user"
)

// ReportStatus defines the status of a report
type ReportStatus string

const (
	ReportStatusPending   ReportStatus = "pending"
	ReportStatusResolved  ReportStatus = "resolved"
	ReportStatusDismissed ReportStatus = "dismissed"
)

// Report represents a user report for moderation
type Report struct {
	ID             uint         `gorm:"primaryKey" json:"id"`
	Type           ReportType   `gorm:"type:varchar(20);not null" json:"type"`
	TargetID       uint         `gorm:"not null" json:"target_id"` // ID of the reported entity (thread_id, story_id, user_id)
	ReportedBy     uint         `gorm:"not null" json:"-"`
	Reporter       User         `gorm:"foreignKey:ReportedBy" json:"reporter"`
	Reason         string       `gorm:"type:text;not null" json:"reason"`
	Status         ReportStatus `gorm:"type:varchar(20);default:'pending'" json:"status"`
	Resolution     string       `gorm:"type:text" json:"resolution,omitempty"`
	ResolvedBy     *uint        `json:"-"`
	Resolver       *User        `gorm:"foreignKey:ResolvedBy" json:"resolver,omitempty"`
	ResolvedAt     *time.Time   `json:"resolved_at,omitempty"`
	CreatedAt      time.Time    `json:"created_at"`
	UpdatedAt      time.Time    `json:"updated_at"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}
