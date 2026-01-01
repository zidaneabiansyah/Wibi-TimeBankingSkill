import { apiClient } from '@/lib/api';
import api from '@/lib/api';
import type {
    UserAnalytics,
    PlatformAnalytics,
    SessionStatistic,
    CreditStatistic,
} from '@/types';

/**
 * Analytics Service - Handles all analytics API calls
 */
export const analyticsService = {
    /**
     * Get current user's analytics
     */
    async getUserAnalytics(): Promise<UserAnalytics> {
        return apiClient.get<UserAnalytics>('/analytics/user');
    },

    /**
     * Get specific user's analytics (admin)
     */
    async getUserAnalyticsById(userId: number): Promise<UserAnalytics> {
        return apiClient.get<UserAnalytics>(`/analytics/user/${userId}`);
    },

    /**
     * Get platform-wide analytics (admin)
     */
    async getPlatformAnalytics(): Promise<PlatformAnalytics> {
        return apiClient.get<PlatformAnalytics>('/analytics/platform');
    },

    /**
     * Get session statistics
     */
    async getSessionStatistics(): Promise<SessionStatistic> {
        return apiClient.get<SessionStatistic>('/analytics/sessions');
    },

    /**
     * Get credit statistics
     */
    async getCreditStatistics(): Promise<CreditStatistic> {
        return apiClient.get<CreditStatistic>('/analytics/credits');
    },

    /**
     * Export analytics report
     */
    async exportAnalytics(format: 'csv' | 'pdf', type: 'user' | 'platform' = 'platform'): Promise<void> {
        try {
            const response = await api.post(
                '/analytics/export',
                { format, type },
                {
                    responseType: 'blob', // Important for file download
                }
            );

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `analytics_report_${date}.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export analytics:', error);
            throw error;
        }
    },
};
