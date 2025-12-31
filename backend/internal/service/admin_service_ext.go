package service

import (
	"github.com/timebankingskill/backend/internal/models"
)

// GetAllUsers gets all users with filters (admin only)
func (s *AdminService) GetAllUsers(page, limit int, search, filter string) ([]models.User, int64, error) {
	offset := (page - 1) * limit
	return s.userRepo.GetAllWithFilters(limit, offset, search, filter)
}

// GetAllSessions gets all sessions with filters (admin only)
func (s *AdminService) GetAllSessions(page, limit int, search, filter string) ([]models.Session, int64, error) {
	offset := (page - 1) * limit
	return s.sessionRepo.GetAllWithFilters(limit, offset, search, filter)
}

// GetAllTransactions returns paginated transactions with filters
func (s *AdminService) GetAllTransactions(page, limit int, typeFilter, search string) ([]models.Transaction, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	transactions, total, err := s.transactionRepo.GetAllWithFilters(limit, offset, typeFilter, search)
	if err != nil {
		return nil, 0, err
	}

	return transactions, total, nil
}

// GetAllSkills returns paginated skills with filters
func (s *AdminService) GetAllSkills(page, limit int, category, search string) ([]models.Skill, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	// Pass nil/empty for unused filters in admin view (dayOfWeek, minRating, location, sortBy)
	// Admin typically wants to sort by newest first (default in repo) or maybe by ID
	skills, total, err := s.skillRepo.GetAllWithFilters(limit, offset, category, search, nil, nil, "", "newest")
	if err != nil {
		return nil, 0, err
	}

	return skills, total, nil
}

// GetAllReports returns paginated reports with filters
func (s *AdminService) GetAllReports(page, limit int, status, search string) ([]models.Report, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.reportRepo.GetAllWithFilters(limit, offset, status, search)
}

// GetAllForumThreads returns paginated threads for admin
func (s *AdminService) GetAllForumThreads(page, limit int, search string) ([]models.ForumThread, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}
	offset := (page - 1) * limit

	return s.forumRepo.GetAllThreads(limit, offset, search)
}

// SuspendUser suspends a user
func (s *AdminService) SuspendUser(userID uint) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}
	user.IsActive = false
	return s.userRepo.Update(user)
}

// ActivateUser activates a user
func (s *AdminService) ActivateUser(userID uint) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return err
	}
	user.IsActive = true
	return s.userRepo.Update(user)
}
