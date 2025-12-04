import { apiClient } from '@/lib/api';
import type { Review } from '@/types';

export interface CreateReviewRequest {
    session_id: number;
    rating: number;
    comment?: string;
    tags?: string;
    communication_rating?: number;
    punctuality_rating?: number;
    knowledge_rating?: number;
}

export interface UpdateReviewRequest {
    rating?: number;
    comment?: string;
    tags?: string;
    communication_rating?: number;
    punctuality_rating?: number;
    knowledge_rating?: number;
}

export interface ReviewListResponse {
    reviews: Review[];
    total: number;
    limit: number;
    offset: number;
}

export interface RatingSummary {
    average_rating: number;
    total_reviews: number;
    average_teacher_rating: number;
    teacher_review_count: number;
    average_student_rating: number;
    student_review_count: number;
}

/**
 * Review service for handling review-related API calls
 */
export const reviewService = {
    /**
     * Create a new review for a completed session
     */
    createReview: async (data: CreateReviewRequest): Promise<Review> => {
        return apiClient.post<Review>('/reviews', data);
    },

    /**
     * Get a specific review by ID
     */
    getReview: async (id: number): Promise<Review> => {
        return apiClient.get<Review>(`/reviews/${id}`);
    },

    /**
     * Get all reviews for a user
     */
    getUserReviews: async (
        userId: number,
        limit = 10,
        offset = 0
    ): Promise<ReviewListResponse> => {
        return apiClient.get<ReviewListResponse>(
            `/users/${userId}/reviews?limit=${limit}&offset=${offset}`
        );
    },

    /**
     * Get reviews for a user filtered by type (teacher/student)
     */
    getUserReviewsByType: async (
        userId: number,
        type: 'teacher' | 'student',
        limit = 10,
        offset = 0
    ): Promise<ReviewListResponse> => {
        return apiClient.get<ReviewListResponse>(
            `/users/${userId}/reviews/${type}?limit=${limit}&offset=${offset}`
        );
    },

    /**
     * Get rating summary for a user
     */
    getUserRatingSummary: async (userId: number): Promise<RatingSummary> => {
        return apiClient.get<RatingSummary>(`/users/${userId}/rating-summary`);
    },

    /**
     * Update a review
     */
    updateReview: async (id: number, data: UpdateReviewRequest): Promise<Review> => {
        return apiClient.put<Review>(`/reviews/${id}`, data);
    },

    /**
     * Delete a review
     */
    deleteReview: async (id: number): Promise<void> => {
        return apiClient.delete(`/reviews/${id}`);
    },

    /**
     * Format review type for display
     */
    formatReviewType: (type: string): string => {
        return type === 'teacher' ? 'Review as Teacher' : 'Review as Student';
    },

    /**
     * Get star rating display
     */
    getStarRating: (rating: number): string => {
        const stars = '⭐'.repeat(rating);
        return `${stars} ${rating}/5`;
    },

    /**
     * Format rating with color
     */
    getRatingColor: (rating: number): string => {
        if (rating >= 4.5) return 'text-green-600 dark:text-green-400';
        if (rating >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
        if (rating >= 2.5) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    },
};
