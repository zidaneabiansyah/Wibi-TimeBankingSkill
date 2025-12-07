package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// StoryRepository handles success story data access
type StoryRepository struct {
	db *gorm.DB
}

// NewStoryRepository creates a new story repository
func NewStoryRepository(db *gorm.DB) *StoryRepository {
	return &StoryRepository{db: db}
}

// ===== STORY OPERATIONS =====

// CreateStory creates a new success story
func (r *StoryRepository) CreateStory(story *models.SuccessStory) error {
	return r.db.Create(story).Error
}

// GetStoryByID gets a story by ID
func (r *StoryRepository) GetStoryByID(id uint) (*models.SuccessStory, error) {
	var story models.SuccessStory
	if err := r.db.Preload("User").First(&story, id).Error; err != nil {
		return nil, err
	}
	return &story, nil
}

// GetPublishedStories gets all published stories with pagination
func (r *StoryRepository) GetPublishedStories(limit, offset int) ([]models.SuccessStory, int64, error) {
	var stories []models.SuccessStory
	var total int64

	if err := r.db.Model(&models.SuccessStory{}).Where("is_published = ?", true).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("User").Where("is_published = ?", true).Order("created_at DESC").Limit(limit).Offset(offset).Find(&stories).Error; err != nil {
		return nil, 0, err
	}

	return stories, total, nil
}

// GetStoriesByUser gets stories by a specific user
func (r *StoryRepository) GetStoriesByUser(userID uint, limit, offset int) ([]models.SuccessStory, int64, error) {
	var stories []models.SuccessStory
	var total int64

	if err := r.db.Model(&models.SuccessStory{}).Where("user_id = ?", userID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Where("user_id = ?", userID).Order("created_at DESC").Limit(limit).Offset(offset).Find(&stories).Error; err != nil {
		return nil, 0, err
	}

	return stories, total, nil
}

// UpdateStory updates a story
func (r *StoryRepository) UpdateStory(story *models.SuccessStory) error {
	return r.db.Save(story).Error
}

// DeleteStory deletes a story
func (r *StoryRepository) DeleteStory(id uint) error {
	return r.db.Delete(&models.SuccessStory{}, id).Error
}

// ===== COMMENT OPERATIONS =====

// CreateComment creates a new story comment
func (r *StoryRepository) CreateComment(comment *models.StoryComment) error {
	if err := r.db.Create(comment).Error; err != nil {
		return err
	}
	// Increment comment count on story
	return r.db.Model(&models.SuccessStory{}).Where("id = ?", comment.StoryID).Update("comment_count", gorm.Expr("comment_count + ?", 1)).Error
}

// GetCommentsByStory gets comments for a story with pagination
func (r *StoryRepository) GetCommentsByStory(storyID uint, limit, offset int) ([]models.StoryComment, int64, error) {
	var comments []models.StoryComment
	var total int64

	if err := r.db.Model(&models.StoryComment{}).Where("story_id = ?", storyID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if err := r.db.Preload("Author").Where("story_id = ?", storyID).Order("created_at ASC").Limit(limit).Offset(offset).Find(&comments).Error; err != nil {
		return nil, 0, err
	}

	return comments, total, nil
}

// DeleteComment deletes a comment
func (r *StoryRepository) DeleteComment(commentID uint) error {
	comment := &models.StoryComment{}
	if err := r.db.First(comment, commentID).Error; err != nil {
		return err
	}

	if err := r.db.Delete(comment).Error; err != nil {
		return err
	}

	// Decrement comment count on story
	return r.db.Model(&models.SuccessStory{}).Where("id = ?", comment.StoryID).Update("comment_count", gorm.Expr("comment_count - ?", 1)).Error
}

// IncrementStoryLikes increments like count
func (r *StoryRepository) IncrementStoryLikes(storyID uint) error {
	return r.db.Model(&models.SuccessStory{}).Where("id = ?", storyID).Update("like_count", gorm.Expr("like_count + ?", 1)).Error
}

// DecrementStoryLikes decrements like count
func (r *StoryRepository) DecrementStoryLikes(storyID uint) error {
	return r.db.Model(&models.SuccessStory{}).Where("id = ?", storyID).Update("like_count", gorm.Expr("like_count - ?", 1)).Error
}
