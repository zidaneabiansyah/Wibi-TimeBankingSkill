package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// EndorsementRepository handles donation data access
type EndorsementRepository struct {
	db *gorm.DB
}

// NewEndorsementRepository creates a new endorsement repository
func NewEndorsementRepository(db *gorm.DB) *EndorsementRepository {
	return &EndorsementRepository{db: db}
}

// CreateEndorsement creates a new donation record
func (r *EndorsementRepository) CreateEndorsement(endorsement *models.Endorsement) error {
	return r.db.Create(endorsement).Error
}

// GetEndorsementByID gets a donation by ID
func (r *EndorsementRepository) GetEndorsementByID(id uint) (*models.Endorsement, error) {
	var endorsement models.Endorsement
	if err := r.db.Preload("Donor").First(&endorsement, id).Error; err != nil {
		return nil, err
	}
	return &endorsement, nil
}

// GetAllDonations gets all donations (public), paginated
func (r *EndorsementRepository) GetAllDonations(limit, offset int) ([]models.Endorsement, int64, error) {
	var donations []models.Endorsement
	var total int64

	if err := r.db.Model(&models.Endorsement{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Donor").
		Order("created_at DESC").
		Limit(limit).Offset(offset).
		Find(&donations).Error; err != nil {
		return nil, 0, err
	}

	return donations, total, nil
}

// GetTopDonors returns top N donors sorted by total amount donated
func (r *EndorsementRepository) GetTopDonors(limit int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	if err := r.db.Model(&models.Endorsement{}).
		Select("donor_id, SUM(amount) as total_amount, COUNT(*) as donation_count").
		Where("donor_id IS NOT NULL AND is_anonymous = false").
		Group("donor_id").
		Order("total_amount DESC").
		Limit(limit).
		Scan(&results).Error; err != nil {
		return nil, err
	}
	return results, nil
}

// GetTotalDonationAmount returns total Rupiah donated to the platform
func (r *EndorsementRepository) GetTotalDonationAmount() (float64, error) {
	var total float64
	if err := r.db.Model(&models.Endorsement{}).
		Select("COALESCE(SUM(amount), 0)").
		Scan(&total).Error; err != nil {
		return 0, err
	}
	return total, nil
}

// DeleteEndorsement deletes a donation record
func (r *EndorsementRepository) DeleteEndorsement(id uint) error {
	return r.db.Delete(&models.Endorsement{}, id).Error
}

// --- Backward compat stubs (no longer relevant, kept to avoid compile error) ---

// HasEndorsed - stub kept for legacy calls
func (r *EndorsementRepository) HasEndorsed(endorserID, userID, skillID uint) (bool, error) {
	return false, nil
}

// GetEndorsementsForUser - redirects to GetAllDonations
func (r *EndorsementRepository) GetEndorsementsForUser(userID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	return r.GetAllDonations(limit, offset)
}

// GetEndorsementsForSkill - redirects to GetAllDonations
func (r *EndorsementRepository) GetEndorsementsForSkill(userID, skillID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	return r.GetAllDonations(limit, offset)
}

// GetEndorsementCount - returns total donation count
func (r *EndorsementRepository) GetEndorsementCount(userID, skillID uint) (int64, error) {
	var count int64
	r.db.Model(&models.Endorsement{}).Count(&count)
	return count, nil
}

// GetTopEndorsedSkills - redirects to GetTopDonors
func (r *EndorsementRepository) GetTopEndorsedSkills(limit int) ([]map[string]interface{}, error) {
	return r.GetTopDonors(limit)
}

// GetTotalEndorsements - returns total donation count
func (r *EndorsementRepository) GetTotalEndorsements(userID uint) (int64, error) {
	var count int64
	r.db.Model(&models.Endorsement{}).Count(&count)
	return count, nil
}
