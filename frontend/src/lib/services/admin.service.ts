import { apiClient } from '../api';
import type { 
    UserProfile, 
    Session, 
    Skill, 
    Transaction, 
    Review, 
    Badge, 
    ForumThread,
    ApiResponse 
} from '@/types';

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

/**
 * Admin Service - Handles all admin-specific API calls
 */
export const adminService = {
    // User Management
    async getAllUsers(page = 1, limit = 10, search = '', filter = ''): Promise<PaginatedResponse<UserProfile>> {
        return apiClient.get<PaginatedResponse<UserProfile>>(`/admin/users?page=${page}&limit=${limit}&search=${search}&filter=${filter}`);
    },

    async suspendUser(userId: number): Promise<void> {
        return apiClient.post(`/admin/users/${userId}/suspend`);
    },

    async activateUser(userId: number): Promise<void> {
        return apiClient.post(`/admin/users/${userId}/activate`);
    },

    // Session Management
    async getAllSessions(page = 1, limit = 10, search = '', status = ''): Promise<PaginatedResponse<Session>> {
        return apiClient.get<PaginatedResponse<Session>>(`/admin/sessions?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    },

    async resolveSession(sessionId: number, resolution: string): Promise<void> {
        return apiClient.post(`/admin/sessions/${sessionId}/resolve`, { resolution });
    },

    async approveSession(sessionId: number): Promise<void> {
        return apiClient.post(`/admin/sessions/${sessionId}/approve`);
    },

    async rejectSession(sessionId: number): Promise<void> {
        return apiClient.post(`/admin/sessions/${sessionId}/reject`);
    },

    async completeSession(sessionId: number): Promise<void> {
        return apiClient.post(`/admin/sessions/${sessionId}/complete`);
    },

    // Skill Management
    async getAllSkills(page = 1, limit = 10, search = '', category = ''): Promise<PaginatedResponse<Skill>> {
        return apiClient.get<PaginatedResponse<Skill>>(`/admin/skills?page=${page}&limit=${limit}&search=${search}&category=${category}`);
    },

    async createAdminSkill(data: Partial<Skill>): Promise<Skill> {
        return apiClient.post<Skill>('/admin/skills', data);
    },

    async updateAdminSkill(skillId: number, data: Partial<Skill>): Promise<Skill> {
        return apiClient.put<Skill>(`/admin/skills/${skillId}`, data);
    },

    async deleteAdminSkill(skillId: number): Promise<void> {
        return apiClient.delete(`/admin/skills/${skillId}`);
    },

    // Transaction Management
    async getAllTransactions(page = 1, limit = 10, search = '', type = ''): Promise<PaginatedResponse<Transaction>> {
        return apiClient.get<PaginatedResponse<Transaction>>(`/admin/transactions?page=${page}&limit=${limit}&search=${search}&type=${type}`);
    },

    // Badge Management
    async getAllBadges(): Promise<{ badges: Badge[]; total: number }> {
        return apiClient.get<{ badges: Badge[]; total: number }>('/admin/badges');
    },

    async deleteBadge(badgeId: number): Promise<void> {
        return apiClient.delete(`/admin/badges/${badgeId}`);
    },

    // Report Management
    async getAllReports(page = 1, limit = 10, search = '', status = ''): Promise<PaginatedResponse<any>> {
        return apiClient.get<PaginatedResponse<any>>(`/admin/reports?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    },

    async resolveReport(reportId: number, notes: string): Promise<void> {
        return apiClient.post(`/admin/reports/${reportId}/resolve`, { notes });
    },

    async dismissReport(reportId: number): Promise<void> {
        return apiClient.post(`/admin/reports/${reportId}/dismiss`);
    },

    // Community / Forum Management
    async getAllForumThreads(page = 1, limit = 10, search = ''): Promise<PaginatedResponse<ForumThread>> {
        return apiClient.get<PaginatedResponse<ForumThread>>(`/admin/forum/threads?page=${page}&limit=${limit}&search=${search}`);
    },
};
