import api from '../api';
import type {
    Notification,
    ApiResponse,
} from '@/types';

interface NotificationListResponse {
    notifications: Notification[];
    total: number;
    limit: number;
    offset: number;
}

interface UnreadCountResponse {
    unread_count: number;
}

export interface NotificationPreferences {
    id?: number;
    user_id?: number;
    sessionNotifications: boolean;
    creditNotifications: boolean;
    achievementNotifications: boolean;
    reviewNotifications: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    quietHours: boolean;
    quietHoursStart: string;
    quietHoursEnd: string;
}

/**
 * Notification Service
 * Handles all notification-related API calls
 */
export const notificationService = {
    /**
     * Get paginated notifications for current user
     * @param limit - Number of notifications to fetch (default: 10)
     * @param offset - Pagination offset (default: 0)
     */
    async getNotifications(
        limit: number = 10,
        offset: number = 0
    ): Promise<NotificationListResponse> {
        const response = await api.get<ApiResponse<NotificationListResponse>>(
            '/notifications',
            {
                params: { limit, offset },
            }
        );
        return response.data.data!;
    },

    /**
     * Get unread notifications for current user
     * @param limit - Number of notifications to fetch (default: 10)
     * @param offset - Pagination offset (default: 0)
     */
    async getUnreadNotifications(
        limit: number = 10,
        offset: number = 0
    ): Promise<NotificationListResponse> {
        const response = await api.get<ApiResponse<NotificationListResponse>>(
            '/notifications/unread',
            {
                params: { limit, offset },
            }
        );
        return response.data.data!;
    },

    /**
     * Get count of unread notifications
     * Used for notification bell badge
     */
    async getUnreadCount(): Promise<number> {
        const response = await api.get<ApiResponse<UnreadCountResponse>>(
            '/notifications/unread/count'
        );
        return response.data.data?.unread_count || 0;
    },

    /**
     * Get notifications by type
     * @param type - Notification type (session, credit, achievement, review, social)
     * @param limit - Number of notifications to fetch (default: 10)
     * @param offset - Pagination offset (default: 0)
     */
    async getNotificationsByType(
        type: string,
        limit: number = 10,
        offset: number = 0
    ): Promise<NotificationListResponse> {
        const response = await api.get<ApiResponse<NotificationListResponse>>(
            `/notifications/type/${type}`,
            {
                params: { limit, offset },
            }
        );
        return response.data.data!;
    },

    /**
     * Mark a notification as read
     * @param id - Notification ID
     */
    async markAsRead(id: number): Promise<void> {
        await api.put(`/notifications/${id}/read`);
    },

    /**
     * Mark all notifications as read
     */
    async markAllAsRead(): Promise<void> {
        await api.put('/notifications/read-all');
    },

    /**
     * Delete a notification
     * @param id - Notification ID
     */
    async deleteNotification(id: number): Promise<void> {
        await api.delete(`/notifications/${id}`);
    },

    /**
     * Get current user's notification preferences
     * Returns saved preferences, or defaults if not set
     */
    async getPreferences(): Promise<NotificationPreferences> {
        const response = await api.get<ApiResponse<{ preferences: NotificationPreferences }>>(
            '/notifications/preferences'
        );
        return response.data.data!.preferences;
    },

    /**
     * Update notification preferences
     * @param preferences - New preferences object
     */
    async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
        const response = await api.put<ApiResponse<{ preferences: NotificationPreferences }>>(
            '/notifications/preferences',
            preferences
        );
        return response.data.data!.preferences;
    },
};

export default notificationService;
