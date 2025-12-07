package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// EndorsementRepository handles endorsement data access
type EndorsementRepository struct {
	db *gorm.DB
}

// NewEndorsementRepository creates a new endorsement repository
func NewEndorsementRepository(db *gorm.DB) *EndorsementRepository {
	return &EndorsementRepository{db: db}
}

// CreateEndorsement creates a new endorsement
func (r *EndorsementRepository) CreateEndorsement(endorsement *models.Endorsement) error {
	return r.db.Create(endorsement).Error
}

// GetEndorsementByID gets an endorsement by ID
func (r *EndorsementRepository) GetEndorsementByID(id uint) (*models.Endorsement, error) {
	var endorsement models.Endorsement
	if err := r.db.Preload("User").Preload("Skill").Preload("Endorser").First(&endorsement, id).Error; err != nil {
		return nil, err
	}
	return &endorsement, nil
}

// GetEndorsementsForUser gets all endorsements for a user
func (r *EndorsementRepository) GetEndorsementsForUser(userID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	var endorsements []models.Endorsement
	var total int64

	if err := r.db.Model(&models.Endorsement{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Skill").Preload("Endorser").Where("user_id = ?", userID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&endorsements).Error; err != nil {
		return nil, 0, err
	}

	return endorsements, total, nil
}

// GetEndorsementsForSkill gets all endorsements for a specific skill
func (r *EndorsementRepository) GetEndorsementsForSkill(userID, skillID uint, limit, offset int) ([]models.Endorsement, int64, error) {
	var endorsements []models.Endorsement
	var total int64

	if err := r.db.Model(&models.Endorsement{}).Where("user_id = ? AND skill_id = ?", userID, skillID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Endorser").Where("user_id = ? AND skill_id = ?", userID, skillID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&endorsements).Error; err != nil {
		return nil, 0, err
	}

	return endorsements, total, nil
}

// GetEndorsementCount gets count of endorsements for a user's skill
func (r *EndorsementRepository) GetEndorsementCount(userID, skillID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&models.Endorsement{}).Where("user_id = ? AND skill_id = ?", userID, skillID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

// HasEndorsed checks if a user has already endorsed another user's skill
func (r *EndorsementRepository) HasEndorsed(endorserID, userID, skillID uint) (bool, error) {
	var count int64
	if err := r.db.Model(&models.Endorsement{}).Where("endorser_id = ? AND user_id = ? AND skill_id = ?", endorserID, userID, skillID).Count(&count).Error; err != nil {
		return false, err
	}
	return count > 0, nil
}

// DeleteEndorsement deletes an endorsement
func (r *EndorsementRepository) DeleteEndorsement(id uint) error {
	return r.db.Delete(&models.Endorsement{}, id).Error
}

// GetTopEndorsedSkills gets the most endorsed skills
func (r *EndorsementRepository) GetTopEndorsedSkills(limit int) ([]map[string]interface{}, error) {
	var results []map[string]interface{}
	if err := r.db.Model(&models.Endorsement{}).
		Select("skill_id, COUNT(*) as endorsement_count").
		Group("skill_id").
		Order("endorsement_count DESC").
		Limit(limit).
		Scan(&results).Error; err != nil {
		return nil, err
	}
	return results, nil
}
