package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// NotificationRepository handles all notification database operations
// Provides CRUD operations and complex queries for notifications
type NotificationRepository struct {
	db *gorm.DB
}

// NewNotificationRepository creates a new notification repository instance
func NewNotificationRepository(db *gorm.DB) *NotificationRepository {
	return &NotificationRepository{db: db}
}

// Create creates a new notification in the database
// Parameters:
//   - notification: Notification object to create
// Returns:
//   - error: If creation fails
func (r *NotificationRepository) Create(notification *models.Notification) error {
	return r.db.Create(notification).Error
}

// GetByID retrieves a notification by its ID
// Parameters:
//   - id: Notification ID
// Returns:
//   - *Notification: Notification object
//   - error: If notification not found or database error
func (r *NotificationRepository) GetByID(id uint) (*models.Notification, error) {
	var notification models.Notification
	if err := r.db.Where("id = ?", id).First(&notification).Error; err != nil {
		return nil, err
	}
	return &notification, nil
}

// GetByUserID retrieves all notifications for a user with pagination
// Parameters:
//   - userID: User ID
//   - limit: Number of notifications to fetch
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of notifications
//   - int64: Total count of notifications for user
//   - error: If database error
func (r *NotificationRepository) GetByUserID(userID uint, limit int, offset int) ([]models.Notification, int64, error) {
	var notifications []models.Notification
	var total int64

	// Get total count
	if err := r.db.Where("user_id = ?", userID).Model(&models.Notification{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results, ordered by most recent first
	if err := r.db.
		Where("user_id = ?", userID).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}

// GetUnreadByUserID retrieves all unread notifications for a user with pagination
// Parameters:
//   - userID: User ID
//   - limit: Number of notifications to fetch
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of unread notifications
//   - int64: Total count of unread notifications
//   - error: If database error
func (r *NotificationRepository) GetUnreadByUserID(userID uint, limit int, offset int) ([]models.Notification, int64, error) {
	var notifications []models.Notification
	var total int64

	// Get total count of unread
	if err := r.db.
		Where("user_id = ? AND is_read = ?", userID, false).
		Model(&models.Notification{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated unread results
	if err := r.db.
		Where("user_id = ? AND is_read = ?", userID, false).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}

// GetUnreadCount returns the count of unread notifications for a user
// Parameters:
//   - userID: User ID
// Returns:
//   - int64: Count of unread notifications
//   - error: If database error
func (r *NotificationRepository) GetUnreadCount(userID uint) (int64, error) {
	var count int64
	if err := r.db.
		Where("user_id = ? AND is_read = ?", userID, false).
		Model(&models.Notification{}).
		Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

// MarkAsRead marks a notification as read
// Parameters:
//   - id: Notification ID
// Returns:
//   - error: If update fails
func (r *NotificationRepository) MarkAsRead(id uint) error {
	return r.db.Model(&models.Notification{}).Where("id = ?", id).Updates(map[string]interface{}{
		"is_read": true,
		"read_at": gorm.Expr("CURRENT_TIMESTAMP"),
	}).Error
}

// MarkAllAsRead marks all notifications for a user as read
// Parameters:
//   - userID: User ID
// Returns:
//   - error: If update fails
func (r *NotificationRepository) MarkAllAsRead(userID uint) error {
	return r.db.Model(&models.Notification{}).
		Where("user_id = ? AND is_read = ?", userID, false).
		Updates(map[string]interface{}{
			"is_read": true,
			"read_at": gorm.Expr("CURRENT_TIMESTAMP"),
		}).Error
}

// Update updates a notification
// Parameters:
//   - notification: Notification object with updated values
// Returns:
//   - error: If update fails
func (r *NotificationRepository) Update(notification *models.Notification) error {
	return r.db.Save(notification).Error
}

// Delete performs a soft delete on a notification
// Parameters:
//   - id: Notification ID
// Returns:
//   - error: If delete fails
func (r *NotificationRepository) Delete(id uint) error {
	return r.db.Delete(&models.Notification{}, id).Error
}

// DeleteByUserID performs soft delete on all notifications for a user
// Parameters:
//   - userID: User ID
// Returns:
//   - error: If delete fails
func (r *NotificationRepository) DeleteByUserID(userID uint) error {
	return r.db.Where("user_id = ?", userID).Delete(&models.Notification{}).Error
}

// GetByType retrieves notifications of a specific type for a user
// Parameters:
//   - userID: User ID
//   - notificationType: Type of notification to filter
//   - limit: Number of notifications to fetch
//   - offset: Pagination offset
// Returns:
//   - []Notification: List of notifications of specified type
//   - int64: Total count
//   - error: If database error
func (r *NotificationRepository) GetByType(userID uint, notificationType models.NotificationType, limit int, offset int) ([]models.Notification, int64, error) {
	var notifications []models.Notification
	var total int64

	// Get total count
	if err := r.db.
		Where("user_id = ? AND type = ?", userID, notificationType).
		Model(&models.Notification{}).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated results
	if err := r.db.
		Where("user_id = ? AND type = ?", userID, notificationType).
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&notifications).Error; err != nil {
		return nil, 0, err
	}

	return notifications, total, nil
}
