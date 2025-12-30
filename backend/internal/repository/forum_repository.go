package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// ForumRepository handles forum data access
type ForumRepository struct {
	db *gorm.DB
}

// NewForumRepository creates a new forum repository
func NewForumRepository(db *gorm.DB) *ForumRepository {
	return &ForumRepository{db: db}
}

// ===== CATEGORY OPERATIONS =====

// GetAllCategories gets all forum categories
func (r *ForumRepository) GetAllCategories() ([]models.ForumCategory, error) {
	var categories []models.ForumCategory
	if err := r.db.Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}

// GetCategoryByID gets a category by ID
func (r *ForumRepository) GetCategoryByID(id uint) (*models.ForumCategory, error) {
	var category models.ForumCategory
	if err := r.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

// ===== THREAD OPERATIONS =====

// CreateThread creates a new forum thread
func (r *ForumRepository) CreateThread(thread *models.ForumThread) error {
	return r.db.Create(thread).Error
}

// GetThreadByID gets a thread by ID with author and category
func (r *ForumRepository) GetThreadByID(id uint) (*models.ForumThread, error) {
	var thread models.ForumThread
	if err := r.db.Preload("Author").Preload("Category").First(&thread, id).Error; err != nil {
		return nil, err
	}
	return &thread, nil
}

// GetThreadsByCategory gets threads in a category with pagination
func (r *ForumRepository) GetThreadsByCategory(categoryID uint, limit, offset int) ([]models.ForumThread, int64, error) {
	var threads []models.ForumThread
	var total int64

	if err := r.db.Model(&models.ForumThread{}).Where("category_id = ?", categoryID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Author").Where("category_id = ?", categoryID).Order("is_pinned DESC, created_at DESC").Limit(limit).Offset(offset).Find(&threads).Error; err != nil {
		return nil, 0, err
	}

	return threads, total, nil
}

// GetThreadsByAuthor gets threads by a specific author
func (r *ForumRepository) GetThreadsByAuthor(authorID uint, limit, offset int) ([]models.ForumThread, int64, error) {
	var threads []models.ForumThread
	var total int64

	if err := r.db.Model(&models.ForumThread{}).Where("author_id = ?", authorID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Author").Preload("Category").Where("author_id = ?", authorID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&threads).Error; err != nil {
		return nil, 0, err
	}

	return threads, total, nil
}

// UpdateThread updates a thread
func (r *ForumRepository) UpdateThread(thread *models.ForumThread) error {
	return r.db.Save(thread).Error
}

// IncrementThreadViewCount increments view count
func (r *ForumRepository) IncrementThreadViewCount(threadID uint) error {
	return r.db.Model(&models.ForumThread{}).Where("id = ?", threadID).Update("view_count", gorm.Expr("view_count + ?", 1)).Error
}

// ===== REPLY OPERATIONS =====

// CreateReply creates a new forum reply
func (r *ForumRepository) CreateReply(reply *models.ForumReply) error {
	if err := r.db.Create(reply).Error; err != nil {
		return err
	}
	// Increment reply count on thread
	return r.db.Model(&models.ForumThread{}).Where("id = ?", reply.ThreadID).Update("reply_count", gorm.Expr("reply_count + ?", 1)).Error
}

// GetRepliesByThread gets replies for a thread with pagination
func (r *ForumRepository) GetRepliesByThread(threadID uint, limit, offset int) ([]models.ForumReply, int64, error) {
	var replies []models.ForumReply
	var total int64

	if err := r.db.Model(&models.ForumReply{}).Where("thread_id = ?", threadID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Author").Where("thread_id = ?", threadID).Order("created_at ASC").Limit(limit).Offset(offset).Find(&replies).Error; err != nil {
		return nil, 0, err
	}

	return replies, total, nil
}

// DeleteReply deletes a reply
func (r *ForumRepository) DeleteReply(replyID uint) error {
	reply := &models.ForumReply{}
	if err := r.db.First(reply, replyID).Error; err != nil {
		return err
	}

	if err := r.db.Delete(reply).Error; err != nil {
		return err
	}

	// Decrement reply count on thread
	return r.db.Model(&models.ForumThread{}).Where("id = ?", reply.ThreadID).Update("reply_count", gorm.Expr("reply_count - ?", 1)).Error
}

// SearchThreads searches threads by title or content
func (r *ForumRepository) SearchThreads(query string, limit, offset int) ([]models.ForumThread, int64, error) {
	var threads []models.ForumThread
	var total int64
	
	searchQuery := "%" + query + "%"
	db := r.db.Model(&models.ForumThread{}).
		Where("title ILIKE ? OR content ILIKE ?", searchQuery, searchQuery)

	if err := db.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	err := db.Preload("Author").
		Preload("Category").
		Order("created_at desc").
		Limit(limit).
		Offset(offset).
		Find(&threads).Error

	return threads, total, err
}
