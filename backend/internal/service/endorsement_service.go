package service

import (
	"errors"
	"fmt"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// EndorsementService handles donation business logic
type EndorsementService struct {
	endorsementRepo     *repository.EndorsementRepository
	userRepo            *repository.UserRepository
	skillRepo           *repository.SkillRepository
	notificationService *NotificationService
}

// NewEndorsementService creates a new endorsement service
func NewEndorsementService(
	endorsementRepo *repository.EndorsementRepository,
	userRepo *repository.UserRepository,
	skillRepo *repository.SkillRepository,
) *EndorsementService {
	return &EndorsementService{
		endorsementRepo:     endorsementRepo,
		userRepo:            userRepo,
		skillRepo:           skillRepo,
		notificationService: nil,
	}
}

// NewEndorsementServiceWithNotification creates a new endorsement service with notifications
func NewEndorsementServiceWithNotification(
	endorsementRepo *repository.EndorsementRepository,
	userRepo *repository.UserRepository,
	skillRepo *repository.SkillRepository,
	notificationService *NotificationService,
) *EndorsementService {
	return &EndorsementService{
		endorsementRepo:     endorsementRepo,
		userRepo:            userRepo,
		skillRepo:           skillRepo,
		notificationService: notificationService,
	}
}

// CreateDonation creates a new donation from a user
func (s *EndorsementService) CreateEndorsement(donorID uint, req *dto.CreateEndorsementRequest) (*models.Endorsement, error) {
	// Validate donor exists
	_, err := s.userRepo.GetByID(donorID)
	if err != nil {
		return nil, errors.New("donor not found")
	}

	if req.Amount <= 0 {
		return nil, errors.New("donation amount must be greater than 0")
	}

	dID := donorID
	donation := &models.Endorsement{
		DonorID:     &dID,
		Amount:      req.Amount,
		Message:     req.Message,
		IsAnonymous: req.IsAnonymous,
	}

	if err := s.endorsementRepo.CreateEndorsement(donation); err != nil {
		return nil, fmt.Errorf("failed to create donation: %w", err)
	}

	return s.endorsementRepo.GetEndorsementByID(donation.ID)
}

// GetAllDonations gets all donations (public, paginated)
func (s *EndorsementService) GetAllDonations(limit, offset int) ([]models.Endorsement, int64, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}
	return s.endorsementRepo.GetAllDonations(limit, offset)
}

// GetEndorsementsForUser - kept for backward compat, now returns all donations
func (s *EndorsementService) GetEndorsementsForUser(userID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	return s.GetAllDonations(limit, offset)
}

// GetEndorsementsForSkill - kept for backward compat, redirects to all donations
func (s *EndorsementService) GetEndorsementsForSkill(userID, skillID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	return s.GetAllDonations(limit, offset)
}

// GetEndorsementCount - kept for backward compat
func (s *EndorsementService) GetEndorsementCount(userID, skillID uint) (int64, error) {
	_, total, err := s.GetAllDonations(1000, 0)
	return total, err
}

// DeleteEndorsement deletes a donation by ID (admin or self only)
func (s *EndorsementService) DeleteEndorsement(endorsementID, donorID uint) error {
	donation, err := s.endorsementRepo.GetEndorsementByID(endorsementID)
	if err != nil {
		return errors.New("donation not found")
	}

	if donation.DonorID == nil || *donation.DonorID != donorID {
		return errors.New("unauthorized to delete this donation")
	}

	return s.endorsementRepo.DeleteEndorsement(endorsementID)
}

// GetTopEndorsedSkills - kept for backward compat, now returns top donors
func (s *EndorsementService) GetTopEndorsedSkills(limit int) ([]map[string]interface{}, error) {
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	return s.endorsementRepo.GetTopDonors(limit)
}

// GetUserReputation - returns total donation amount for platform
func (s *EndorsementService) GetUserReputation(userID uint) (int64, error) {
	_, total, err := s.GetAllDonations(1000, 0)
	return total, err
}

// GetTotalAmount returns total donation amount in Rupiah
func (s *EndorsementService) GetTotalAmount() (float64, error) {
	return s.endorsementRepo.GetTotalDonationAmount()
}
