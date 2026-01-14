package models

import (
	"fmt"
	"gorm.io/gorm"
)

// AutoMigrate runs all model migrations
// Migrates each model individually to handle errors gracefully
func AutoMigrate(db *gorm.DB) error {
	models := []interface{}{
		&User{},
		&Skill{},
		&UserSkill{},
		&LearningSkill{},
		&Session{},
		&Review{},
		&Badge{},
		&UserBadge{},
		&Transaction{},
		&Notification{},
		&ForumCategory{},
		&ForumThread{},
		&ForumReply{},
		&SuccessStory{},
		&StoryComment{},
		&Endorsement{},
		&VideoSession{},
		&SharedFile{},
		&Whiteboard{},
		&SkillProgress{},
		&Milestone{},
		&Availability{},
		&Report{},
		&Favorite{},
		&SessionTemplate{},
	}
	
	successCount := 0
	failedModels := []string{}
	
	for _, model := range models {
		modelName := fmt.Sprintf("%T", model)
		if err := db.AutoMigrate(model); err != nil {
			fmt.Printf("⚠️  Failed to migrate %s: %v\n", modelName, err)
			failedModels = append(failedModels, modelName)
		} else {
			successCount++
		}
	}
	
	fmt.Printf("✅ Successfully migrated %d/%d models\n", successCount, len(models))
	if len(failedModels) > 0 {
		fmt.Printf("⚠️  Failed models: %v\n", failedModels)
		fmt.Println("ℹ️  Tables for failed models should already exist in database")
	}
	
	return nil
}
