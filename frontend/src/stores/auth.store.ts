import { create } from 'zustand';
import { authService } from '@/lib/services/auth.service';
import type { UserProfile, LoginRequest, RegisterRequest } from '@/types';

interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isHydrated: boolean;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isHydrated: false,

    // Login action
    login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.login(data);

            // Save token and user
            authService.saveToken(response.token);
            authService.saveUser(response.user);

            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || 'Login failed',
            });
            throw error;
        }
    },

    // Register action
    register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authService.register(data);

            // Save email for verification page
            localStorage.setItem('registrationEmail', data.email);

            // Only save token and user if registration returned a token (email already verified)
            if (response.token) {
                authService.saveToken(response.token);
                authService.saveUser(response.user);

                set({
                    user: response.user,
                    token: response.token,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            } else {
                // Registration successful but email verification pending
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.message || 'Registration failed',
            });
            throw error;
        }
    },

    // Logout action
    logout: async () => {
        try {
            await authService.logout();
        } catch (error) {
            // Ignore logout errors
        } finally {
            // Clear local storage and state
            authService.removeToken();

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            });
        }
    },

    // Load user from localStorage on app start
    loadUser: () => {
        const token = authService.getToken();
        const user = authService.getUser();

        if (token && user) {
            set({
                user,
                token,
                isAuthenticated: true,
                isHydrated: true,
            });
        } else {
            set({ isHydrated: true });
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
