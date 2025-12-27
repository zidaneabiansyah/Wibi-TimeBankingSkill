import api from '../api';
import type { 
    ApiResponse, 
    UserAvailabilityResponse, 
    SetAvailabilityRequest 
} from '@/types';

/**
 * Availability Service - Handles all teacher availability related API calls
 */
export const availabilityService = {
    /**
     * Get the authenticated user's availability schedule
     */
    async getMyAvailability(): Promise<UserAvailabilityResponse> {
        const response = await api.get<ApiResponse<UserAvailabilityResponse>>('/user/availability');
        return response.data.data!;
    },

    /**
     * Set the authenticated user's availability schedule
     * Replaces existing slots with new ones
     */
    async setMyAvailability(data: SetAvailabilityRequest): Promise<UserAvailabilityResponse> {
        const response = await api.put<ApiResponse<UserAvailabilityResponse>>('/user/availability', data);
        return response.data.data!;
    },

    /**
     * Get another user's availability (public)
     */
    async getUserAvailability(userId: number): Promise<UserAvailabilityResponse> {
        const response = await api.get<ApiResponse<UserAvailabilityResponse>>(`/users/${userId}/availability`);
        return response.data.data!;
    },

    /**
     * Check if a user is available at a specific day and time
     */
    async checkAvailability(userId: number, day: number, time: string): Promise<boolean> {
        const response = await api.get<ApiResponse<{ is_available: boolean }>>(`/users/${userId}/availability/check`, {
            params: { day, time }
        });
        return response.data.data?.is_available || false;
    },

    /**
     * Clear all availability for the authenticated user
     */
    async clearMyAvailability(): Promise<void> {
        await api.delete('/user/availability');
    }
};

export default availabilityService;
