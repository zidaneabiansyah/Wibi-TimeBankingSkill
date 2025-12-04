package service

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// BadgeService handles badge business logic
type BadgeService struct {
	badgeRepo   *repository.BadgeRepository
	userRepo    *repository.UserRepository
	sessionRepo *repository.SessionRepository
}

// NewBadgeService creates a new badge service
func NewBadgeService(
	badgeRepo *repository.BadgeRepository,
	userRepo *repository.UserRepository,
	sessionRepo *repository.SessionRepository,
) *BadgeService {
	return &BadgeService{
		badgeRepo:   badgeRepo,
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
	}
}

// GetAllBadges gets all available badges
func (s *BadgeService) GetAllBadges() ([]dto.BadgeResponse, error) {
	badges, err := s.badgeRepo.GetAllBadges()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch badges: %w", err)
	}
	return dto.MapBadgesToResponse(badges), nil
}

// GetBadge gets a specific badge
func (s *BadgeService) GetBadge(id uint) (*dto.BadgeResponse, error) {
	badge, err := s.badgeRepo.GetBadgeByID(id)
	if err != nil {
		return nil, fmt.Errorf("badge not found: %w", err)
	}
	return dto.MapBadgeToResponse(badge), nil
}

// GetUserBadges gets all badges earned by a user
func (s *BadgeService) GetUserBadges(userID uint) ([]dto.UserBadgeResponse, error) {
	userBadges, err := s.badgeRepo.GetUserBadges(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user badges: %w", err)
	}
	return dto.MapUserBadgesToResponse(userBadges), nil
}

// GetUserBadgesByType gets badges earned by a user filtered by type
func (s *BadgeService) GetUserBadgesByType(userID uint, badgeType string) ([]dto.UserBadgeResponse, error) {
	// Validate badge type
	var bType models.BadgeType
	switch badgeType {
	case "achievement":
		bType = models.BadgeTypeAchievement
	case "milestone":
		bType = models.BadgeTypeMilestone
	case "quality":
		bType = models.BadgeTypeQuality
	case "special":
		bType = models.BadgeTypeSpecial
	default:
		return nil, errors.New("invalid badge type")
	}

	userBadges, err := s.badgeRepo.GetUserBadgesByType(userID, bType)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch user badges: %w", err)
	}
	return dto.MapUserBadgesToResponse(userBadges), nil
}

// CheckAndAwardBadges checks if user qualifies for any badges and awards them
func (s *BadgeService) CheckAndAwardBadges(userID uint) ([]dto.UserBadgeResponse, error) {
	awardedBadges := []models.UserBadge{}

	// Get user
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Get all available badges
	allBadges, err := s.badgeRepo.GetAllBadges()
	if err != nil {
		return nil, err
	}

	// Check each badge
	for _, badge := range allBadges {
		// Check if user already has this badge
		hasIt, _ := s.badgeRepo.HasUserBadge(userID, badge.ID)
		if hasIt {
			continue
		}

		// Parse requirements
		var requirements map[string]interface{}
		if err := json.Unmarshal([]byte(badge.Requirements), &requirements); err != nil {
			continue
		}

		// Check if user qualifies
		if s.qualifiesForBadge(user, requirements) {
			// Award badge
			userBadge, err := s.badgeRepo.AwardBadge(userID, badge.ID)
			if err == nil {
				// Award bonus credits if any
				if badge.BonusCredits > 0 {
					user.CreditBalance += badge.BonusCredits
					_ = s.userRepo.Update(user)
				}
				awardedBadges = append(awardedBadges, *userBadge)
			}
		}
	}

	return dto.MapUserBadgesToResponse(awardedBadges), nil
}

// qualifiesForBadge checks if user meets badge requirements
func (s *BadgeService) qualifiesForBadge(user *models.User, requirements map[string]interface{}) bool {
	// Check sessions requirement
	if sessionsReq, ok := requirements["sessions"].(float64); ok {
		if user.TotalSessionsAsTeacher+user.TotalSessionsAsStudent < int(sessionsReq) {
			return false
		}
	}

	// Check teaching sessions requirement
	if teachingReq, ok := requirements["teaching_sessions"].(float64); ok {
		if user.TotalSessionsAsTeacher < int(teachingReq) {
			return false
		}
	}

	// Check learning sessions requirement
	if learningReq, ok := requirements["learning_sessions"].(float64); ok {
		if user.TotalSessionsAsStudent < int(learningReq) {
			return false
		}
	}

	// Check rating requirement
	if ratingReq, ok := requirements["rating"].(float64); ok {
		avgRating := (user.AverageRatingAsTeacher + user.AverageRatingAsStudent) / 2
		if avgRating < ratingReq {
			return false
		}
	}

	// Check credits requirement
	if creditsReq, ok := requirements["credits_earned"].(float64); ok {
		if user.TotalEarned < int(creditsReq) {
			return false
		}
	}

	return true
}

// GetBadgeLeaderboard gets top users by badge count
func (s *BadgeService) GetBadgeLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	results, err := s.badgeRepo.GetBadgeLeaderboard(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch leaderboard: %w", err)
	}

	var leaderboard []dto.LeaderboardEntry
	for _, result := range results {
		userID := uint(result["user_id"].(float64))
		badgeCount := int(result["badge_count"].(int64))

		user, err := s.userRepo.FindByID(userID)
		if err != nil {
			continue
		}

		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    userID,
			Username:  user.Username,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			Score:     badgeCount,
			ScoreType: "badges",
		})
	}

	return leaderboard, nil
}

// GetRarityLeaderboard gets top users by badge rarity
func (s *BadgeService) GetRarityLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	results, err := s.badgeRepo.GetRarityLeaderboard(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch leaderboard: %w", err)
	}

	var leaderboard []dto.LeaderboardEntry
	for _, result := range results {
		userID := uint(result["user_id"].(float64))
		totalRarity := int(result["total_rarity"].(int64))

		user, err := s.userRepo.FindByID(userID)
		if err != nil {
			continue
		}

		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    userID,
			Username:  user.Username,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			Score:     totalRarity,
			ScoreType: "rarity",
		})
	}

	return leaderboard, nil
}

// GetSessionLeaderboard gets top users by session count
func (s *BadgeService) GetSessionLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	users, err := s.userRepo.GetTopUsersBySessionCount(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch leaderboard: %w", err)
	}

	var leaderboard []dto.LeaderboardEntry
	for _, user := range users {
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    user.ID,
			Username:  user.Username,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			Score:     user.TotalSessionsAsTeacher + user.TotalSessionsAsStudent,
			ScoreType: "sessions",
		})
	}

	return leaderboard, nil
}

// GetRatingLeaderboard gets top users by average rating
func (s *BadgeService) GetRatingLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	users, err := s.userRepo.GetTopUsersByRating(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch leaderboard: %w", err)
	}

	var leaderboard []dto.LeaderboardEntry
	for _, user := range users {
		avgRating := (user.AverageRatingAsTeacher + user.AverageRatingAsStudent) / 2
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    user.ID,
			Username:  user.Username,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			Score:     int(avgRating * 100), // Store as integer (e.g., 450 = 4.5)
			ScoreType: "rating",
		})
	}

	return leaderboard, nil
}

// GetCreditLeaderboard gets top users by credits earned
func (s *BadgeService) GetCreditLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	users, err := s.userRepo.GetTopUsersByCreditsEarned(limit)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch leaderboard: %w", err)
	}

	var leaderboard []dto.LeaderboardEntry
	for _, user := range users {
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    user.ID,
			Username:  user.Username,
			FullName:  user.FullName,
			Avatar:    user.Avatar,
			Score:     user.TotalEarned,
			ScoreType: "credits",
		})
	}

	return leaderboard, nil
}
