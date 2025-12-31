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
