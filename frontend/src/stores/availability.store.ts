import { create } from 'zustand';
import { availabilityService } from '@/lib/services';
import type { 
    AvailabilitySlot, 
    SetAvailabilityRequest, 
    UserAvailabilityResponse 
} from '@/types';

interface AvailabilityState {
    // State
    myAvailability: AvailabilitySlot[];
    userAvailability: Record<number, AvailabilitySlot[]>; // Cache for other users
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchMyAvailability: () => Promise<void>;
    setMyAvailability: (data: SetAvailabilityRequest) => Promise<void>;
    fetchUserAvailability: (userId: number) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    myAvailability: [],
    userAvailability: {},
    isLoading: false,
    error: null,
};

/**
 * Availability Store - Zustand store for teacher availability management
 */
export const useAvailabilityStore = create<AvailabilityState>((set, get) => ({
    ...initialState,

    fetchMyAvailability: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await availabilityService.getMyAvailability();
            set({ 
                myAvailability: response.availability, 
                isLoading: false 
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch availability';
            set({ error: errorMessage, isLoading: false });
        }
    },

    setMyAvailability: async (data: SetAvailabilityRequest) => {
        set({ isLoading: true, error: null });
        try {
            const response = await availabilityService.setMyAvailability(data);
            set({ 
                myAvailability: response.availability, 
                isLoading: false 
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update availability';
            set({ error: errorMessage, isLoading: false });
            throw error;
        }
    },

    fetchUserAvailability: async (userId: number) => {
        // Only fetch if not already in cache or to refresh
        set({ isLoading: true, error: null });
        try {
            const response = await availabilityService.getUserAvailability(userId);
            set((state) => ({
                userAvailability: {
                    ...state.userAvailability,
                    [userId]: response.availability,
                },
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user availability';
            set({ error: errorMessage, isLoading: false });
        }
    },

    clearError: () => set({ error: null }),
    
    reset: () => set(initialState),
}));

export default useAvailabilityStore;
