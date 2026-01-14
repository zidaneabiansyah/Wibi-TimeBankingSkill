package database

import (
	"log"

	"gorm.io/gorm"
)

// CreatePerformanceIndexes creates database indexes for query optimization
// This significantly improves query performance on large tables
func CreatePerformanceIndexes(db *gorm.DB) error {
	log.Println("Creating performance indexes...")

	indexes := []struct {
		name  string
		query string
	}{
		// Sessions indexes - most queried table
		{
			name:  "idx_sessions_teacher_status",
			query: "CREATE INDEX IF NOT EXISTS idx_sessions_teacher_status ON sessions(teacher_id, status)",
		},
		{
			name:  "idx_sessions_student_status",
			query: "CREATE INDEX IF NOT EXISTS idx_sessions_student_status ON sessions(student_id, status)",
		},
		{
			name:  "idx_sessions_scheduled_at",
			query: "CREATE INDEX IF NOT EXISTS idx_sessions_scheduled_at ON sessions(scheduled_at) WHERE status IN ('approved', 'in_progress')",
		},
		{
			name:  "idx_sessions_created_at",
			query: "CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC)",
		},

		// User skills indexes - marketplace queries
		{
			name:  "idx_user_skills_skill_available",
			query: "CREATE INDEX IF NOT EXISTS idx_user_skills_skill_available ON user_skills(skill_id, is_available) WHERE is_available = true",
		},
		{
			name:  "idx_user_skills_user_id",
			query: "CREATE INDEX IF NOT EXISTS idx_user_skills_user_id ON user_skills(user_id)",
		},
		{
			name:  "idx_user_skills_rating",
			query: "CREATE INDEX IF NOT EXISTS idx_user_skills_rating ON user_skills(average_rating DESC) WHERE is_available = true",
		},

		// Transactions indexes - credit history
		{
			name:  "idx_transactions_user_created",
			query: "CREATE INDEX IF NOT EXISTS idx_transactions_user_created ON transactions(user_id, created_at DESC)",
		},
		{
			name:  "idx_transactions_session",
			query: "CREATE INDEX IF NOT EXISTS idx_transactions_session ON transactions(session_id) WHERE session_id IS NOT NULL",
		},
		{
			name:  "idx_transactions_type",
			query: "CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type, created_at DESC)",
		},

		// Notifications indexes - real-time queries
		{
			name:  "idx_notifications_user_read",
			query: "CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC)",
		},
		{
			name:  "idx_notifications_unread",
			query: "CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, created_at DESC) WHERE is_read = false",
		},

		// Reviews indexes - rating queries
		{
			name:  "idx_reviews_reviewee_type",
			query: "CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_type ON reviews(reviewee_id, type, created_at DESC)",
		},
		{
			name:  "idx_reviews_session",
			query: "CREATE INDEX IF NOT EXISTS idx_reviews_session ON reviews(session_id)",
		},

		// User badges indexes - gamification
		{
			name:  "idx_user_badges_user_earned",
			query: "CREATE INDEX IF NOT EXISTS idx_user_badges_user_earned ON user_badges(user_id, earned_at DESC)",
		},
		{
			name:  "idx_user_badges_pinned",
			query: "CREATE INDEX IF NOT EXISTS idx_user_badges_pinned ON user_badges(user_id, is_pinned) WHERE is_pinned = true",
		},

		// Skills indexes - search and filter
		{
			name:  "idx_skills_category",
			query: "CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category)",
		},
		{
			name:  "idx_skills_name_trgm",
			query: "CREATE INDEX IF NOT EXISTS idx_skills_name_trgm ON skills USING gin(name gin_trgm_ops)",
		},

		// Users indexes - profile queries
		{
			name:  "idx_users_username",
			query: "CREATE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE is_active = true",
		},
		{
			name:  "idx_users_email",
			query: "CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE is_active = true",
		},

		// Availability indexes - scheduling
		{
			name:  "idx_availability_user_day",
			query: "CREATE INDEX IF NOT EXISTS idx_availability_user_day ON availabilities(user_id, day_of_week, is_active) WHERE is_active = true",
		},
	}

	// Enable pg_trgm extension for fuzzy search
	if err := db.Exec("CREATE EXTENSION IF NOT EXISTS pg_trgm").Error; err != nil {
		log.Printf("⚠️  Warning: Could not create pg_trgm extension: %v", err)
	}

	// Create each index
	successCount := 0
	for _, idx := range indexes {
		if err := db.Exec(idx.query).Error; err != nil {
			log.Printf("⚠️  Warning: Failed to create index %s: %v", idx.name, err)
		} else {
			successCount++
		}
	}

	log.Printf("✅ Created %d/%d performance indexes", successCount, len(indexes))
	return nil
}

// AnalyzeQueryPerformance provides query performance analysis
func AnalyzeQueryPerformance(db *gorm.DB) error {
	log.Println("Analyzing query performance...")

	// Run ANALYZE to update statistics
	if err := db.Exec("ANALYZE").Error; err != nil {
		return err
	}

	log.Println("✅ Query performance analysis completed")
	return nil
}
