package repository

import (
	"github.com/timebankingskill/backend/internal/models"
)

// CountTotal counts all sessions
func (r *SessionRepository) CountTotal() (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).Count(&count).Error
	return count, err
}

// CountCompleted counts all completed sessions
func (r *SessionRepository) CountCompleted() (int64, error) {
	var count int64
	err := r.db.Model(&models.Session{}).Where("status = ?", models.StatusCompleted).Count(&count).Error
	return count, err
}

// GetAllWithFilters returns all sessions with optional filters and pagination
func (r *SessionRepository) GetAllWithFilters(limit, offset int, search, status string) ([]models.Session, int64, error) {
	var sessions []models.Session
	var total int64

	query := r.db.Model(&models.Session{}).
		Preload("Teacher").Preload("Student").Preload("UserSkill").Preload("UserSkill.Skill")

	if search != "" {
		// Join with users/skills to search by name? easier to search by loaded relations but GORM needs joins for that efficiently.
		// For simplicity, let's just use Joins.
		query = query.Joins("JOIN users teacher ON teacher.id = sessions.teacher_id").
			Joins("JOIN users student ON student.id = sessions.student_id").
			Joins("JOIN user_skills ON user_skills.id = sessions.user_skill_id").
			Joins("JOIN skills ON skills.id = user_skills.skill_id").
			Where("teacher.full_name ILIKE ? OR student.full_name ILIKE ? OR skills.name ILIKE ?", 
				"%"+search+"%", "%"+search+"%", "%"+search+"%")
	}

	if status != "" && status != "all" {
		query = query.Where("sessions.status = ?", status)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := query.Order("sessions.created_at DESC").Limit(limit).Offset(offset).Find(&sessions).Error
	return sessions, total, err
}
