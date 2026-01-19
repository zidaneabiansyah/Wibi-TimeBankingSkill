package database

import (
	"fmt"
	"time"

	"gorm.io/gorm"
)

// MaterializedViews manages PostgreSQL materialized views for query optimization
//
// Materialized views pre-compute expensive queries and store results.
// They're especially useful for:
//   - Leaderboards (badge counts, session counts, ratings)
//   - Analytics dashboards
//   - Aggregated statistics
//
// Trade-off: Data may be slightly stale (refreshed periodically)
// but queries are 10-100x faster.

// CreateMaterializedViews creates all materialized views
// Should be called during database initialization
func CreateMaterializedViews(db *gorm.DB) error {
	fmt.Println("Creating materialized views for performance optimization...")

	views := []struct {
		name string
		sql  string
	}{
		{
			name: "leaderboard_badges",
			sql: `
				CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_badges AS
				SELECT 
					u.id AS user_id,
					u.full_name,
					u.username,
					u.avatar,
					u.school,
					COUNT(ub.id) AS badge_count,
					COALESCE(SUM(
						CASE 
							WHEN b.rarity = 5 THEN 10
							WHEN b.rarity = 4 THEN 5
							WHEN b.rarity = 3 THEN 3
							WHEN b.rarity = 2 THEN 2
							ELSE 1 
						END
					), 0) AS rarity_score
				FROM users u
				LEFT JOIN user_badges ub ON u.id = ub.user_id
				LEFT JOIN badges b ON ub.badge_id = b.id
				WHERE u.is_active = true AND u.deleted_at IS NULL
				GROUP BY u.id, u.full_name, u.username, u.avatar, u.school
				ORDER BY badge_count DESC, rarity_score DESC
			`,
		},
		{
			name: "leaderboard_sessions",
			sql: `
				CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_sessions AS
				SELECT 
					u.id AS user_id,
					u.full_name,
					u.username,
					u.avatar,
					u.school,
					COUNT(CASE WHEN s.teacher_id = u.id AND s.status = 'completed' THEN 1 END) AS sessions_as_teacher,
					COUNT(CASE WHEN s.student_id = u.id AND s.status = 'completed' THEN 1 END) AS sessions_as_student,
					COUNT(CASE WHEN s.status = 'completed' THEN 1 END) AS total_sessions,
					COALESCE(SUM(CASE WHEN s.teacher_id = u.id AND s.status = 'completed' THEN s.duration END), 0) AS hours_taught,
					COALESCE(SUM(CASE WHEN s.student_id = u.id AND s.status = 'completed' THEN s.duration END), 0) AS hours_learned
				FROM users u
				LEFT JOIN sessions s ON (s.teacher_id = u.id OR s.student_id = u.id)
				WHERE u.is_active = true AND u.deleted_at IS NULL
				GROUP BY u.id, u.full_name, u.username, u.avatar, u.school
				ORDER BY total_sessions DESC
			`,
		},
		{
			name: "leaderboard_ratings",
			sql: `
				CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_ratings AS
				SELECT 
					u.id AS user_id,
					u.full_name,
					u.username,
					u.avatar,
					u.school,
					u.average_rating_as_teacher,
					u.total_sessions_as_teacher,
					COUNT(r.id) AS review_count,
					COALESCE(AVG(r.rating), 0) AS calculated_avg_rating
				FROM users u
				LEFT JOIN sessions s ON s.teacher_id = u.id AND s.status = 'completed'
				LEFT JOIN reviews r ON r.session_id = s.id
				WHERE u.is_active = true 
					AND u.deleted_at IS NULL
					AND u.total_sessions_as_teacher > 0
				GROUP BY u.id, u.full_name, u.username, u.avatar, u.school, 
						u.average_rating_as_teacher, u.total_sessions_as_teacher
				HAVING COUNT(r.id) >= 3
				ORDER BY calculated_avg_rating DESC, review_count DESC
			`,
		},
		{
			name: "leaderboard_credits",
			sql: `
				CREATE MATERIALIZED VIEW IF NOT EXISTS leaderboard_credits AS
				SELECT 
					u.id AS user_id,
					u.full_name,
					u.username,
					u.avatar,
					u.school,
					u.credit_balance,
					u.total_earned,
					u.total_spent,
					(u.total_earned + u.total_spent) AS total_activity
				FROM users u
				WHERE u.is_active = true AND u.deleted_at IS NULL
				ORDER BY total_earned DESC
			`,
		},
		{
			name: "skill_statistics",
			sql: `
				CREATE MATERIALIZED VIEW IF NOT EXISTS skill_statistics AS
				SELECT 
					s.id AS skill_id,
					s.name AS skill_name,
					s.category,
					COUNT(DISTINCT us.user_id) AS teacher_count,
					COUNT(DISTINCT ls.user_id) AS learner_count,
					COALESCE(AVG(us.hourly_rate), 0) AS avg_hourly_rate,
					COUNT(DISTINCT sess.id) AS session_count,
					COALESCE(AVG(r.rating), 0) AS avg_rating
				FROM skills s
				LEFT JOIN user_skills us ON us.skill_id = s.id AND us.is_available = true
				LEFT JOIN learning_skills ls ON ls.skill_id = s.id
				LEFT JOIN sessions sess ON sess.user_skill_id = us.id AND sess.status = 'completed'
				LEFT JOIN reviews r ON r.session_id = sess.id
				WHERE s.deleted_at IS NULL
				GROUP BY s.id, s.name, s.category
				ORDER BY session_count DESC
			`,
		},
	}

	// Create each materialized view
	for _, view := range views {
		if err := db.Exec(view.sql).Error; err != nil {
			fmt.Printf("⚠️  Warning: Could not create materialized view %s: %v\n", view.name, err)
			// Continue with other views, don't fail completely
		} else {
			fmt.Printf("✅ Created materialized view: %s\n", view.name)
		}
	}

	// Create indexes on materialized views
	indexes := []string{
		"CREATE INDEX IF NOT EXISTS idx_lb_badges_count ON leaderboard_badges(badge_count DESC)",
		"CREATE INDEX IF NOT EXISTS idx_lb_badges_rarity ON leaderboard_badges(rarity_score DESC)",
		"CREATE INDEX IF NOT EXISTS idx_lb_sessions_total ON leaderboard_sessions(total_sessions DESC)",
		"CREATE INDEX IF NOT EXISTS idx_lb_sessions_taught ON leaderboard_sessions(hours_taught DESC)",
		"CREATE INDEX IF NOT EXISTS idx_lb_ratings_avg ON leaderboard_ratings(calculated_avg_rating DESC)",
		"CREATE INDEX IF NOT EXISTS idx_lb_credits_earned ON leaderboard_credits(total_earned DESC)",
		"CREATE INDEX IF NOT EXISTS idx_skill_stats_sessions ON skill_statistics(session_count DESC)",
	}

	for _, idx := range indexes {
		if err := db.Exec(idx).Error; err != nil {
			fmt.Printf("⚠️  Warning: Could not create index: %v\n", err)
		}
	}

	fmt.Println("✅ Materialized views setup complete")
	return nil
}

// RefreshMaterializedViews refreshes all materialized views
// Should be called periodically (e.g., every 5-15 minutes via cron/scheduler)
//
// CONCURRENTLY allows reads while refreshing (requires unique index)
// Without CONCURRENTLY, the view is locked during refresh
func RefreshMaterializedViews(db *gorm.DB) error {
	views := []string{
		"leaderboard_badges",
		"leaderboard_sessions",
		"leaderboard_ratings",
		"leaderboard_credits",
		"skill_statistics",
	}

	for _, view := range views {
		// Try CONCURRENTLY first (non-blocking), fall back to regular refresh
		sql := fmt.Sprintf("REFRESH MATERIALIZED VIEW CONCURRENTLY %s", view)
		if err := db.Exec(sql).Error; err != nil {
			// CONCURRENTLY requires unique index, try without
			sql = fmt.Sprintf("REFRESH MATERIALIZED VIEW %s", view)
			if err := db.Exec(sql).Error; err != nil {
				fmt.Printf("⚠️  Warning: Could not refresh %s: %v\n", view, err)
			}
		}
	}

	return nil
}

// RefreshLeaderboardViews refreshes only leaderboard views
// Call this more frequently than full refresh if needed
func RefreshLeaderboardViews(db *gorm.DB) error {
	views := []string{
		"leaderboard_badges",
		"leaderboard_sessions",
		"leaderboard_ratings",
		"leaderboard_credits",
	}

	for _, view := range views {
		sql := fmt.Sprintf("REFRESH MATERIALIZED VIEW %s", view)
		if err := db.Exec(sql).Error; err != nil {
			return fmt.Errorf("failed to refresh %s: %w", view, err)
		}
	}

	return nil
}

// StartMaterializedViewRefresher starts a background goroutine that
// periodically refreshes materialized views
//
// Parameters:
//   - db: Database connection
//   - interval: How often to refresh (recommended: 5-15 minutes)
//
// Returns:
//   - chan struct{}: Send to this channel to stop the refresher
func StartMaterializedViewRefresher(db *gorm.DB, interval time.Duration) chan struct{} {
	stop := make(chan struct{})
	ticker := time.NewTicker(interval)

	go func() {
		for {
			select {
			case <-ticker.C:
				if err := RefreshMaterializedViews(db); err != nil {
					fmt.Printf("⚠️  Materialized view refresh error: %v\n", err)
				} else {
					fmt.Println("✅ Materialized views refreshed")
				}
			case <-stop:
				ticker.Stop()
				return
			}
		}
	}()

	return stop
}

// DropMaterializedViews drops all materialized views
// Use only for cleanup or schema changes
func DropMaterializedViews(db *gorm.DB) error {
	views := []string{
		"leaderboard_badges",
		"leaderboard_sessions",
		"leaderboard_ratings",
		"leaderboard_credits",
		"skill_statistics",
	}

	for _, view := range views {
		sql := fmt.Sprintf("DROP MATERIALIZED VIEW IF EXISTS %s CASCADE", view)
		if err := db.Exec(sql).Error; err != nil {
			return fmt.Errorf("failed to drop %s: %w", view, err)
		}
	}

	return nil
}
