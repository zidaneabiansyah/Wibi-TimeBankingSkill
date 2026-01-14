package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

type TemplateRepository interface {
	Create(template *models.SessionTemplate) error
	GetByID(id uint) (*models.SessionTemplate, error)
	GetByUserID(userID uint) ([]models.SessionTemplate, error)
	Update(template *models.SessionTemplate) error
	Delete(id uint, userID uint) error
}

type templateRepository struct {
	db *gorm.DB
}

func NewTemplateRepository(db *gorm.DB) TemplateRepository {
	return &templateRepository{db: db}
}

func (r *templateRepository) Create(template *models.SessionTemplate) error {
	return r.db.Create(template).Error
}

func (r *templateRepository) GetByID(id uint) (*models.SessionTemplate, error) {
	var template models.SessionTemplate
	err := r.db.Preload("UserSkill.Skill").First(&template, id).Error
	return &template, err
}

func (r *templateRepository) GetByUserID(userID uint) ([]models.SessionTemplate, error) {
	var templates []models.SessionTemplate
	err := r.db.Preload("UserSkill.Skill").Where("user_id = ?", userID).Find(&templates).Error
	return templates, err
}

func (r *templateRepository) Update(template *models.SessionTemplate) error {
	return r.db.Save(template).Error
}

func (r *templateRepository) Delete(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.SessionTemplate{}).Error
}
