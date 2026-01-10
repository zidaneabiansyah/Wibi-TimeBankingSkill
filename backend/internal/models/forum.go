package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

// ForumCategory represents a forum category
type ForumCategory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Name        string    `gorm:"index" json:"name"`
	Description string    `json:"description"`
	Icon        string    `json:"icon"`
	Color       string    `json:"color"`
	ThreadCount int       `json:"thread_count"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ForumThread represents a forum discussion thread
type ForumThread struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	CategoryID  uint      `gorm:"index" json:"category_id"`
	Category    *ForumCategory `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	AuthorID    uint      `gorm:"index" json:"author_id"`
	Author      *User     `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Title       string    `gorm:"index" json:"title"`
	Content     string    `gorm:"type:text" json:"content"`
	Tags        JSONArray `gorm:"type:jsonb" json:"tags"`
	ViewCount   int       `json:"view_count"`
	ReplyCount  int       `json:"reply_count"`
	IsPinned    bool      `json:"is_pinned"`
	IsClosed    bool      `json:"is_closed"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// ForumReply represents a reply to a forum thread
type ForumReply struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ThreadID  uint      `gorm:"index" json:"thread_id"`
	Thread    *ForumThread `gorm:"foreignKey:ThreadID" json:"thread,omitempty"`
	ParentID  *uint      `json:"parent_id"`
	Parent    *ForumReply `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	AuthorID  uint      `gorm:"index" json:"author_id"`
	Author    *User     `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Content   string    `gorm:"type:text" json:"content"`
	LikeCount int       `json:"like_count"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// SuccessStory represents a user's success story
type SuccessStory struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	UserID      uint      `gorm:"index" json:"user_id"`
	User        *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Title       string    `json:"title"`
	Description string    `gorm:"type:text" json:"description"`
	Category    string    `gorm:"index" json:"category"`
	FeaturedImageURL string `json:"featured_image_url"`
	Images      JSONArray `gorm:"type:jsonb" json:"images"`
	Tags        JSONArray `gorm:"type:jsonb" json:"tags"`
	LikeCount   int       `json:"like_count"`
	CommentCount int      `json:"comment_count"`
	IsPublished bool      `json:"is_published"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// StoryComment represents a comment on a success story
type StoryComment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	StoryID   uint      `gorm:"index" json:"story_id"`
	Story     *SuccessStory `gorm:"foreignKey:StoryID" json:"story,omitempty"`
	ParentID  *uint      `json:"parent_id"`
	Parent    *StoryComment `gorm:"foreignKey:ParentID" json:"parent,omitempty"`
	AuthorID  uint      `gorm:"index" json:"author_id"`
	Author    *User     `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
	Content   string    `gorm:"type:text" json:"content"`
	LikeCount int       `json:"like_count"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Endorsement represents a peer endorsement for a skill
type Endorsement struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"index" json:"user_id"`
	User      *User     `gorm:"foreignKey:UserID" json:"user,omitempty"`
	SkillID   uint      `gorm:"index" json:"skill_id"`
	Skill     *Skill    `gorm:"foreignKey:SkillID" json:"skill,omitempty"`
	EndorserID uint     `gorm:"index" json:"endorser_id"`
	Endorser  *User     `gorm:"foreignKey:EndorserID" json:"endorser,omitempty"`
	Message   string    `json:"message"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// JSONArray is a custom type for JSONB arrays
type JSONArray []string

// Value implements the driver.Valuer interface
func (ja JSONArray) Value() (driver.Value, error) {
	return json.Marshal(ja)
}

// Scan implements the sql.Scanner interface
func (ja *JSONArray) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion failed")
	}
	return json.Unmarshal(bytes, &ja)
}
