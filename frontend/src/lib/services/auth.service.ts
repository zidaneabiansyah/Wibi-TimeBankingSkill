import { apiClient } from '../api';
import type { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '@/types';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  // Login user
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  // Logout user
  logout: async (): Promise<void> => {
    return apiClient.post<void>('/auth/logout');
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    return apiClient.get<UserProfile>('/auth/profile');
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    return apiClient.put<UserProfile>('/user/profile', data);
  },

  // Check username availability
  checkUsernameAvailability: async (username: string): Promise<{ available: boolean }> => {
    try {
      // Make request to check username
      const response = await apiClient.get<{ available: boolean }>(`/auth/check-username/${username}`);
      return response;
    } catch (error: any) {
      // If endpoint doesn't exist, assume available (fallback)
      return { available: true };
    }
  },

  // Request email verification
  requestEmailVerification: async (email: string): Promise<void> => {
    try {
      await apiClient.post('/auth/verify-email/request', { email });
    } catch (error: any) {
      // Silently fail if endpoint doesn't exist
    }
  },

  // Verify email with code
  verifyEmailCode: async (email: string, token: string): Promise<void> => {
    try {
      // Token-based verification (used when user clicks email link)
      // Token is passed as query param to /verify-email?token=ABC
      // We call the API endpoint with the token
      if (token) {
        await apiClient.get(`/auth/verify-email?token=${token}`);
      } else {
        // Fallback for code-based verification (if needed)
        await apiClient.post('/auth/verify-email/confirm', { email, code: token });
      }
    } catch (error: any) {
      throw error;
    }
  },

  // Request password reset email
  forgotPassword: async (email: string): Promise<void> => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token: string, newPassword: string, confirmPassword: string): Promise<void> => {
    return apiClient.post('/auth/reset-password', {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  },

  // Save token to localStorage
  saveToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      console.log('✅ Token saved:', token.substring(0, 20) + '...');
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = localStorage.getItem('token');
    if (token) {
      console.log('✅ Token retrieved:', token.substring(0, 20) + '...');
    }
    return token;
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('✅ Token removed');
    }
  },

  // Save user to localStorage
  saveUser: (user: UserProfile): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('✅ User saved:', user.username);
    }
  },

  // Get user from localStorage
  getUser: (): UserProfile | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    const user = localStorage.getItem('user');
    if (user) {
      console.log('✅ User retrieved');
      return JSON.parse(user);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },
};
