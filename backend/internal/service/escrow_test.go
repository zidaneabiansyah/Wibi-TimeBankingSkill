package service

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
)

// Mock repositories (simplified)
type MockUserRepo struct{ mock.Mock }
func (m *MockUserRepo) Create(u *models.User) error { return nil }
func (m *MockUserRepo) GetByID(id uint) (*models.User, error) {
	args := m.Called(id)
	return args.Get(0).(*models.User), args.Error(1)
}
func (m *MockUserRepo) GetByEmail(e string) (*models.User, error) { return nil, nil }
func (m *MockUserRepo) Update(u *models.User) error { 
	args := m.Called(u)
	return args.Error(0)
}
func (m *MockUserRepo) Delete(id uint) error { return nil }
func (m *MockUserRepo) GetByUsername(e string) (*models.User, error) { return nil, nil }
func (m *MockUserRepo) List(l, o int) ([]models.User, int64, error) { return nil, 0, nil }

type MockSessionRepo struct{ mock.Mock }
func (m *MockSessionRepo) Create(s *models.Session) error { 
	args := m.Called(s)
	return args.Error(0)
}
func (m *MockSessionRepo) GetByID(id uint) (*models.Session, error) { 
	args := m.Called(id)
	return args.Get(0).(*models.Session), args.Error(1)
}
func (m *MockSessionRepo) Update(s *models.Session) error { 
	args := m.Called(s)
	return args.Error(0)
}
func (m *MockSessionRepo) Delete(id uint) error { return nil }
func (m *MockSessionRepo) GetUserSessions(u uint, r, s string, l, o int) ([]models.Session, int64, error) { return nil, 0, nil }
func (m *MockSessionRepo) GetUpcomingSessions(u uint, l int) ([]models.Session, error) { return nil, nil }
func (m *MockSessionRepo) GetPendingSessionsForTeacher(u uint) ([]models.Session, error) { return nil, nil }
func (m *MockSessionRepo) GetUserSessionsAsTeacher(userID uint, status string, limit, offset int) ([]models.Session, int64, error) { return nil, 0, nil }
func (m *MockSessionRepo) GetUserSessionsAsStudent(userID uint, status string, limit, offset int) ([]models.Session, int64, error) { return nil, 0, nil }
func (m *MockSessionRepo) GetAllUserSessions(userID uint, status string, limit, offset int) ([]models.Session, int64, error) { return nil, 0, nil }
func (m *MockSessionRepo) GetSessionsInProgress(userID uint) ([]models.Session, error) { return nil, nil }
func (m *MockSessionRepo) CountUserSessionsAsTeacher(userID uint) (int64, error) { return 0, nil }
func (m *MockSessionRepo) CountUserSessionsAsStudent(userID uint) (int64, error) { return 0, nil }
func (m *MockSessionRepo) GetTotalTeachingHours(userID uint) (float64, error) { return 0, nil }
func (m *MockSessionRepo) GetTotalLearningHours(userID uint) (float64, error) { return 0, nil }
func (m *MockSessionRepo) ExistsActiveSession(teacherID, studentID, userSkillID uint) (bool, error) { return false, nil }

type MockTransactionRepo struct{ mock.Mock }
func (m *MockTransactionRepo) Create(t *models.Transaction) error { return nil }
func (m *MockTransactionRepo) GetByID(id uint) (*models.Transaction, error) { return nil, nil }
func (m *MockTransactionRepo) GetUserTransactions(u uint, t string, l, o int) ([]models.Transaction, int64, error) { return nil, 0, nil }
func (m *MockTransactionRepo) GetUserBalance(u uint) (float64, error) { return 0, nil }
func (m *MockTransactionRepo) FindByUserID(u uint, l int) ([]models.Transaction, error) { return nil, nil }
func (m *MockTransactionRepo) GetUserTransactionHistory(u uint, l, o int) ([]models.Transaction, int64, error) { return nil, 0, nil }

type MockSkillRepo struct{ mock.Mock }
func (m *MockSkillRepo) GetByID(id uint) (*models.Skill, error) { return nil, nil }
func (m *MockSkillRepo) GetUserSkillByID(id uint) (*models.UserSkill, error) {
	args := m.Called(id)
	return args.Get(0).(*models.UserSkill), args.Error(1)
}
func (m *MockSkillRepo) Create(s *models.Skill) error { return nil }
func (m *MockSkillRepo) Update(s *models.Skill) error { return nil }
func (m *MockSkillRepo) Delete(id uint) error { return nil }
func (m *MockSkillRepo) GetAllWithFilters(l, o int, c, s string, d *int, r *float64, loc, sb string) ([]models.Skill, int64, error) { return nil, 0, nil }
func (m *MockSkillRepo) GetRecommendations(l int) ([]models.Skill, error) { return nil, nil }
func (m *MockSkillRepo) GetUserSkills(u uint) ([]models.UserSkill, error) { return nil, nil }
func (m *MockSkillRepo) GetUserSkill(u, s uint) (*models.UserSkill, error) { return nil, nil }
func (m *MockSkillRepo) CreateUserSkill(u *models.UserSkill) error { return nil }
func (m *MockSkillRepo) UpdateUserSkill(u *models.UserSkill) error { return nil }
func (m *MockSkillRepo) DeleteUserSkill(u, s uint) error { return nil }
func (m *MockSkillRepo) GetLearningSkills(u uint) ([]models.LearningSkill, error) { return nil, nil }
func (m *MockSkillRepo) GetLearningSkill(u, s uint) (*models.LearningSkill, error) { return nil, nil }
func (m *MockSkillRepo) CreateLearningSkill(l *models.LearningSkill) error { return nil }
func (m *MockSkillRepo) DeleteLearningSkill(u, s uint) error { return nil }
func (m *MockSkillRepo) GetTeachersBySkillID(s uint) ([]models.UserSkill, error) { return nil, nil }

func TestBookSessionEscrow(t *testing.T) {
	userRepo := new(MockUserRepo)
	sessionRepo := new(MockSessionRepo)
	txRepo := new(MockTransactionRepo)
	skillRepo := new(MockSkillRepo)

	s := NewSessionService(
		sessionRepo,
		userRepo,
		txRepo,
		skillRepo,
		nil,
		nil,
	)

	student := &models.User{
		ID:             1,
		CreditBalance: 10.0,
		CreditHeld:    0.0,
	}

	userSkill := &models.UserSkill{
		ID:         1,
		UserID:     2, // Teacher ID
		HourlyRate: 2.0,
	}

	req := &dto.CreateSessionRequest{
		UserSkillID: 1,
		Duration:    1.5,
		Title:       "Math Tutoring",
		ScheduledAt: time.Now().Add(24 * time.Hour),
	}

	// Mock expectations
	userRepo.On("GetByID", uint(1)).Return(student, nil)
	skillRepo.On("GetUserSkillByID", uint(1)).Return(userSkill, nil)
	userRepo.On("Update", mock.Anything).Return(nil)
	sessionRepo.On("Create", mock.Anything).Return(nil)

	// Execute
	resp, err := s.BookSession(1, req)

	// Assertions
	assert.NoError(t, err)
	assert.NotNil(t, resp)
	assert.Equal(t, 3.0, student.CreditHeld) // 1.5 hours * 2.0 rate = 3.0 credits
	assert.Equal(t, 10.0, student.CreditBalance) // Total balance remains 10
	
	userRepo.AssertExpectations(t)
	sessionRepo.AssertExpectations(t)
	skillRepo.AssertExpectations(t)
}
