package models

import (
	"gorm.io/gorm"
)

// AllModels returns all models for auto-migration
func AllModels() []interface{} {
	return []interface{}{
		&User{},
		&Skill{},
		&UserSkill{},
		&LearningSkill{},
		&Session{},
		&Transaction{},
		&Review{},
		&Badge{},
		&UserBadge{},
	}
}

// AutoMigrate runs auto-migration for all models
func AutoMigrate(db *gorm.DB) error {
	return db.AutoMigrate(AllModels()...)
}
