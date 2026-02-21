package domain

import (
	"github.com/timebankingskill/backend/internal/models"
)

// UserRepository represents the capabilities of user storage
type UserRepository interface {
	Create(user *models.User) error
	GetByID(id uint) (*models.User, error)
	GetAllWithFilters(limit, offset int, search, status string) ([]models.User, int64, error)
	GetByEmail(email string) (*models.User, error)
	GetByUsername(username string) (*models.User, error)
	GetAll() ([]models.User, error)
	Update(user *models.User) error
	Delete(id uint) error
	
	// Stats & Checking
	CountTotal() (int64, error)
	CountActive() (int64, error)
	EmailExists(email string) (bool, error)
	UsernameExists(username string) (bool, error)
	GetGrowthTrend(days int) ([]models.DailyStat, error)
	
	// Specific Updates
	UpdatePassword(userID uint, hashedPassword string) error
	UpdateCreditBalance(userID uint, amount float64) error
	IncrementStats(userID uint, field string, value int) error
	
	// Complex Fetch
	GetWithRelations(id uint) (*models.User, error)
}

// UserStats represents statistics about a user's activity
type UserStats struct {
	CreditBalance         int     `json:"credit_balance"`
	TotalCreditsEarned   int     `json:"total_credits_earned"`
	TotalCreditsSpent    int     `json:"total_credits_spent"`
	TotalSessionsAsTeacher int     `json:"total_sessions_as_teacher"`
	TotalSessionsAsStudent int     `json:"total_sessions_as_student"`
	AverageRatingAsTeacher float64 `json:"average_rating_as_teacher"`
	AverageRatingAsStudent float64 `json:"average_rating_as_student"`
	TotalTeachingHours   float64 `json:"total_teaching_hours"`
	TotalLearningHours   float64 `json:"total_learning_hours"`
}

// PublicProfile represents public profile data
type PublicProfile struct {
	ID                    uint    `json:"id"`
	FullName             string  `json:"full_name"`
	Username             string  `json:"username"`
	School               string  `json:"school"`
	Grade                string  `json:"grade"`
	Major                string  `json:"major"`
	Bio                  string  `json:"bio"`
	Avatar               string  `json:"avatar"`
	Location             string  `json:"location"`
	TotalSessionsAsTeacher int     `json:"total_sessions_as_teacher"`
	AverageRatingAsTeacher float64 `json:"average_rating_as_teacher"`
	TotalTeachingHours   float64 `json:"total_teaching_hours"`
}

// UserService represents the capabilities of the user business logic
type UserService interface {
	GetUserProfile(userID uint) (*models.User, error)
	UpdateUserProfile(userID uint, updates *models.User) error
	ChangePassword(userID uint, oldPassword, newPassword string) error
	GetUserStats(userID uint) (*UserStats, error)
	UpdateAvatar(userID uint, avatarURL string) error
	GetUserByUsername(username string) (*models.User, error)
	GetPublicProfile(userID uint) (*PublicProfile, error)
}
