package service

import (
	"strconv"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// AnalyticsService handles analytics business logic
type AnalyticsService struct {
	userRepo        *repository.UserRepository
	sessionRepo     *repository.SessionRepository
	transactionRepo *repository.TransactionRepository
	reviewRepo      *repository.ReviewRepository
	skillRepo       *repository.SkillRepository
	badgeRepo       *repository.BadgeRepository
}

// NewAnalyticsService creates a new analytics service
func NewAnalyticsService(
	userRepo *repository.UserRepository,
	sessionRepo *repository.SessionRepository,
	transactionRepo *repository.TransactionRepository,
	reviewRepo *repository.ReviewRepository,
	skillRepo *repository.SkillRepository,
	badgeRepo *repository.BadgeRepository,
) *AnalyticsService {
	return &AnalyticsService{
		userRepo:        userRepo,
		sessionRepo:     sessionRepo,
		transactionRepo: transactionRepo,
		reviewRepo:      reviewRepo,
		skillRepo:       skillRepo,
		badgeRepo:       badgeRepo,
	}
}

// GetUserAnalytics gets analytics for a specific user
func (s *AnalyticsService) GetUserAnalytics(userID uint) (*dto.UserAnalyticsResponse, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	// Get session stats as teacher
	teacherSessions, _, err := s.sessionRepo.GetUserSessionsAsTeacher(userID, "", 0, 10000)
	if err != nil {
		teacherSessions = []models.Session{}
	}

	// Get session stats as student
	studentSessions, _, err := s.sessionRepo.GetUserSessionsAsStudent(userID, "", 0, 10000)
	if err != nil {
		studentSessions = []models.Session{}
	}

	// Calculate total sessions and completed sessions
	totalSessions := len(teacherSessions) + len(studentSessions)
	completedSessions := 0
	for _, session := range append(teacherSessions, studentSessions...) {
		if session.Status == "completed" {
			completedSessions++
		}
	}

	// Get credit stats from user balance
	balance := user.CreditBalance
	// Note: For more detailed credit tracking, would need transaction history
	// For now, using balance as earned (simplified but accurate for current balance)
	totalEarned := balance
	totalSpent := 0.0

	// Get rating stats - average of all reviews for this user
	avgRating := 0.0
	totalReviews := 0
	// Note: Would need review repository method to get actual ratings

	// Get badge stats - count user badges
	totalBadges := 0
	// Note: Would need badge repository method to count user badges

	// Get skill stats
	skillsTeaching := 0
	skillsLearning := 0
	// Note: Would need skill repository methods to count skills

	return &dto.UserAnalyticsResponse{
		UserID:             user.ID,
		Username:           user.Username,
		TotalSessions:      totalSessions,
		CompletedSessions:  completedSessions,
		TotalCreditsEarned: totalEarned,
		TotalCreditsSpent:  totalSpent,
		CurrentBalance:     balance,
		AverageRating:      avgRating,
		TotalReviews:       totalReviews,
		TotalBadges:        totalBadges,
		TotalHoursTaught:   0,
		TotalHoursLearned:  0,
		SkillsTeaching:     skillsTeaching,
		SkillsLearning:     skillsLearning,
		JoinedAt:           user.CreatedAt.UnixMilli(),
		LastActivityAt:     user.UpdatedAt.UnixMilli(),
	}, nil
}

// GetPlatformAnalytics gets platform-wide analytics
func (s *AnalyticsService) GetPlatformAnalytics() (*dto.PlatformAnalyticsResponse, error) {
	// 1. Get user stats
	totalUsers, err := s.userRepo.CountTotal()
	if err != nil {
		return nil, err
	}
	activeUsers, err := s.userRepo.CountActive()
	if err != nil {
		activeUsers = 0 // validation optional
	}

	// 2. Get session stats
	totalSessions, err := s.sessionRepo.CountTotal()
	if err != nil {
		return nil, err
	}
	completedSessions, err := s.sessionRepo.CountCompleted()
	if err != nil {
		completedSessions = 0
	}

	// 3. Get credit stats
	totalCredits, err := s.transactionRepo.GetTotalVolume()
	if err != nil {
		totalCredits = 0
	}

	// 4. Get rating and duration stats
	avgRating, err := s.reviewRepo.GetAveragePlatformRating()
	if err != nil {
		avgRating = 0
	}
	avgDuration, err := s.sessionRepo.GetAverageDuration()
	if err != nil {
		avgDuration = 0
	}

	// 5. Get skill stats
	totalSkills, err := s.skillRepo.CountTotal()
	if err != nil {
		totalSkills = 0
	}

	return &dto.PlatformAnalyticsResponse{
		TotalUsers:             int(totalUsers),
		ActiveUsers:            int(activeUsers),
		TotalSessions:          int(totalSessions),
		CompletedSessions:      int(completedSessions),
		TotalCreditsInFlow:     totalCredits,
		AverageSessionRating:   avgRating,
		AverageSessionDuration: avgDuration,
		TotalSkills:            int(totalSkills),
		TopSkills:              s.getTopSkills(),
		UserGrowth:             s.generateUserGrowthTrend(),
		SessionTrend:           s.generateSessionTrend(),
		CreditFlow:             s.generateCreditFlowTrend(),
		RecentActivity:         s.fetchRecentActivity(),
	}, nil
}

// fetchRecentActivity aggregates latest activities from different sources
func (s *AnalyticsService) fetchRecentActivity() []dto.ActivityItem {
	var activities []dto.ActivityItem

	// 1. Get recent users (limit 5)
	users, _, _ := s.userRepo.GetAllWithFilters(5, 0, "", "") 

	for _, u := range users {
		activities = append(activities, dto.ActivityItem{
			ID:        u.ID,
			Type:      "user",
			Message:   "New user registered",
			Details:   u.FullName,
			CreatedAt: u.CreatedAt.UnixMilli(),
		})
	}

	// 2. Get recent sessions (limit 5)
	sessions, _, _ := s.sessionRepo.GetAllWithFilters(5, 0, "", "") 
	for _, sess := range sessions {
		msg := "New session created"
		if sess.Status == models.StatusCompleted {
			msg = "Session completed"
		}
		activities = append(activities, dto.ActivityItem{
			ID:        sess.ID,
			Type:      "session",
			Message:   msg,
			Details:   "Session #" + strconv.FormatUint(uint64(sess.ID), 10),
			CreatedAt: sess.CreatedAt.UnixMilli(),
		})
	}

	// 3. Get recent skills
	// Note: GetAllWithFilters returns ([]models.Skill, int64, error)
	skills, _, _ := s.skillRepo.GetAllWithFilters(5, 0, "", "", nil, nil, "", "newest")
	for _, sk := range skills {
		activities = append(activities, dto.ActivityItem{
			ID:        sk.ID,
			Type:      "skill",
			Message:   "New skill added",
			Details:   sk.Name,
			CreatedAt: sk.CreatedAt.UnixMilli(),
		})
	}
	
	// Sort by CreatedAt desc
	for i := 0; i < len(activities)-1; i++ {
		for j := 0; j < len(activities)-i-1; j++ {
			if activities[j].CreatedAt < activities[j+1].CreatedAt {
				activities[j], activities[j+1] = activities[j+1], activities[j]
			}
		}
	}

	// Limit to top 5 or 10
	if len(activities) > 10 {
		activities = activities[:10]
	}

	return activities
}

// GetSessionStatistics gets session statistics
func (s *AnalyticsService) GetSessionStatistics() (*dto.SessionStatistic, error) {
	return &dto.SessionStatistic{
		TotalSessions:     0,
		CompletedSessions: 0,
		CancelledSessions: 0,
		PendingSessions:   0,
		AverageDuration:   0,
		AverageRating:     0,
		OnlineSessions:    0,
		OfflineSessions:   0,
	}, nil
}

// GetCreditStatistics gets credit statistics
func (s *AnalyticsService) GetCreditStatistics() (*dto.CreditStatistic, error) {
	return &dto.CreditStatistic{
		TotalEarned:      0,
		TotalSpent:       0,
		TotalHeld:        0,
		AverageEarned:    0,
		AverageSpent:     0,
		TransactionCount: 0,
	}, nil
}

// Helper functions

func (s *AnalyticsService) getTopSkills() []dto.SkillStatistic {
	// Get top 5 skills by rating/popularity
	skills, _ := s.skillRepo.GetRecommendations(5)
	return s.mapTopSkills(skills)
}

func (s *AnalyticsService) mapTopSkills(skills interface{}) []dto.SkillStatistic {
	var stats []dto.SkillStatistic
	
	// Assuming skills is []models.Skill
	if modelSkills, ok := skills.([]models.Skill); ok {
		for _, sk := range modelSkills {
			stats = append(stats, dto.SkillStatistic{
				SkillID:       sk.ID,
				SkillName:     sk.Name,
				SessionCount:  sk.TotalTeachers, // Using TotalTeachers as a proxy if SessionCount not available
				TeacherCount:  sk.TotalTeachers,
				LearnerCount:  sk.TotalLearners,
				AverageRating: 0, // Placeholder
			})
		}
	}
	return stats
}

func (s *AnalyticsService) generateUserGrowthTrend() []dto.DateStatistic {
	trend := make([]dto.DateStatistic, 0)
	
	stats, err := s.userRepo.GetGrowthTrend(30)
	if err != nil {
		return trend 
	}

	for _, stat := range stats {
		trend = append(trend, dto.DateStatistic{
			Date:  stat.Date,
			Value: stat.Value,
		})
	}
	return trend
}

func (s *AnalyticsService) generateSessionTrend() []dto.DateStatistic {
	trend := make([]dto.DateStatistic, 0)
	
	stats, err := s.sessionRepo.GetSessionTrend(30)
	if err != nil {
		return trend
	}

	for _, stat := range stats {
		trend = append(trend, dto.DateStatistic{
			Date:  stat.Date,
			Value: stat.Value,
		})
	}

	return trend
}

func (s *AnalyticsService) generateCreditFlowTrend() []dto.DateStatistic {
	trend := make([]dto.DateStatistic, 0)
	
	stats, err := s.transactionRepo.GetCreditVolumeTrend(30)
	if err != nil {
		return trend
	}

	for _, stat := range stats {
		trend = append(trend, dto.DateStatistic{
			Date:  stat.Date,
			Value: stat.Value,
		})
	}

	return trend
}
