package models

import (
	"fmt"
	"gorm.io/gorm"
)

// AutoMigrate runs all model migrations
// Only migrates tables that don't exist to avoid ALTER TABLE issues
func AutoMigrate(db *gorm.DB) error {
	models := []struct {
		name      string
		tableName string
		model     interface{}
	}{
		{"User", "users", &User{}},
		{"Skill", "skills", &Skill{}},
		{"UserSkill", "user_skills", &UserSkill{}},
		{"LearningSkill", "learning_skills", &LearningSkill{}},
		{"Session", "sessions", &Session{}},
		{"Review", "reviews", &Review{}},
		{"Badge", "badges", &Badge{}},
		{"UserBadge", "user_badges", &UserBadge{}},
		{"Transaction", "transactions", &Transaction{}},
		{"Notification", "notifications", &Notification{}},
		{"ForumCategory", "forum_categories", &ForumCategory{}},
		{"ForumThread", "forum_threads", &ForumThread{}},
		{"ForumReply", "forum_replies", &ForumReply{}},
		{"SuccessStory", "success_stories", &SuccessStory{}},
		{"StoryComment", "story_comments", &StoryComment{}},
		{"Endorsement", "endorsements", &Endorsement{}},
		{"VideoSession", "video_sessions", &VideoSession{}},
		{"SharedFile", "shared_files", &SharedFile{}},
		{"Whiteboard", "whiteboards", &Whiteboard{}},
		{"SkillProgress", "skill_progresses", &SkillProgress{}},
		{"Milestone", "milestones", &Milestone{}},
	}

	for _, m := range models {
		// Check if table exists
		if db.Migrator().HasTable(m.tableName) {
			fmt.Printf("  ✓ %s table exists, skipping\n", m.name)
			continue
		}
		
		fmt.Printf("  Creating %s table...\n", m.name)
		if err := db.Migrator().CreateTable(m.model); err != nil {
			return fmt.Errorf("failed to create %s table: %w", m.name, err)
		}
	}

	return nil
}


