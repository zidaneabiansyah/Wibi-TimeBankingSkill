package domain

import (
	"github.com/timebankingskill/backend/internal/models"
)

// SessionRepository represents the capabilities of session storage
type SessionRepository interface {
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
	
	// Admin specific
	CountTotal() (int64, error)
	CountCompleted() (int64, error)
	GetAllWithFilters(limit, offset int, search, status string) ([]models.Session, int64, error)
	GetSessionTrend(days int) ([]models.DailyStat, error)
	GetAverageDuration() (float64, error)
}
