package models

import (
	"time"

	"gorm.io/gorm"
)

// SessionStatus represents the current state of a session
type SessionStatus string

const (
	StatusPending    SessionStatus = "pending"     // Waiting for teacher approval
	StatusApproved   SessionStatus = "approved"    // Teacher approved, scheduled
	StatusRejected   SessionStatus = "rejected"    // Teacher rejected
	StatusInProgress SessionStatus = "in_progress" // Session is happening now
	StatusCompleted  SessionStatus = "completed"   // Session finished
	StatusCancelled  SessionStatus = "cancelled"   // Cancelled by either party
	StatusDisputed   SessionStatus = "disputed"    // Issue reported
)

// SessionMode represents how the session will be conducted
type SessionMode string

const (
	ModeOnline  SessionMode = "online"
	ModeOffline SessionMode = "offline"
	ModeHybrid  SessionMode = "hybrid"
)

// Session represents a teaching/learning session booking
type Session struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Participants
	TeacherID uint `gorm:"not null;index" json:"teacher_id"`
	StudentID uint `gorm:"not null;index" json:"student_id"`
	
	// Skill Being Taught
	UserSkillID uint `gorm:"not null;index" json:"user_skill_id"` // Reference to teacher's skill
	
	// Session Details
	Title       string      `gorm:"not null" json:"title"`
	Description string      `gorm:"type:text" json:"description"` // What student wants to learn
	Duration    float64     `gorm:"not null" json:"duration"`     // In hours (e.g., 1.0, 1.5, 2.0)
	Mode        SessionMode `gorm:"not null" json:"mode"`
	
	// Scheduling
	ScheduledAt   *time.Time `json:"scheduled_at"`    // When the session will happen
	StartedAt     *time.Time `json:"started_at"`      // Actual start time
	CompletedAt   *time.Time `json:"completed_at"`    // Actual completion time
	
	// Status
	Status SessionStatus `gorm:"not null;default:'pending';index" json:"status"`
	
	// Location/Link
	Location    string `json:"location"`     // For offline: address, For online: meet link
	MeetingLink string `json:"meeting_link"` // Zoom/Google Meet link
	
	// Credit Management
	CreditAmount    float64 `gorm:"not null" json:"credit_amount"`     // Credits to be transferred
	CreditHeld      bool    `gorm:"default:false" json:"credit_held"`  // Is credit in escrow?
	CreditReleased  bool    `gorm:"default:false" json:"credit_released"` // Has credit been transferred?
	
	// Check-in tracking (for session start)
	TeacherCheckedIn   bool       `gorm:"default:false" json:"teacher_checked_in"`   // Teacher checked in for session
	StudentCheckedIn   bool       `gorm:"default:false" json:"student_checked_in"`   // Student checked in for session
	TeacherCheckedInAt *time.Time `json:"teacher_checked_in_at"`                     // When teacher checked in
	StudentCheckedInAt *time.Time `json:"student_checked_in_at"`                     // When student checked in

	// Confirmation (for session completion)
	TeacherConfirmed bool `gorm:"default:false" json:"teacher_confirmed"` // Teacher confirmed completion
	StudentConfirmed bool `gorm:"default:false" json:"student_confirmed"` // Student confirmed completion
	
	// Materials & Notes
	Materials string `gorm:"type:text" json:"materials"` // Links to materials, PDFs, etc
	Notes     string `gorm:"type:text" json:"notes"`     // Session notes
	
	// Cancellation
	CancelledBy     *uint  `json:"cancelled_by"`      // User ID who cancelled
	CancellationReason string `gorm:"type:text" json:"cancellation_reason"`
	
	// Relationships
	Teacher   User      `gorm:"foreignKey:TeacherID" json:"teacher,omitempty"`
	Student   User      `gorm:"foreignKey:StudentID" json:"student,omitempty"`
	UserSkill UserSkill `gorm:"foreignKey:UserSkillID" json:"user_skill,omitempty"`
	Review    *Review   `gorm:"foreignKey:SessionID" json:"review,omitempty"`
}

// TableName specifies the table name for Session model
func (Session) TableName() string {
	return "sessions"
}

// CanBeStarted checks if session can be started
func (s *Session) CanBeStarted() bool {
	return s.Status == StatusApproved && s.ScheduledAt != nil
}

// CanBeCompleted checks if session can be marked as completed
func (s *Session) CanBeCompleted() bool {
	return s.Status == StatusInProgress
}

// IsBothConfirmed checks if both parties confirmed completion
func (s *Session) IsBothConfirmed() bool {
	return s.TeacherConfirmed && s.StudentConfirmed
}

// IsBothCheckedIn checks if both parties have checked in for the session
func (s *Session) IsBothCheckedIn() bool {
	return s.TeacherCheckedIn && s.StudentCheckedIn
}

// CanCheckIn checks if session is ready for check-in (approved and scheduled)
func (s *Session) CanCheckIn() bool {
	return s.Status == StatusApproved && s.ScheduledAt != nil
}

// BeforeCreate hook
func (s *Session) BeforeCreate(tx *gorm.DB) error {
	// Set default status
	if s.Status == "" {
		s.Status = StatusPending
	}
	// Calculate credit amount based on duration and hourly rate
	if s.CreditAmount == 0 {
		s.CreditAmount = s.Duration // Default 1:1 ratio
	}
	return nil
}
