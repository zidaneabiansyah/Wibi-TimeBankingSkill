import { create } from 'zustand';
import { userApi } from '@/lib/api/user';
import type {
    UserProfile,
    UserStats,
    UpdateProfileRequest,
    ChangePasswordRequest
} from '@/types';

interface UserStore {
    // Profile State
    profile: UserProfile | null;
    profileLoading: boolean;
    profileError: string | null;

    // Stats State
    stats: UserStats | null;
    statsLoading: boolean;
    statsError: string | null;

    // Actions - Profile
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: UpdateProfileRequest) => Promise<void>;
    changePassword: (passwordData: ChangePasswordRequest) => Promise<void>;
    updateAvatar: (avatarUrl: string) => Promise<void>;

    // Actions - Stats
    fetchStats: () => Promise<void>;

    // Actions - Public Profile
    fetchPublicProfile: (userId: number) => Promise<UserProfile | null>;
    fetchPublicProfileByUsername: (username: string) => Promise<UserProfile | null>;

    // Utility Actions
    clearErrors: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    // Initial State
    profile: null,
    profileLoading: false,
    profileError: null,

    stats: null,
    statsLoading: false,
    statsError: null,

    // Profile Actions
    fetchProfile: async () => {
        set({ profileLoading: true, profileError: null });

        try {
            const response = await userApi.getProfile();

            if (response.success && response.data) {
                set({
                    profile: response.data,
                    profileLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch profile');
            }
        } catch (error) {
            set({
                profileError: error instanceof Error ? error.message : 'Failed to fetch profile',
                profileLoading: false,
            });
        }
    },

    updateProfile: async (updates) => {
        set({ profileLoading: true, profileError: null });

        try {
            const response = await userApi.updateProfile(updates);

            if (response.success && response.data) {
                set({
                    profile: response.data,
                    profileLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (error) {
            set({
                profileError: error instanceof Error ? error.message : 'Failed to update profile',
                profileLoading: false,
            });
            throw error;
        }
    },

    changePassword: async (passwordData) => {
        try {
            const response = await userApi.changePassword(passwordData);

            if (!response.success) {
                throw new Error(response.message || 'Failed to change password');
            }
        } catch (error) {
            set({
                profileError: error instanceof Error ? error.message : 'Failed to change password',
            });
            throw error;
        }
    },

    updateAvatar: async (avatarUrl) => {
        try {
            const response = await userApi.updateAvatar(avatarUrl);

            if (response.success && response.data) {
                const { profile } = get();
                if (profile) {
                    set({
                        profile: {
                            ...profile,
                            avatar: response.data.avatar,
                        },
                    });
                }
            } else {
                throw new Error(response.message || 'Failed to update avatar');
            }
        } catch (error) {
            set({
                profileError: error instanceof Error ? error.message : 'Failed to update avatar',
            });
            throw error;
        }
    },

    // Stats Actions
    fetchStats: async () => {
        set({ statsLoading: true, statsError: null });

        try {
            const response = await userApi.getUserStats();

            if (response.success && response.data) {
                set({
                    stats: response.data,
                    statsLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch stats');
            }
        } catch (error) {
            set({
                statsError: error instanceof Error ? error.message : 'Failed to fetch stats',
                statsLoading: false,
            });
        }
    },

    // Public Profile Actions
    fetchPublicProfile: async (userId) => {
        try {
            const response = await userApi.getPublicProfile(userId);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch public profile');
            }
        } catch (error) {
            console.error('Failed to fetch public profile:', error);
            return null;
        }
    },

    fetchPublicProfileByUsername: async (username) => {
        try {
            const response = await userApi.getPublicProfileByUsername(username);

            if (response.success && response.data) {
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to fetch public profile');
            }
        } catch (error) {
            console.error('Failed to fetch public profile:', error);
            return null;
        }
    },

    // Utility Actions
    clearErrors: () => {
        set({
            profileError: null,
            statsError: null,
        });
    },
}));
