import axios from 'axios';
import type {
    UserAnalytics,
    PlatformAnalytics,
    SessionStatistic,
    CreditStatistic,
    ApiResponse,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Analytics Service - Handles all analytics API calls
 */
export const analyticsService = {
    /**
     * Get current user's analytics
     */
    async getUserAnalytics(): Promise<UserAnalytics> {
        try {
            const response = await axios.get<ApiResponse<UserAnalytics>>(
                `${API_BASE}/analytics/user`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as UserAnalytics);
        } catch (error) {
            console.error('Failed to fetch user analytics:', error);
            throw error;
        }
    },

    /**
     * Get specific user's analytics (admin)
     */
    async getUserAnalyticsById(userId: number): Promise<UserAnalytics> {
        try {
            const response = await axios.get<ApiResponse<UserAnalytics>>(
                `${API_BASE}/analytics/user/${userId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as UserAnalytics);
        } catch (error) {
            console.error('Failed to fetch user analytics:', error);
            throw error;
        }
    },

    /**
     * Get platform-wide analytics (admin)
     */
    async getPlatformAnalytics(): Promise<PlatformAnalytics> {
        try {
            const response = await axios.get<ApiResponse<PlatformAnalytics>>(
                `${API_BASE}/analytics/platform`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as PlatformAnalytics);
        } catch (error) {
            console.error('Failed to fetch platform analytics:', error);
            throw error;
        }
    },

    /**
     * Get session statistics
     */
    async getSessionStatistics(): Promise<SessionStatistic> {
        try {
            const response = await axios.get<ApiResponse<SessionStatistic>>(
                `${API_BASE}/analytics/sessions`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as SessionStatistic);
        } catch (error) {
            console.error('Failed to fetch session statistics:', error);
            throw error;
        }
    },

    /**
     * Get credit statistics
     */
    async getCreditStatistics(): Promise<CreditStatistic> {
        try {
            const response = await axios.get<ApiResponse<CreditStatistic>>(
                `${API_BASE}/analytics/credits`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as CreditStatistic);
        } catch (error) {
            console.error('Failed to fetch credit statistics:', error);
            throw error;
        }
    },
    /**
     * Export analytics report
     */
    async exportAnalytics(format: 'csv' | 'pdf', type: 'user' | 'platform' = 'platform'): Promise<void> {
        try {
            const response = await axios.post(
                `${API_BASE}/analytics/export`,
                { format, type },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
