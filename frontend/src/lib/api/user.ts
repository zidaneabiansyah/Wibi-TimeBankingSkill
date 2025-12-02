import api from '../api';
import type {
    UserProfile,
    UserStats,
    UpdateProfileRequest,
    ChangePasswordRequest,
    ApiResponse
} from '@/types';

export const userApi = {
    // Profile Management
    getProfile: async () => {
        const response = await api.get<ApiResponse<UserProfile>>('/user/profile');
        return response.data;
    },

    updateProfile: async (updates: UpdateProfileRequest) => {
        const response = await api.put<ApiResponse<UserProfile>>('/user/profile', updates);
        return response.data;
    },

    changePassword: async (passwordData: ChangePasswordRequest) => {
        const response = await api.post<ApiResponse<void>>('/user/change-password', passwordData);
        return response.data;
    },

    // User Stats
    getUserStats: async () => {
        const response = await api.get<ApiResponse<UserStats>>('/user/stats');
        return response.data;
    },

    // Avatar
    updateAvatar: async (avatarUrl: string) => {
        const response = await api.post<ApiResponse<{ avatar: string }>>('/user/avatar', {
            avatar: avatarUrl
        });
        return response.data;
    },

    // Public Profiles
    getPublicProfile: async (userId: number) => {
        const response = await api.get<ApiResponse<UserProfile>>(`/users/${userId}/profile`);
        return response.data;
    },

    getPublicProfileByUsername: async (username: string) => {
        const response = await api.get<ApiResponse<UserProfile>>(`/users/@${username}`);
        return response.data;
    }
};
