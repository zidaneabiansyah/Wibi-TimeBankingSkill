package database

import (
  "fmt"
  "log"
  "time"

  "github.com/timebankingskill/backend/internal/config"
  "github.com/timebankingskill/backend/internal/models"
  "golang.org/x/crypto/bcrypt"
  "gorm.io/driver/postgres"
  "gorm.io/gorm"
  "gorm.io/gorm/logger"
)

// DB is the global database instance
var DB *gorm.DB

// Connect establishes database connection with optimized settings
func Connect(cfg *config.DatabaseConfig) error {
	dsn := cfg.GetDSN()

	// Configure GORM logger - use Silent mode in production for better performance
	// Use Silent mode by default for production performance
	logMode := logger.Silent

	gormConfig := &gorm.Config{
		Logger: logger.Default.LogMode(logMode),
	}

	// Connect to database with timeout
	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
	if err != nil {
		return fmt.Errorf("failed to connect to database: %w", err)
	}

	// Get SQL database instance
	sqlDB, err := db.DB()
	if err != nil {
		return fmt.Errorf("failed to get database instance: %w", err)
	}

	// Optimize connection pool for production
	// MaxIdleConns: connections to keep alive
	// MaxOpenConns: maximum number of open connections
	sqlDB.SetMaxIdleConns(2)
	sqlDB.SetMaxOpenConns(4)
	sqlDB.SetConnMaxLifetime(time.Hour)
	sqlDB.SetConnMaxIdleTime(10 * time.Minute)

	// Assign to global variable
	DB = db

	log.Println("Database connected successfully")
	return nil
}

// AutoMigrate runs database migrations (only if tables don't exist)
// Also creates performance indexes for query optimization
func AutoMigrate() error {
  if DB == nil {
    return fmt.Errorf("database not connected")
  }

  // GORM AutoMigrate is idempotent - safe to run multiple times
  // It only creates tables that don't exist and adds missing columns
  // This ensures new models (like Notification) are always created
  log.Println("Running database migrations...")

  err := models.AutoMigrate(DB)
  if err != nil {
    return fmt.Errorf("failed to run migrations: %w", err)
  }

  // Create performance indexes
  if err := RunMigrations(DB); err != nil {
    log.Printf("⚠️  Warning: Failed to create indexes: %v", err)
  }

  log.Println("Database migrations completed")
  return nil
}

// SeedInitialData seeds initial data (skills, badges, admins, etc.)
func SeedInitialData() error {
  if DB == nil {
    return fmt.Errorf("database not connected")
  }

  log.Println("Seeding initial data...")

  // Seed admin (always check, independent of other data)
  if err := seedAdmin(); err != nil {
    log.Printf("⚠️  Warning: Failed to seed admin: %v", err)
  }

  // Seed skills (has its own duplicate check)
  if err := seedSkills(); err != nil {
    log.Printf("⚠️  Warning: Failed to seed skills: %v", err)
  }

  // Seed badges (has its own duplicate check)
  if err := seedBadges(); err != nil {
    log.Printf("⚠️  Warning: Failed to seed badges: %v", err)
  }

  log.Println("Initial data seeding completed")
  return nil
}

// seedSkills creates initial skill categories
func seedSkills() error {
  skills := []models.Skill{
    // Academic
    {Name: "Mathematics - Algebra", Category: models.CategoryAcademic, Description: "Basic to advanced algebra", Icon: "📐"},
    {Name: "Mathematics - Calculus", Category: models.CategoryAcademic, Description: "Differential and integral calculus", Icon: "📊"},
    {Name: "Physics", Category: models.CategoryAcademic, Description: "General physics concepts", Icon: "⚛️"},
    {Name: "Chemistry", Category: models.CategoryAcademic, Description: "Chemistry fundamentals", Icon: "🧪"},
    {Name: "Biology", Category: models.CategoryAcademic, Description: "Life sciences", Icon: "🧬"},

    // Technical
    {Name: "Web Development", Category: models.CategoryTechnical, Description: "HTML, CSS, JavaScript", Icon: "💻"},
    {Name: "Python Programming", Category: models.CategoryTechnical, Description: "Python basics to advanced", Icon: "🐍"},
    {Name: "Graphic Design - Canva", Category: models.CategoryTechnical, Description: "Design using Canva", Icon: "🎨"},
    {Name: "Video Editing", Category: models.CategoryTechnical, Description: "Video editing skills", Icon: "🎬"},

    // Language
    {Name: "English - Speaking", Category: models.CategoryLanguage, Description: "English conversation", Icon: "🗣️"},
    {Name: "English - Writing", Category: models.CategoryLanguage, Description: "English writing skills", Icon: "✍️"},
    {Name: "Japanese", Category: models.CategoryLanguage, Description: "Japanese language", Icon: "🇯🇵"},

    // Creative
    {Name: "Drawing", Category: models.CategoryCreative, Description: "Art and drawing", Icon: "🖌️"},
    {Name: "Music - Guitar", Category: models.CategoryCreative, Description: "Guitar playing", Icon: "🎸"},
    {Name: "Photography", Category: models.CategoryCreative, Description: "Photography basics", Icon: "📸"},

    // Sports
    {Name: "Basketball", Category: models.CategorySports, Description: "Basketball skills", Icon: "🏀"},
    {Name: "Swimming", Category: models.CategorySports, Description: "Swimming techniques", Icon: "🏊"},
  }

  for _, skill := range skills {
    // Check if skill already exists
    var existing models.Skill
    result := DB.Where("name = ?", skill.Name).First(&existing)
    if result.Error == gorm.ErrRecordNotFound {
      // Create new skill
      if err := DB.Create(&skill).Error; err != nil {
        return fmt.Errorf("failed to seed skill %s: %w", skill.Name, err)
      }
    }
  }

  return nil
}

// seedBadges creates initial achievement badges
func seedBadges() error {
  badges := []models.Badge{
    {
      Name:         "Early Bird",
      Description:  "Completed your first session",
      Icon:         "🐣",
      Type:         models.BadgeTypeSpecial,
      Requirements: `{"sessions": 1}`,
      BonusCredits: 0.5,
      Rarity:       1,
      Color:        "#FFD700",
    },
    {
      Name:         "Quick Learner",
      Description:  "Completed 10 sessions as a student",
      Icon:         "📚",
      Type:         models.BadgeTypeMilestone,
      Requirements: `{"sessions_as_student": 10}`,
      BonusCredits: 1.0,
      Rarity:       2,
      Color:        "#4169E1",
    },
    {
      Name:         "Top Tutor",
      Description:  "Achieved 4.8+ rating with 20+ sessions",
      Icon:         "⭐",
      Type:         models.BadgeTypeQuality,
      Requirements: `{"rating": 4.8, "sessions": 20}`,
      BonusCredits: 2.0,
      Rarity:       4,
      Color:        "#FF6347",
    },
    {
      Name:         "Jack of All Trades",
      Description:  "Teach 5 different skills",
      Icon:         "🎭",
      Type:         models.BadgeTypeAchievement,
      Requirements: `{"unique_skills": 5}`,
      BonusCredits: 1.5,
      Rarity:       3,
      Color:        "#9370DB",
    },
    {
      Name:         "Time Banker",
      Description:  "Earned 50 total credits",
      Icon:         "💰",
      Type:         models.BadgeTypeMilestone,
      Requirements: `{"total_earned": 50}`,
      BonusCredits: 3.0,
      Rarity:       3,
      Color:        "#32CD32",
    },
    {
      Name:         "Dedicated Teacher",
      Description:  "Completed 50 sessions as a teacher",
      Icon:         "👨‍🏫",
      Type:         models.BadgeTypeMilestone,
      Requirements: `{"sessions_as_teacher": 50}`,
      BonusCredits: 2.5,
      Rarity:       4,
      Color:        "#FF8C00",
    },
  }

  for _, badge := range badges {
    // Check if badge already exists
    var existing models.Badge
    result := DB.Where("name = ?", badge.Name).First(&existing)
    if result.Error == gorm.ErrRecordNotFound {
      // Create new badge
      if err := DB.Create(&badge).Error; err != nil {
        return fmt.Errorf("failed to seed badge %s: %w", badge.Name, err)
      }
    }
  }

  return nil
}

// seedAdmin creates initial admin user
func seedAdmin() error {
  // Check if admin already exists
  var existingAdmin models.Admin
  result := DB.Where("email = ?", "admin@wibi.com").First(&existingAdmin)
  if result.Error == nil {
    log.Println("Admin user already exists, skipping admin seed")
    return nil
  }

  // Hash password
  hashedPassword, err := bcrypt.GenerateFromPassword([]byte("Admin123"), bcrypt.DefaultCost)
  if err != nil {
    return fmt.Errorf("failed to hash admin password: %w", err)
  }

  // Create admin user
  admin := models.Admin{
    Email:    "admin@wibi.com",
    Password: string(hashedPassword),
    FullName: "Administrator",
    Role:     "super_admin",
    IsActive: true,
  }

  if err := DB.Create(&admin).Error; err != nil {
    return fmt.Errorf("failed to create admin user: %w", err)
  }

  log.Println("Admin user created successfully")
  log.Println("   Email: admin@wibi.com")
  log.Println("   Password: Admin123")
  log.Println("   Role: super_admin")

  return nil
}

// Close closes database connection
func Close() error {
	if DB == nil {
		return nil
	}

	sqlDB, err := DB.DB()
	if err != nil {
		return err
	}

	return sqlDB.Close()
}
