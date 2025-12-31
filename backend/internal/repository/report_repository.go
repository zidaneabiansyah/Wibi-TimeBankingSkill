package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// ReportRepository handles moderation reports
type ReportRepository struct {
	db *gorm.DB
}

// NewReportRepository creates a new report repository
func NewReportRepository(db *gorm.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

// Create creates a new report
func (r *ReportRepository) Create(report *models.Report) error {
	return r.db.Create(report).Error
}

// GetByID gets a report by ID
func (r *ReportRepository) GetByID(id uint) (*models.Report, error) {
	var report models.Report
	if err := r.db.Preload("Reporter").Preload("Resolver").First(&report, id).Error; err != nil {
		return nil, err
	}
	return &report, nil
}

// Update updates a report
func (r *ReportRepository) Update(report *models.Report) error {
	return r.db.Save(report).Error
}

// GetAllWithFilters gets reports with pagination and filters
func (r *ReportRepository) GetAllWithFilters(limit, offset int, status string, search string) ([]models.Report, int64, error) {
	var reports []models.Report
	var total int64

	query := r.db.Model(&models.Report{})

	if status != "" {
		query = query.Where("status = ?", status)
	}

	if search != "" {
		// Join with reporter to search by username if needed, or search reason
		query = query.Where("reason ILIKE ?", "%"+search+"%")
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := query.Preload("Reporter").Preload("Resolver").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reports).Error; err != nil {
		return nil, 0, err
	}

	return reports, total, nil
}
