package service

import (
	"errors"
	"time"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

type SessionService struct {
	sessionRepo     *repository.SessionRepository
	userRepo        *repository.UserRepository
	skillRepo       *repository.SkillRepository
	transactionRepo *repository.TransactionRepository
}

func NewSessionService(
	sessionRepo *repository.SessionRepository,
	userRepo *repository.UserRepository,
	skillRepo *repository.SkillRepository,
	transactionRepo *repository.TransactionRepository,
) *SessionService {
	return &SessionService{
		sessionRepo:     sessionRepo,
		userRepo:        userRepo,
		skillRepo:       skillRepo,
		transactionRepo: transactionRepo,
	}
}

// BookSession creates a new session request from student to teacher
func (s *SessionService) BookSession(studentID uint, req *dto.CreateSessionRequest) (*dto.SessionResponse, error) {
	// Get the user skill to find the teacher
	userSkill, err := s.skillRepo.GetUserSkillByID(req.UserSkillID)
	if err != nil {
		return nil, errors.New("skill not found")
	}

	// Validate teacher is not the student
	if userSkill.UserID == studentID {
		return nil, errors.New("you cannot book a session with yourself")
	}

	// Check if skill is available
	if !userSkill.IsAvailable {
		return nil, errors.New("this skill is currently not available for booking")
	}

	// Check if there's already an active session
	exists, err := s.sessionRepo.ExistsActiveSession(userSkill.UserID, studentID, req.UserSkillID)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("you already have an active session request for this skill")
	}

	// Get student to check credit balance
	student, err := s.userRepo.FindByID(studentID)
	if err != nil {
		return nil, errors.New("student not found")
	}

	// Calculate credit amount
	creditAmount := req.Duration * userSkill.HourlyRate
	if creditAmount == 0 {
		creditAmount = req.Duration // Default 1:1 ratio
	}

	// Check if student has enough credits
	if student.CreditBalance < creditAmount {
		return nil, errors.New("insufficient credit balance")
	}

	// Validate scheduled time is in the future
	if req.ScheduledAt.Before(time.Now()) {
		return nil, errors.New("scheduled time must be in the future")
	}

	// Create session
	session := &models.Session{
		TeacherID:    userSkill.UserID,
		StudentID:    studentID,
		UserSkillID:  req.UserSkillID,
		Title:        req.Title,
		Description:  req.Description,
		Duration:     req.Duration,
		Mode:         models.SessionMode(req.Mode),
		ScheduledAt:  &req.ScheduledAt,
		Location:     req.Location,
		MeetingLink:  req.MeetingLink,
		CreditAmount: creditAmount,
		Status:       models.StatusPending,
	}

	if err := s.sessionRepo.Create(session); err != nil {
		return nil, errors.New("failed to create session")
	}

	// Reload session with relationships
	session, err = s.sessionRepo.GetByID(session.ID)
	if err != nil {
		return nil, err
	}

	return dto.MapSessionToResponse(session), nil
}

// ApproveSession allows teacher to approve a pending session
func (s *SessionService) ApproveSession(teacherID, sessionID uint, req *dto.ApproveSessionRequest) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify teacher owns this session
	if session.TeacherID != teacherID {
		return nil, errors.New("you are not authorized to approve this session")
	}

	// Verify session is pending
	if session.Status != models.StatusPending {
		return nil, errors.New("session is not pending approval")
	}

	// Get student to hold credits
	student, err := s.userRepo.FindByID(session.StudentID)
	if err != nil {
		return nil, errors.New("student not found")
	}

	// Check if student still has enough credits
	if student.CreditBalance < session.CreditAmount {
		return nil, errors.New("student has insufficient credits")
	}

	// Hold credits from student
	student.CreditBalance -= session.CreditAmount
	if err := s.userRepo.Update(student); err != nil {
		return nil, errors.New("failed to hold credits")
	}

	// Create hold transaction
	holdTransaction := &models.Transaction{
		UserID:        session.StudentID,
		Type:          models.TransactionHold,
		Amount:        -session.CreditAmount,
		BalanceBefore: student.CreditBalance + session.CreditAmount,
		BalanceAfter:  student.CreditBalance,
		Description:   "Credit hold for session: " + session.Title,
		SessionID:     &session.ID,
	}
	_ = s.transactionRepo.Create(holdTransaction)

	// Update session
	session.Status = models.StatusApproved
	session.CreditHeld = true

	// Allow teacher to reschedule
	if req.ScheduledAt != nil {
		session.ScheduledAt = req.ScheduledAt
	}
	if req.MeetingLink != "" {
		session.MeetingLink = req.MeetingLink
	}
	if req.Location != "" {
		session.Location = req.Location
	}
	if req.Notes != "" {
		session.Notes = req.Notes
	}

	if err := s.sessionRepo.Update(session); err != nil {
		return nil, errors.New("failed to approve session")
	}

	return dto.MapSessionToResponse(session), nil
}

// RejectSession allows teacher to reject a pending session
func (s *SessionService) RejectSession(teacherID, sessionID uint, req *dto.RejectSessionRequest) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify teacher owns this session
	if session.TeacherID != teacherID {
		return nil, errors.New("you are not authorized to reject this session")
	}

	// Verify session is pending
	if session.Status != models.StatusPending {
		return nil, errors.New("session is not pending")
	}

	// Update session
	session.Status = models.StatusRejected
	session.CancellationReason = req.Reason
	session.CancelledBy = &teacherID

	if err := s.sessionRepo.Update(session); err != nil {
		return nil, errors.New("failed to reject session")
	}

	return dto.MapSessionToResponse(session), nil
}

// StartSession marks a session as in progress
func (s *SessionService) StartSession(userID, sessionID uint) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify user is part of this session
	if session.TeacherID != userID && session.StudentID != userID {
		return nil, errors.New("you are not part of this session")
	}

	// Verify session can be started
	if !session.CanBeStarted() {
		return nil, errors.New("session cannot be started")
	}

	// Update session
	now := time.Now()
	session.Status = models.StatusInProgress
	session.StartedAt = &now

	if err := s.sessionRepo.Update(session); err != nil {
		return nil, errors.New("failed to start session")
	}

	return dto.MapSessionToResponse(session), nil
}

// ConfirmCompletion allows a participant to confirm session completion
func (s *SessionService) ConfirmCompletion(userID, sessionID uint, req *dto.CompleteSessionRequest) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify user is part of this session
	isTeacher := session.TeacherID == userID
	isStudent := session.StudentID == userID
	if !isTeacher && !isStudent {
		return nil, errors.New("you are not part of this session")
	}

	// Verify session is in progress
	if session.Status != models.StatusInProgress {
		return nil, errors.New("session is not in progress")
	}

	// Update confirmation
	if isTeacher {
		session.TeacherConfirmed = true
	}
	if isStudent {
		session.StudentConfirmed = true
	}

	// Add notes if provided
	if req.Notes != "" {
		if session.Notes != "" {
			session.Notes += "\n\n"
		}
		session.Notes += req.Notes
	}

	// Check if both confirmed
	if session.IsBothConfirmed() {
		// Complete the session and transfer credits
		if err := s.completeSession(session); err != nil {
			return nil, err
		}
	} else {
		if err := s.sessionRepo.Update(session); err != nil {
			return nil, errors.New("failed to confirm completion")
		}
	}

	// Reload session
	session, _ = s.sessionRepo.GetByID(sessionID)
	return dto.MapSessionToResponse(session), nil
}

// completeSession finalizes the session and transfers credits
func (s *SessionService) completeSession(session *models.Session) error {
	now := time.Now()
	session.Status = models.StatusCompleted
	session.CompletedAt = &now
	session.CreditReleased = true

	// Transfer credits to teacher
	teacher, err := s.userRepo.FindByID(session.TeacherID)
	if err != nil {
		return errors.New("teacher not found")
	}

	teacher.CreditBalance += session.CreditAmount
	if err := s.userRepo.Update(teacher); err != nil {
		return errors.New("failed to transfer credits")
	}

	// Create earned transaction for teacher
	earnedTransaction := &models.Transaction{
		UserID:        session.TeacherID,
		Type:          models.TransactionEarned,
		Amount:        session.CreditAmount,
		BalanceBefore: teacher.CreditBalance - session.CreditAmount,
		BalanceAfter:  teacher.CreditBalance,
		Description:   "Earned from session: " + session.Title,
		SessionID:     &session.ID,
	}
	_ = s.transactionRepo.Create(earnedTransaction)

	// Update user skill stats
	userSkill, _ := s.skillRepo.GetUserSkillByID(session.UserSkillID)
	if userSkill != nil {
		userSkill.TotalSessions++
		_ = s.skillRepo.UpdateUserSkill(userSkill)
	}

	return s.sessionRepo.Update(session)
}

// CancelSession allows either party to cancel a session
func (s *SessionService) CancelSession(userID, sessionID uint, req *dto.CancelSessionRequest) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify user is part of this session
	if session.TeacherID != userID && session.StudentID != userID {
		return nil, errors.New("you are not part of this session")
	}

	// Can only cancel pending or approved sessions
	if session.Status != models.StatusPending && session.Status != models.StatusApproved {
		return nil, errors.New("session cannot be cancelled")
	}

	// If credits were held, refund them
	if session.CreditHeld && !session.CreditReleased {
		student, err := s.userRepo.FindByID(session.StudentID)
		if err != nil {
			return nil, errors.New("student not found")
		}

		student.CreditBalance += session.CreditAmount
		if err := s.userRepo.Update(student); err != nil {
			return nil, errors.New("failed to refund credits")
		}

		// Create refund transaction
		refundTransaction := &models.Transaction{
			UserID:        session.StudentID,
			Type:          models.TransactionRefund,
			Amount:        session.CreditAmount,
			BalanceBefore: student.CreditBalance - session.CreditAmount,
			BalanceAfter:  student.CreditBalance,
			Description:   "Refund for cancelled session: " + session.Title,
			SessionID:     &session.ID,
		}
		_ = s.transactionRepo.Create(refundTransaction)
	}

	// Update session
	session.Status = models.StatusCancelled
	session.CancelledBy = &userID
	session.CancellationReason = req.Reason

	if err := s.sessionRepo.Update(session); err != nil {
		return nil, errors.New("failed to cancel session")
	}

	return dto.MapSessionToResponse(session), nil
}

// GetSession retrieves a session by ID
func (s *SessionService) GetSession(userID, sessionID uint) (*dto.SessionResponse, error) {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify user is part of this session
	if session.TeacherID != userID && session.StudentID != userID {
		return nil, errors.New("you are not authorized to view this session")
	}

	return dto.MapSessionToResponse(session), nil
}

// GetUserSessions retrieves all sessions for a user
func (s *SessionService) GetUserSessions(userID uint, role, status string, limit, offset int) (*dto.SessionListResponse, error) {
	var sessions []models.Session
	var total int64
	var err error

	switch role {
	case "teacher":
		sessions, total, err = s.sessionRepo.GetUserSessionsAsTeacher(userID, status, limit, offset)
	case "student":
		sessions, total, err = s.sessionRepo.GetUserSessionsAsStudent(userID, status, limit, offset)
	default:
		sessions, total, err = s.sessionRepo.GetAllUserSessions(userID, status, limit, offset)
	}

	if err != nil {
		return nil, err
	}

	return &dto.SessionListResponse{
		Sessions: dto.MapSessionsToResponse(sessions),
		Total:    total,
		Page:     offset/limit + 1,
		Limit:    limit,
	}, nil
}

// GetUpcomingSessions retrieves upcoming sessions for a user
func (s *SessionService) GetUpcomingSessions(userID uint, limit int) ([]dto.SessionResponse, error) {
	sessions, err := s.sessionRepo.GetUpcomingSessions(userID, limit)
	if err != nil {
		return nil, err
	}
	return dto.MapSessionsToResponse(sessions), nil
}

// GetPendingRequests retrieves pending session requests for a teacher
func (s *SessionService) GetPendingRequests(teacherID uint) ([]dto.SessionResponse, error) {
	sessions, err := s.sessionRepo.GetPendingSessionsForTeacher(teacherID)
	if err != nil {
		return nil, err
	}
	return dto.MapSessionsToResponse(sessions), nil
}
