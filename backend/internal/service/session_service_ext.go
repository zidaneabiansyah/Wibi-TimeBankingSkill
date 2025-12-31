package service

import (
	"errors"
	"time"

	"github.com/timebankingskill/backend/internal/models"
)

// AdminApproveSession approves a session on behalf of a teacher (or admin override)
func (s *SessionService) AdminApproveSession(sessionID uint) error {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return err
	}

	if session.Status != models.StatusPending {
		return errors.New("session is not pending")
	}

	session.Status = models.StatusApproved

	if err := s.sessionRepo.Update(session); err != nil {
		return err
	}

	// Send notifications
	s.notificationService.CreateNotification(
		session.StudentID,
		models.NotificationTypeSession,
		"Session Approved",
		"Your session has been approved by admin.",
		map[string]interface{}{"session_id": session.ID},
	)
	
	s.notificationService.CreateNotification(
		session.TeacherID,
		models.NotificationTypeSession,
		"Session Approved",
		"You have a new session approved by admin.",
		map[string]interface{}{"session_id": session.ID},
	)

	return nil
}

// AdminRejectSession rejects a session
func (s *SessionService) AdminRejectSession(sessionID uint) error {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return err
	}

	if session.Status != models.StatusPending {
		return errors.New("session is not pending")
	}

	session.Status = models.StatusRejected
	return s.sessionRepo.Update(session)
}

// AdminCompleteSession completes a session by admin override (releases funds)
func (s *SessionService) AdminCompleteSession(sessionID uint) error {
	session, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return err
	}

	if session.Status == models.StatusCompleted {
		return errors.New("session is already completed")
	}

	// 1. Update status
	session.Status = models.StatusCompleted
	now := time.Now()
	session.CompletedAt = &now
	session.CreditReleased = true
	
	if err := s.sessionRepo.Update(session); err != nil {
		return err
	}

	// 2. Transfer credits using session.CreditAmount
	amount := session.CreditAmount

	// Create earned transaction for teacher
	earnedTransaction := &models.Transaction{
		UserID:        session.TeacherID,
		Type:          models.TransactionEarned,
		Amount:        amount,
		BalanceBefore: 0,
		BalanceAfter:  0,
		Description:   "Earned from session (Admin completed)",
		SessionID:     &session.ID,
	}
	_ = s.transactionRepo.Create(earnedTransaction)
	
	// Create spent transaction for student
	spentTransaction := &models.Transaction{
		UserID:        session.StudentID,
		Type:          models.TransactionSpent,
		Amount:        -amount,
		BalanceBefore: 0,
		BalanceAfter:  0,
		Description:   "Spent on session (Admin completed)",
		SessionID:     &session.ID,
	}
	_ = s.transactionRepo.Create(spentTransaction)
	
	s.notificationService.CreateNotification(
		session.TeacherID,
		models.NotificationTypeSession,
		"Session Completed",
		"Session marked completed by admin.",
		map[string]interface{}{"session_id": session.ID},
	)
	
	return nil
}
