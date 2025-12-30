package repository

import (
	"time"

	"github.com/timebankingskill/backend/internal/models"

	"gorm.io/gorm"
)

type SessionRepositoryInterface interface {
	Create(session *models.Session) error
	GetByID(id uint) (*models.Session, error)
	Update(session *models.Session) error
	Delete(id uint) error
	GetUserSessionsAsTeacher(userID uint, status string, limit, offset int) ([]models.Session, int64, error)
	GetUserSessionsAsStudent(userID uint, status string, limit, offset int) ([]models.Session, int64, error)
	GetAllUserSessions(userID uint, status string, limit, offset int) ([]models.Session, int64, error)
	GetPendingSessionsForTeacher(teacherID uint) ([]models.Session, error)
	GetUpcomingSessions(userID uint, limit int) ([]models.Session, error)
	GetSessionsInProgress(userID uint) ([]models.Session, error)
	CountUserSessionsAsTeacher(userID uint) (int64, error)
	CountUserSessionsAsStudent(userID uint) (int64, error)
	GetTotalTeachingHours(userID uint) (float64, error)
	GetTotalLearningHours(userID uint) (float64, error)
	ExistsActiveSession(teacherID, studentID, userSkillID uint) (bool, error)
	GetSessionsStartingSoon(minutes int) ([]models.Session, error)
}

type SessionRepository struct {
	db *gorm.DB
}

func NewSessionRepository(db *gorm.DB) *SessionRepository {
	return &SessionRepository{db: db}
}

// Create creates a new session
func (r *SessionRepository) Create(session *models.Session) error {
	return r.db.Create(session).Error
}

// GetByID retrieves a session by ID with related data
func (r *SessionRepository) GetByID(id uint) (*models.Session, error) {
	var session models.Session
	err := r.db.Preload("Teacher").Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		First(&session, id).Error
	if err != nil {
		return nil, err
	}
	return &session, nil
}

// Update updates a session
func (r *SessionRepository) Update(session *models.Session) error {
	return r.db.Save(session).Error
}

// Delete soft deletes a session
func (r *SessionRepository) Delete(id uint) error {
	return r.db.Delete(&models.Session{}, id).Error
}

// GetUserSessionsAsTeacher gets sessions where user is the teacher
func (r *SessionRepository) GetUserSessionsAsTeacher(userID uint, status string, limit, offset int) ([]models.Session, int64, error) {
	var sessions []models.Session
	var total int64

	query := r.db.Model(&models.Session{}).Where("teacher_id = ?", userID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&sessions).Error

	return sessions, total, err
}

// GetUserSessionsAsStudent gets sessions where user is the student
func (r *SessionRepository) GetUserSessionsAsStudent(userID uint, status string, limit, offset int) ([]models.Session, int64, error) {
	var sessions []models.Session
	var total int64

	query := r.db.Model(&models.Session{}).Where("student_id = ?", userID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Teacher").Preload("UserSkill").Preload("UserSkill.Skill").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&sessions).Error

	return sessions, total, err
}

// GetAllUserSessions gets all sessions for a user (as teacher or student)
func (r *SessionRepository) GetAllUserSessions(userID uint, status string, limit, offset int) ([]models.Session, int64, error) {
	var sessions []models.Session
	var total int64

	query := r.db.Model(&models.Session{}).Where("teacher_id = ? OR student_id = ?", userID, userID)

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Preload("Teacher").Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&sessions).Error

	return sessions, total, err
}

// GetPendingSessionsForTeacher gets pending sessions waiting for teacher approval
func (r *SessionRepository) GetPendingSessionsForTeacher(teacherID uint) ([]models.Session, error) {
	var sessions []models.Session
	err := r.db.Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		Where("teacher_id = ? AND status = ?", teacherID, models.StatusPending).
		Order("created_at ASC").
		Find(&sessions).Error
	return sessions, err
}

// GetUpcomingSessions gets approved sessions scheduled in the future
func (r *SessionRepository) GetUpcomingSessions(userID uint, limit int) ([]models.Session, error) {
	var sessions []models.Session
	err := r.db.Preload("Teacher").Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		Where("(teacher_id = ? OR student_id = ?) AND status = ? AND scheduled_at > NOW()",
			userID, userID, models.StatusApproved).
		Order("scheduled_at ASC").
		Limit(limit).
		Find(&sessions).Error
	return sessions, err
}

// GetSessionsInProgress gets sessions currently in progress
func (r *SessionRepository) GetSessionsInProgress(userID uint) ([]models.Session, error) {
	var sessions []models.Session
	err := r.db.Preload("Teacher").Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill").
		Where("(teacher_id = ? OR student_id = ?) AND status = ?",
			userID, userID, models.StatusInProgress).
		Find(&sessions).Error
	return sessions, err
}

// CountUserSessionsAsTeacher counts completed sessions as teacher
func (r *SessionRepository) CountUserSessionsAsTeacher(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).
		Where("teacher_id = ? AND status = ?", userID, models.StatusCompleted).
		Count(&count).Error
	return count, err
}

// CountUserSessionsAsStudent counts completed sessions as student
func (r *SessionRepository) CountUserSessionsAsStudent(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).
		Where("student_id = ? AND status = ?", userID, models.StatusCompleted).
		Count(&count).Error
	return count, err
}

// GetTotalTeachingHours gets total hours taught by user
func (r *SessionRepository) GetTotalTeachingHours(userID uint) (float64, error) {
	var total float64
	err := r.db.Model(&models.Session{}).
		Select("COALESCE(SUM(duration), 0)").
		Where("teacher_id = ? AND status = ?", userID, models.StatusCompleted).
		Scan(&total).Error
	return total, err
}

// GetTotalLearningHours gets total hours learned by user
func (r *SessionRepository) GetTotalLearningHours(userID uint) (float64, error) {
	var total float64
	err := r.db.Model(&models.Session{}).
		Select("COALESCE(SUM(duration), 0)").
		Where("student_id = ? AND status = ?", userID, models.StatusCompleted).
		Scan(&total).Error
	return total, err
}

// ExistsActiveSession checks if there's an active session between two users for the same skill
func (r *SessionRepository) ExistsActiveSession(teacherID, studentID, userSkillID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.Session{}).
		Where("teacher_id = ? AND student_id = ? AND user_skill_id = ? AND status IN ?",
			teacherID, studentID, userSkillID,
			[]models.SessionStatus{models.StatusPending, models.StatusApproved, models.StatusInProgress}).
		Count(&count).Error
	return count > 0, err
}

// GetSessionsStartingSoon gets sessions starting within X minutes that haven't been notified
func (r *SessionRepository) GetSessionsStartingSoon(minutes int) ([]models.Session, error) {
	var sessions []models.Session
	limitTime := time.Now().Add(time.Duration(minutes) * time.Minute)
	
	err := r.db.Preload("Teacher").Preload("Student").
		Where("status = ? AND scheduled_at > ? AND scheduled_at <= ?", 
			models.StatusApproved, time.Now(), limitTime).
		Find(&sessions).Error
	return sessions, err
}
