import { apiClient } from '@/lib/api';
import type { Favorite, ApiResponse } from '@/types';

export const favoriteService = {
    async addFavorite(teacherId: number): Promise<ApiResponse> {
        return apiClient.post('/favorites', { teacher_id: teacherId });
    },

    async removeFavorite(teacherId: number): Promise<ApiResponse> {
        return apiClient.delete(`/favorites/${teacherId}`);
    },

    async getFavorites(limit = 10, offset = 0): Promise<ApiResponse<{ favorites: Favorite[]; total: number }>> {
        return apiClient.get(`/favorites?limit=${limit}&offset=${offset}`);
    },

    async checkFavorite(teacherId: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
        return apiClient.get(`/favorites/check/${teacherId}`);
    },
};
