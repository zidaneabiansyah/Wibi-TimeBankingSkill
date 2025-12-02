package repository

import (
  "errors"

  "github.com/timebankingskill/backend/internal/models"
  "gorm.io/gorm"
)

// SkillRepository handles database operations for skills
type SkillRepository struct {
  db *gorm.DB
}

// NewSkillRepository creates a new skill repository
func NewSkillRepository(db *gorm.DB) *SkillRepository {
  return &SkillRepository{db: db}
}

// FindAll returns all skills
func (r *SkillRepository) FindAll() ([]models.Skill, error) {
  var skills []models.Skill
  err := r.db.Find(&skills).Error
  return skills, err
}

// FindByID finds a skill by ID
func (r *SkillRepository) FindByID(id uint) (*models.Skill, error) {
  var skill models.Skill
  err := r.db.First(&skill, id).Error
  if err != nil {
    if errors.Is(err, gorm.ErrRecordNotFound) {
      return nil, errors.New("skill not found")
    }
    return nil, err
  }
  return &skill, nil
}

// FindByCategory finds skills by category
func (r *SkillRepository) FindByCategory(category models.SkillCategory) ([]models.Skill, error) {
  var skills []models.Skill
  err := r.db.Where("category = ?", category).Find(&skills).Error
  return skills, err
}

// Search searches skills by name
func (r *SkillRepository) Search(query string) ([]models.Skill, error) {
  var skills []models.Skill
  err := r.db.Where("name ILIKE ?", "%"+query+"%").Find(&skills).Error
  return skills, err
}

// Create creates a new skill
func (r *SkillRepository) Create(skill *models.Skill) error {
  return r.db.Create(skill).Error
}
