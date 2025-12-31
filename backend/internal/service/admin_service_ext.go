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
