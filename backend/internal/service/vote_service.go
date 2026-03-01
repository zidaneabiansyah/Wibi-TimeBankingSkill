package service

import (
	"errors"

	"github.com/timebankingskill/backend/internal/repository"
)

// VoteService encapsulates all toggle-vote business logic for both forum
// threads (upvote) and success stories (like).
type VoteService struct {
	voteRepo  *repository.VoteRepository
	forumRepo *repository.ForumRepository
	storyRepo *repository.StoryRepository
}

// NewVoteService creates a new VoteService.
func NewVoteService(
	voteRepo *repository.VoteRepository,
	forumRepo *repository.ForumRepository,
	storyRepo *repository.StoryRepository,
) *VoteService {
	return &VoteService{
		voteRepo:  voteRepo,
		forumRepo: forumRepo,
		storyRepo: storyRepo,
	}
}

// VoteResult is returned for every toggle operation.
type VoteResult struct {
	// Voted is true when the action resulted in an upvote/like being added.
	Voted bool  `json:"voted"`
	Count int64 `json:"count"`
}

// ─────────────────────────────────────────────
// THREAD UPVOTE
// ─────────────────────────────────────────────

// ToggleThreadUpvote toggles a user's upvote on a thread.
// A user may upvote once; calling again removes the upvote (Reddit-style).
func (s *VoteService) ToggleThreadUpvote(userID, threadID uint) (*VoteResult, error) {
	// Validate thread exists
	if _, err := s.forumRepo.GetThreadByID(threadID); err != nil {
		return nil, errors.New("thread not found")
	}

	upvoted, count, err := s.voteRepo.ToggleThreadUpvote(userID, threadID)
	if err != nil {
		return nil, err
	}

	return &VoteResult{Voted: upvoted, Count: count}, nil
}

// GetThreadVoteStatus returns whether the user has upvoted a thread and its total count.
func (s *VoteService) GetThreadVoteStatus(userID, threadID uint) (*VoteResult, error) {
	voted, err := s.voteRepo.HasUpvotedThread(userID, threadID)
	if err != nil {
		return nil, err
	}

	count, err := s.voteRepo.GetThreadUpvoteCount(threadID)
	if err != nil {
		return nil, err
	}

	return &VoteResult{Voted: voted, Count: count}, nil
}

// ─────────────────────────────────────────────
// STORY LIKE
// ─────────────────────────────────────────────

// ToggleStoryLike toggles a user's like on a success story.
func (s *VoteService) ToggleStoryLike(userID, storyID uint) (*VoteResult, error) {
	// Validate story exists
	if _, err := s.storyRepo.GetStoryByID(storyID); err != nil {
		return nil, errors.New("story not found")
	}

	liked, count, err := s.voteRepo.ToggleStoryLike(userID, storyID)
	if err != nil {
		return nil, err
	}

	return &VoteResult{Voted: liked, Count: count}, nil
}

// GetStoryLikeStatus returns whether the user has liked a story and its total count.
func (s *VoteService) GetStoryLikeStatus(userID, storyID uint) (*VoteResult, error) {
	liked, err := s.voteRepo.HasLikedStory(userID, storyID)
	if err != nil {
		return nil, err
	}

	count, err := s.voteRepo.GetStoryLikeCount(storyID)
	if err != nil {
		return nil, err
	}

	return &VoteResult{Voted: liked, Count: count}, nil
}

// GetThreadUpvoteCountOnly returns just the upvote count for a thread (guest-safe).
func (s *VoteService) GetThreadUpvoteCountOnly(threadID uint) (int64, error) {
	return s.voteRepo.GetThreadUpvoteCount(threadID)
}

// GetStoryLikeCountOnly returns just the like count for a story (guest-safe).
func (s *VoteService) GetStoryLikeCountOnly(storyID uint) (int64, error) {
	return s.voteRepo.GetStoryLikeCount(storyID)
}
