package dto

import (
	"time"

	"github.com/timebankingskill/backend/internal/models"
)

// CreateSessionRequest represents a request to book a session
type CreateSessionRequest struct {
	UserSkillID uint      `json:"user_skill_id" binding:"required"`
	Title       string    `json:"title" binding:"required,min=5,max=200"`
	Description string    `json:"description" binding:"max=1000"`
	Duration    float64   `json:"duration" binding:"required,min=0.5,max=4"`
	Mode        string    `json:"mode" binding:"required,oneof=online offline hybrid"`
	ScheduledAt time.Time `json:"scheduled_at" binding:"required"`
	Location    string    `json:"location"`
	MeetingLink string    `json:"meeting_link"`
}

// ApproveSessionRequest represents a request to approve a session
type ApproveSessionRequest struct {
	ScheduledAt *time.Time `json:"scheduled_at"` // Teacher can reschedule
	MeetingLink string     `json:"meeting_link"`
	Location    string     `json:"location"`
	Notes       string     `json:"notes"`
}

// RejectSessionRequest represents a request to reject a session
type RejectSessionRequest struct {
	Reason string `json:"reason" binding:"required,min=10,max=500"`
}

// CancelSessionRequest represents a request to cancel a session
type CancelSessionRequest struct {
	Reason string `json:"reason" binding:"required,min=10,max=500"`
}

// StartSessionRequest represents a request to start a session
type StartSessionRequest struct {
	Notes string `json:"notes"`
}

// CompleteSessionRequest represents a request to confirm session completion
type CompleteSessionRequest struct {
	Notes string `json:"notes"`
}

// SessionResponse represents a session in API responses
type SessionResponse struct {
	ID                 uint               `json:"id"`
	TeacherID          uint               `json:"teacher_id"`
	StudentID          uint               `json:"student_id"`
	UserSkillID        uint               `json:"user_skill_id"`
	Title              string             `json:"title"`
	Description        string             `json:"description"`
	Duration           float64            `json:"duration"`
	Mode               string             `json:"mode"`
	ScheduledAt        *time.Time         `json:"scheduled_at"`
	StartedAt          *time.Time         `json:"started_at"`
	CompletedAt        *time.Time         `json:"completed_at"`
	Status             string             `json:"status"`
	Location           string             `json:"location"`
	MeetingLink        string             `json:"meeting_link"`
	CreditAmount       float64            `json:"credit_amount"`
	CreditHeld         bool               `json:"credit_held"`
	CreditReleased     bool               `json:"credit_released"`
	TeacherConfirmed   bool               `json:"teacher_confirmed"`
	StudentConfirmed   bool               `json:"student_confirmed"`
	Materials          string             `json:"materials"`
	Notes              string             `json:"notes"`
	CancelledBy        *uint              `json:"cancelled_by"`
	CancellationReason string             `json:"cancellation_reason"`
	Teacher            *UserPublicProfile `json:"teacher,omitempty"`
	Student            *UserPublicProfile `json:"student,omitempty"`
	UserSkill          *UserSkillResponse `json:"user_skill,omitempty"`
	CreatedAt          time.Time          `json:"created_at"`
	UpdatedAt          time.Time          `json:"updated_at"`
}

// SessionListResponse represents a paginated list of sessions
type SessionListResponse struct {
	Sessions []SessionResponse `json:"sessions"`
	Total    int64             `json:"total"`
	Page     int               `json:"page"`
	Limit    int               `json:"limit"`
}

// MapSessionToResponse converts a Session model to SessionResponse DTO
func MapSessionToResponse(session *models.Session) *SessionResponse {
	if session == nil {
		return nil
	}

	resp := &SessionResponse{
		ID:                 session.ID,
		TeacherID:          session.TeacherID,
		StudentID:          session.StudentID,
		UserSkillID:        session.UserSkillID,
		Title:              session.Title,
		Description:        session.Description,
		Duration:           session.Duration,
		Mode:               string(session.Mode),
		ScheduledAt:        session.ScheduledAt,
		StartedAt:          session.StartedAt,
		CompletedAt:        session.CompletedAt,
		Status:             string(session.Status),
		Location:           session.Location,
		MeetingLink:        session.MeetingLink,
		CreditAmount:       session.CreditAmount,
		CreditHeld:         session.CreditHeld,
		CreditReleased:     session.CreditReleased,
		TeacherConfirmed:   session.TeacherConfirmed,
		StudentConfirmed:   session.StudentConfirmed,
		Materials:          session.Materials,
		Notes:              session.Notes,
		CancelledBy:        session.CancelledBy,
		CancellationReason: session.CancellationReason,
		CreatedAt:          session.CreatedAt,
		UpdatedAt:          session.UpdatedAt,
	}

	// Map teacher if loaded
	if session.Teacher.ID != 0 {
		resp.Teacher = &UserPublicProfile{
			ID:       session.Teacher.ID,
			FullName: session.Teacher.FullName,
			Username: session.Teacher.Username,
			Avatar:   session.Teacher.Avatar,
			School:   session.Teacher.School,
			Grade:    session.Teacher.Grade,
		}
	}

	// Map student if loaded
	if session.Student.ID != 0 {
		resp.Student = &UserPublicProfile{
			ID:       session.Student.ID,
			FullName: session.Student.FullName,
			Username: session.Student.Username,
			Avatar:   session.Student.Avatar,
			School:   session.Student.School,
			Grade:    session.Student.Grade,
		}
	}

	// Map user skill if loaded
	if session.UserSkill.ID != 0 {
		userSkillResp := ToUserSkillResponse(&session.UserSkill)
		resp.UserSkill = &userSkillResp
	}

	return resp
}

// MapSessionsToResponse converts a slice of Session models to SessionResponse DTOs
func MapSessionsToResponse(sessions []models.Session) []SessionResponse {
	result := make([]SessionResponse, len(sessions))
	for i, session := range sessions {
		result[i] = *MapSessionToResponse(&session)
	}
	return result
}
