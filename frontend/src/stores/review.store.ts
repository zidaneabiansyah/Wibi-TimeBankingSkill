import { create } from 'zustand';
import { reviewService } from '@/lib/services';
import type { Review, RatingSummary } from '@/types';

interface ReviewState {
    // State
    reviews: Review[];
    userReviews: Review[];
    currentReview: Review | null;
    ratingSummary: RatingSummary | null;
    total: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    createReview: (data: any) => Promise<Review>;
    fetchUserReviews: (userId: number, limit?: number, offset?: number) => Promise<void>;
    fetchUserReviewsByType: (userId: number, type: 'teacher' | 'student', limit?: number, offset?: number) => Promise<void>;
    fetchUserRatingSummary: (userId: number) => Promise<void>;
    fetchReview: (id: number) => Promise<void>;
    updateReview: (id: number, data: any) => Promise<Review>;
    deleteReview: (id: number) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    reviews: [],
    userReviews: [],
    currentReview: null,
    ratingSummary: null,
    total: 0,
    isLoading: false,
    error: null,
};

/**
 * Review store for managing review state
 */
export const useReviewStore = create<ReviewState>((set) => ({
    ...initialState,

    /**
     * Create a new review
     */
    createReview: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const review = await reviewService.createReview(data);
            set({ isLoading: false });
            return review;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to create review';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Fetch all reviews for a user
     */
    fetchUserReviews: async (userId, limit = 10, offset = 0) => {
        set({ isLoading: true, error: null });
        try {
            const response = await reviewService.getUserReviews(userId, limit, offset);
            set({
                userReviews: response.reviews,
                total: response.total,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to fetch reviews';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Fetch reviews for a user filtered by type
     */
    fetchUserReviewsByType: async (userId, type, limit = 10, offset = 0) => {
        set({ isLoading: true, error: null });
        try {
            const response = await reviewService.getUserReviewsByType(userId, type, limit, offset);
            set({
                userReviews: response.reviews,
                total: response.total,
                isLoading: false,
            });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to fetch reviews';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Fetch rating summary for a user
     */
    fetchUserRatingSummary: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const summary = await reviewService.getUserRatingSummary(userId);
            set({ ratingSummary: summary, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to fetch rating summary';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Fetch a specific review
     */
    fetchReview: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const review = await reviewService.getReview(id);
            set({ currentReview: review, isLoading: false });
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to fetch review';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Update a review
     */
    updateReview: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const review = await reviewService.updateReview(id, data);
            set((state) => ({
                userReviews: state.userReviews.map((r) => (r.id === id ? review : r)),
                currentReview: state.currentReview?.id === id ? review : state.currentReview,
                isLoading: false,
            }));
            return review;
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to update review';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Delete a review
     */
    deleteReview: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await reviewService.deleteReview(id);
            set((state) => ({
                userReviews: state.userReviews.filter((r) => r.id !== id),
                currentReview: state.currentReview?.id === id ? null : state.currentReview,
                isLoading: false,
            }));
        } catch (error: any) {
            const errorMessage = error.message || 'Failed to delete review';
            set({ isLoading: false, error: errorMessage });
            throw error;
        }
    },

    /**
     * Clear error message
     */
    clearError: () => set({ error: null }),

    /**
     * Reset to initial state
     */
    reset: () => set(initialState),
}));

export default useReviewStore;
