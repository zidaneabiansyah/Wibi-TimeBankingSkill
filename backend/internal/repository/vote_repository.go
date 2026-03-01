package repository

import (
	"fmt"

	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// VoteRepository handles all vote/like data access with atomic operations.
type VoteRepository struct {
	db *gorm.DB
}

// NewVoteRepository creates a new VoteRepository.
func NewVoteRepository(db *gorm.DB) *VoteRepository {
	return &VoteRepository{db: db}
}

// ─────────────────────────────────────────────
// THREAD UPVOTE
// ─────────────────────────────────────────────

// ToggleThreadUpvote atomically inserts or deletes a thread upvote and keeps
// the forum_threads.upvote_count denormalized counter in sync.
// Returns (upvoted, newCount, error).
func (r *VoteRepository) ToggleThreadUpvote(userID, threadID uint) (upvoted bool, newCount int64, err error) {
	err = r.db.Transaction(func(tx *gorm.DB) error {
		// Try to delete first (un-upvote path)
		result := tx.Where("user_id = ? AND thread_id = ?", userID, threadID).
			Delete(&models.ThreadUpvote{})
		if result.Error != nil {
			return fmt.Errorf("toggle upvote delete: %w", result.Error)
		}

		if result.RowsAffected > 0 {
			// Was upvoted → now removed
			upvoted = false
			if err2 := tx.Model(&models.ForumThread{}).
				Where("id = ? AND upvote_count > 0", threadID).
				Update("upvote_count", gorm.Expr("upvote_count - 1")).Error; err2 != nil {
				return fmt.Errorf("decrement upvote_count: %w", err2)
			}
		} else {
			// Not upvoted yet → insert
			vote := &models.ThreadUpvote{UserID: userID, ThreadID: threadID}
			if err2 := tx.Clauses(clause.OnConflict{DoNothing: true}).
				Create(vote).Error; err2 != nil {
				return fmt.Errorf("insert upvote: %w", err2)
			}
			upvoted = true
			if err2 := tx.Model(&models.ForumThread{}).
				Where("id = ?", threadID).
				Update("upvote_count", gorm.Expr("upvote_count + 1")).Error; err2 != nil {
				return fmt.Errorf("increment upvote_count: %w", err2)
			}
		}

		// Fetch the latest count
		var thread models.ForumThread
		if err2 := tx.Select("upvote_count").First(&thread, threadID).Error; err2 != nil {
			return fmt.Errorf("fetch upvote_count: %w", err2)
		}
		newCount = int64(thread.UpvoteCount)
		return nil
	})
	return upvoted, newCount, err
}

// HasUpvotedThread checks whether a user has already upvoted a thread.
func (r *VoteRepository) HasUpvotedThread(userID, threadID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.ThreadUpvote{}).
		Where("user_id = ? AND thread_id = ?", userID, threadID).
		Count(&count).Error
	return count > 0, err
}

// GetThreadUpvoteCount returns the current upvote count for a thread.
func (r *VoteRepository) GetThreadUpvoteCount(threadID uint) (int64, error) {
	var thread models.ForumThread
	if err := r.db.Select("upvote_count").First(&thread, threadID).Error; err != nil {
		return 0, err
	}
	return int64(thread.UpvoteCount), nil
}

// ─────────────────────────────────────────────
// STORY LIKE
// ─────────────────────────────────────────────

// ToggleStoryLike atomically inserts or deletes a story like and keeps the
// success_stories.like_count denormalized counter in sync.
// Returns (liked, newCount, error).
func (r *VoteRepository) ToggleStoryLike(userID, storyID uint) (liked bool, newCount int64, err error) {
	err = r.db.Transaction(func(tx *gorm.DB) error {
		// Try to delete first (un-like path)
		result := tx.Where("user_id = ? AND story_id = ?", userID, storyID).
			Delete(&models.StoryLike{})
		if result.Error != nil {
			return fmt.Errorf("toggle like delete: %w", result.Error)
		}

		if result.RowsAffected > 0 {
			// Was liked → now removed
			liked = false
			if err2 := tx.Model(&models.SuccessStory{}).
				Where("id = ? AND like_count > 0", storyID).
				Update("like_count", gorm.Expr("like_count - 1")).Error; err2 != nil {
				return fmt.Errorf("decrement like_count: %w", err2)
			}
		} else {
			// Not liked yet → insert
			like := &models.StoryLike{UserID: userID, StoryID: storyID}
			if err2 := tx.Clauses(clause.OnConflict{DoNothing: true}).
				Create(like).Error; err2 != nil {
				return fmt.Errorf("insert like: %w", err2)
			}
			liked = true
			if err2 := tx.Model(&models.SuccessStory{}).
				Where("id = ?", storyID).
				Update("like_count", gorm.Expr("like_count + 1")).Error; err2 != nil {
				return fmt.Errorf("increment like_count: %w", err2)
			}
		}

		// Fetch the latest count
		var story models.SuccessStory
		if err2 := tx.Select("like_count").First(&story, storyID).Error; err2 != nil {
			return fmt.Errorf("fetch like_count: %w", err2)
		}
		newCount = int64(story.LikeCount)
		return nil
	})
	return liked, newCount, err
}

// HasLikedStory checks whether a user has already liked a story.
func (r *VoteRepository) HasLikedStory(userID, storyID uint) (bool, error) {
	var count int64
	err := r.db.Model(&models.StoryLike{}).
		Where("user_id = ? AND story_id = ?", userID, storyID).
		Count(&count).Error
	return count > 0, err
}

// GetStoryLikeCount returns the current like count for a story.
func (r *VoteRepository) GetStoryLikeCount(storyID uint) (int64, error) {
	var story models.SuccessStory
	if err := r.db.Select("like_count").First(&story, storyID).Error; err != nil {
		return 0, err
	}
	return int64(story.LikeCount), nil
}
