package service

import (
	"encoding/json"
	"errors"
	"fmt"
	"sort"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// BadgeService handles badge business logic
type BadgeService struct {
	badgeRepo           *repository.BadgeRepository
	userRepo            *repository.UserRepository
	sessionRepo         *repository.SessionRepository
	notificationService *NotificationService
}

// NewBadgeService creates a new badge service
func NewBadgeService(
	badgeRepo *repository.BadgeRepository,
	userRepo *repository.UserRepository,
	sessionRepo *repository.SessionRepository,
	notificationService *NotificationService,
) *BadgeService {
	return &BadgeService{
		badgeRepo:           badgeRepo,
		userRepo:            userRepo,
		sessionRepo:         sessionRepo,
		notificationService: notificationService,
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
// This function is called after session completion to automatically award earned badges
// Performance: O(n*m) where n = number of badges, m = average requirement checks
// Should be called asynchronously to avoid blocking session completion
//
// Algorithm:
// 1. Fetch user profile with all stats
// 2. Fetch all available badges
// 3. For each badge:
//    a. Check if user already has badge (skip if yes)
//    b. Parse badge requirements JSON
//    c. Check if user meets ALL requirements
//    d. If qualified: award badge and grant bonus credits
// 4. Return list of newly awarded badges
//
// Side Effects:
//   - Updates user credit balance if bonus credits awarded
//   - Creates UserBadge records in database
//   - May update user profile stats
//
// Parameters:
//   - userID: User to check and award badges for
//
// Returns:
//   - []UserBadgeResponse: List of newly awarded badges
//   - error: If user not found or database error
//
// Example:
//   awarded, err := badgeService.CheckAndAwardBadges(userID)
//   // Automatically awards badges user qualifies for
func (s *BadgeService) CheckAndAwardBadges(userID uint) ([]dto.UserBadgeResponse, error) {
	awardedBadges := []models.UserBadge{}

	// Fetch user with current stats (teaching hours, learning hours, ratings, etc)
	user, err := s.userRepo.FindByID(userID)
	if err != nil {
		return nil, errors.New("user not found")
	}

	// Fetch all available badges in system
	allBadges, err := s.badgeRepo.GetAllBadges()
	if err != nil {
		return nil, err
	}

	// Iterate through all badges and check qualification
	for _, badge := range allBadges {
		// Skip if user already has this badge (prevent duplicate awards)
		hasIt, _ := s.badgeRepo.HasUserBadge(userID, badge.ID)
		if hasIt {
			continue
		}

		// Parse badge requirements from JSON string
		// Requirements define what user must achieve to earn badge
		var requirements map[string]interface{}
		if err := json.Unmarshal([]byte(badge.Requirements), &requirements); err != nil {
			// Skip badge if requirements are malformed
			continue
		}

		// Check if user meets ALL badge requirements
		if s.qualifiesForBadge(user, requirements) {
			// Award badge to user
			userBadge, err := s.badgeRepo.AwardBadge(userID, badge.ID)
			if err == nil {
				// Grant bonus credits if badge has bonus
				// This incentivizes users to earn badges
				if badge.BonusCredits > 0 {
					user.CreditBalance += badge.BonusCredits
					_ = s.userRepo.Update(user)
				}
				awardedBadges = append(awardedBadges, *userBadge)

				// Send badge achievement notification
				notificationData := map[string]interface{}{
					"badgeID":   badge.ID,
					"badgeName": badge.Name,
					"rarity":    badge.Rarity,
					"bonus":     badge.BonusCredits,
				}
				_, _ = s.notificationService.CreateNotification(
					userID,
					models.NotificationTypeAchievement,
					"Badge Unlocked! 🏆",
					fmt.Sprintf("You unlocked the %s badge! Rarity: %d/5", badge.Name, badge.Rarity),
					notificationData,
				)
			}
		}
	}

	return dto.MapUserBadgesToResponse(awardedBadges), nil
}

// PinBadge pins or unpins a badge for a user
// This allows users to showcase their favorite badges on their profile
func (s *BadgeService) PinBadge(userID, badgeID uint, isPinned bool) error {
	// Verify user has this badge
	hasBadge, err := s.badgeRepo.HasUserBadge(userID, badgeID)
	if err != nil {
		return fmt.Errorf("failed to verify badge ownership: %w", err)
	}
	if !hasBadge {
		return errors.New("user does not have this badge")
	}

	// Update pin status in database
	if err := s.badgeRepo.PinBadge(userID, badgeID, isPinned); err != nil {
		return fmt.Errorf("failed to update badge pin status: %w", err)
	}

	return nil
}

// qualifiesForBadge checks if user meets badge requirements
// This is a private method that evaluates badge qualification criteria
// Performance: O(1) - constant time lookup and comparison
// Logic: AND operation - ALL requirements must be met to qualify
// Extensibility: New requirements can be added without breaking existing logic
//
// Supported Requirements (optional - any can be omitted):
//   - "sessions": Total sessions (teaching + learning) required
//   - "teaching_sessions": Minimum teaching sessions required
//   - "learning_sessions": Minimum learning sessions required
//   - "rating": Minimum average rating required (0-5 scale)
//   - "credits_earned": Minimum credits earned from teaching required
//
// If a requirement is not specified in the badge, it's skipped (no check)
// This allows flexible badge definitions
//
// Parameters:
//   - user: User to check (must have stats pre-loaded)
//   - requirements: Map of requirement keys to values (parsed from JSON)
//
// Returns:
//   - true: User meets ALL specified requirements
//   - false: User fails at least one requirement
//
// Example:
//   requirements := map[string]interface{}{
//     "teaching_sessions": 20.0,
//     "rating": 4.5,
//   }
//   qualifies := qualifiesForBadge(user, requirements)
func (s *BadgeService) qualifiesForBadge(user *models.User, requirements map[string]interface{}) bool {
	// TOTAL SESSIONS CHECK: Verify combined teaching + learning sessions
	// Used for badges like "Dedicated Participant" (10+ total sessions)
	// Represents overall engagement in the platform
	if sessionsReq, ok := requirements["sessions"].(float64); ok {
		totalSessions := user.TotalSessionsAsTeacher + user.TotalSessionsAsStudent
		if totalSessions < int(sessionsReq) {
			return false // Doesn't meet minimum total sessions
		}
	}

	// TEACHING SESSIONS CHECK: Verify teaching experience
	// Used for badges like "Dedicated Teacher" (20+ teaching sessions)
	// Represents commitment to helping others
	if teachingReq, ok := requirements["teaching_sessions"].(float64); ok {
		if user.TotalSessionsAsTeacher < int(teachingReq) {
			return false // Doesn't meet minimum teaching sessions
		}
	}

	// LEARNING SESSIONS CHECK: Verify learning experience
	// Used for badges like "Knowledge Seeker" (10+ learning sessions)
	// Represents commitment to personal growth
	if learningReq, ok := requirements["learning_sessions"].(float64); ok {
		if user.TotalSessionsAsStudent < int(learningReq) {
			return false // Doesn't meet minimum learning sessions
		}
	}

	// RATING CHECK: Verify quality of teaching/learning
	// Calculates average of teacher and student ratings: (teacher_rating + student_rating) / 2
	// Used for badges like "Top Tutor" (4.8+ rating)
	// Represents user's reputation and quality
	if ratingReq, ok := requirements["rating"].(float64); ok {
		avgRating := (user.AverageRatingAsTeacher + user.AverageRatingAsStudent) / 2
		if avgRating < ratingReq {
			return false // Doesn't meet minimum rating threshold
		}
	}

	// CREDITS EARNED CHECK: Verify teaching productivity
	// Used for badges like "Platinum Teacher" (100+ hours taught)
	// Represents total time credits earned from teaching
	if creditsReq, ok := requirements["credits_earned"].(float64); ok {
		if int(user.TotalEarned) < int(creditsReq) {
			return false // Doesn't meet minimum credits earned
		}
	}

	// All requirements met - user qualifies for this badge
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

// GetSessionLeaderboard retrieves top users ranked by total session count (teaching + learning)
// Performance: O(n log n) due to sort.Slice
// Caching: Results should be cached for 5-10 minutes to reduce database load
//
// Algorithm:
// 1. Fetch all users from database
// 2. Count sessions for each user (teaching + learning)
// 3. Filter users with at least 1 session
// 4. Sort by total session count (descending)
// 5. Return top N entries
//
// Parameters:
//   - limit: Maximum number of entries (clamped to 1-100, default 10)
//
// Returns:
//   - []LeaderboardEntry: Sorted leaderboard entries
//   - error: If database fetch fails
//
// Example:
//   leaderboard, err := badgeService.GetSessionLeaderboard(10)
//   // Returns top 10 users by session count
func (s *BadgeService) GetSessionLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	// Validate and normalize limit parameter
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	// Fetch all users from database
	users, err := s.userRepo.GetAll()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	// Helper struct to hold user with their session count
	type userSessionCount struct {
		User  models.User
		Count int64
	}
	var userCounts []userSessionCount

	// Count total sessions for each user (teaching + learning)
	// Only include users with at least 1 session to reduce leaderboard noise
	for _, user := range users {
		// Count sessions where user is the teacher
		teacherCount, _ := s.sessionRepo.CountUserSessionsAsTeacher(user.ID)
		// Count sessions where user is the student/learner
		studentCount, _ := s.sessionRepo.CountUserSessionsAsStudent(user.ID)
		totalCount := teacherCount + studentCount

		// Only include users with activity
		if totalCount > 0 {
			userCounts = append(userCounts, userSessionCount{
				User:  user,
				Count: totalCount,
			})
		}
	}

	// Sort by session count in descending order using efficient sort.Slice
	// Time complexity: O(n log n) instead of O(n²) with bubble sort
	sort.Slice(userCounts, func(i, j int) bool {
		return userCounts[i].Count > userCounts[j].Count
	})

	// Build leaderboard response with top N entries
	var leaderboard []dto.LeaderboardEntry
	for i, uc := range userCounts {
		// Stop after reaching limit
		if i >= limit {
			break
		}
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    uc.User.ID,
			Username:  uc.User.Username,
			FullName:  uc.User.FullName,
			Avatar:    uc.User.Avatar,
			Score:     int(uc.Count),
			ScoreType: "sessions",
		})
	}

	return leaderboard, nil
}

// GetRatingLeaderboard retrieves top users ranked by average rating (teacher + student average)
// Performance: O(n log n) due to sort.Slice
// Caching: Results should be cached for 5-10 minutes to reduce computation
//
// Algorithm:
// 1. Fetch all users from database
// 2. Calculate average rating for each user: (teacherRating + studentRating) / 2
// 3. Filter users with at least some rating (> 0)
// 4. Sort by average rating (descending)
// 5. Return top N entries
//
// Rating Calculation:
//   - Combines both teaching and learning ratings equally
//   - Provides balanced view of user quality
//   - Only includes users with at least one rating
//
// Parameters:
//   - limit: Maximum number of entries (clamped to 1-100, default 10)
//
// Returns:
//   - []LeaderboardEntry: Sorted leaderboard entries (score stored as int: 450 = 4.5 stars)
//   - error: If database fetch fails
//
// Example:
//   leaderboard, err := badgeService.GetRatingLeaderboard(10)
//   // Returns top 10 users by average rating
func (s *BadgeService) GetRatingLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	// Validate and normalize limit parameter
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	// Fetch all users from database
	users, err := s.userRepo.GetAll()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	// Helper struct to hold user with their calculated average rating
	type userRating struct {
		User      models.User
		AvgRating float64
	}
	var userRatings []userRating

	// Calculate average rating for each user
	// Average combines both teaching and learning ratings equally
	for _, user := range users {
		// Calculate average: (teacher_rating + student_rating) / 2
		// This gives balanced view of user quality in both roles
		avgRating := (user.AverageRatingAsTeacher + user.AverageRatingAsStudent) / 2
		// Only include users with at least some rating
		if avgRating > 0 {
			userRatings = append(userRatings, userRating{
				User:      user,
				AvgRating: avgRating,
			})
		}
	}

	// Sort by average rating in descending order using efficient sort.Slice
	// Time complexity: O(n log n) instead of O(n²) with bubble sort
	sort.Slice(userRatings, func(i, j int) bool {
		return userRatings[i].AvgRating > userRatings[j].AvgRating
	})


	// Build leaderboard response with top N entries
	var leaderboard []dto.LeaderboardEntry
	for i, ur := range userRatings {
		// Stop after reaching limit
		if i >= limit {
			break
		}
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    ur.User.ID,
			Username:  ur.User.Username,
			FullName:  ur.User.FullName,
			Avatar:    ur.User.Avatar,
			// Store rating as integer: multiply by 100 (e.g., 4.5 stars = 450)
			// This avoids floating-point precision issues in JSON
			Score:     int(ur.AvgRating * 100),
			ScoreType: "rating",
		})
	}

	return leaderboard, nil
}

// GetCreditLeaderboard retrieves top users ranked by total credits earned from teaching
// Performance: O(n log n) due to sort.Slice
// Caching: Results should be cached for 5-10 minutes to reduce computation
//
// Algorithm:
// 1. Fetch all users from database
// 2. Filter users with at least 1 credit earned
// 3. Sort by total credits earned (descending)
// 4. Return top N entries
//
// Credits Earned:
//   - Represents total time credits user has earned from teaching
//   - Higher value indicates more teaching experience and productivity
//   - Only includes completed sessions
//
// Parameters:
//   - limit: Maximum number of entries (clamped to 1-100, default 10)
//
// Returns:
//   - []LeaderboardEntry: Sorted leaderboard entries
//   - error: If database fetch fails
//
// Example:
//   leaderboard, err := badgeService.GetCreditLeaderboard(10)
//   // Returns top 10 users by credits earned
func (s *BadgeService) GetCreditLeaderboard(limit int) ([]dto.LeaderboardEntry, error) {
	// Validate and normalize limit parameter
	if limit <= 0 || limit > 100 {
		limit = 10
	}

	// Fetch all users from database
	users, err := s.userRepo.GetAll()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch users: %w", err)
	}

	// Helper struct to hold user with their total credits earned
	type userCredit struct {
		User   models.User
		Credit int
	}
	var userCredits []userCredit

	// Collect users with at least some credits earned
	// Only include active teachers to reduce leaderboard noise
	for _, user := range users {
		if user.TotalEarned > 0 {
			userCredits = append(userCredits, userCredit{
				User:   user,
				Credit: int(user.TotalEarned),
			})
		}
	}

	// Sort by credits earned in descending order using efficient sort.Slice
	// Time complexity: O(n log n) instead of O(n²) with bubble sort
	sort.Slice(userCredits, func(i, j int) bool {
		return userCredits[i].Credit > userCredits[j].Credit
	})

	// Build leaderboard response with top N entries
	var leaderboard []dto.LeaderboardEntry
	for i, uc := range userCredits {
		// Stop after reaching limit
		if i >= limit {
			break
		}
		leaderboard = append(leaderboard, dto.LeaderboardEntry{
			UserID:    uc.User.ID,
			Username:  uc.User.Username,
			FullName:  uc.User.FullName,
			Avatar:    uc.User.Avatar,
			Score:     uc.Credit,
			ScoreType: "credits",
		})
	}

	return leaderboard, nil
}
