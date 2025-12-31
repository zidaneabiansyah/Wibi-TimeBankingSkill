package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal counts all skills
func (r *SkillRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.Skill{}).Count(&count).Error
	return count, err
}
