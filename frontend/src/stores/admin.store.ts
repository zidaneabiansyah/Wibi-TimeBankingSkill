import { create } from 'zustand';

export interface AdminProfile {
    id: number;
    email: string;
    full_name: string;
    role: string;
    is_active: boolean;
    last_login?: string;
    created_at: string;
}

export interface AdminLoginRequest {
    email: string;
    password: string;
}

interface AdminState {
    admin: AdminProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isHydrated: boolean;

    // Actions
    login: (data: AdminLoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    loadAdmin: () => void;
    clearError: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    admin: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isHydrated: false,

    // Login action
    login: async (data: AdminLoginRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const result = await response.json();

            // Save token and admin
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_token', result.data.token);
                localStorage.setItem('admin', JSON.stringify(result.data.admin));
            }

            set({
                admin: result.data.admin,
                token: result.data.token,
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

    // Logout action
    logout: async () => {
        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }).catch(() => {
                    // Ignore logout errors
                });
            }
        } catch (error) {
            // Ignore logout errors
        } finally {
            // Clear local storage and state
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin');
            }

            set({
                admin: null,
                token: null,
                isAuthenticated: false,
                error: null,
            });
        }
    },

    // Load admin from localStorage on app start
    loadAdmin: () => {
        if (typeof window === 'undefined') {
            set({ isHydrated: true });
            return;
        }

        const token = localStorage.getItem('admin_token');
        const adminStr = localStorage.getItem('admin');

        if (token && adminStr) {
            try {
                const admin = JSON.parse(adminStr);
                set({
                    admin,
                    token,
                    isAuthenticated: true,
                    isHydrated: true,
                });
            } catch {
                set({ isHydrated: true });
            }
        } else {
            set({ isHydrated: true });
        }
    },

    // Clear error
    clearError: () => {
        set({ error: null });
    },
}));
