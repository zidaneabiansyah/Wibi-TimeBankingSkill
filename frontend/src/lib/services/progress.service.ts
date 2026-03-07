import axios from 'axios';
import type { SkillProgress, ProgressSummary, ApiResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Progress Service - Handles all progress tracking API calls
 */
export const progressService = {
    /**
     * Get progress for a specific skill
     */
    async getProgress(skillId: number): Promise<SkillProgress> {
        try {
            const response = await axios.get<ApiResponse<SkillProgress>>(
                `${API_BASE}/user/skills/${skillId}/progress`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as SkillProgress);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Get all progress for current user
     */
    async getUserProgress(): Promise<ProgressSummary> {
        try {
            const response = await axios.get<ApiResponse<ProgressSummary>>(
                `${API_BASE}/user/progress/summary`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as ProgressSummary);
        } catch (error) {
            throw error;
        }
    },

    /**
     * Update progress for a skill
     */
    async updateProgress(
        skillId: number,
        sessionsCompleted: number,
        totalHoursSpent: number
    ): Promise<SkillProgress> {
        try {
            const response = await axios.put<ApiResponse<SkillProgress>>(
                `${API_BASE}/user/skills/${skillId}/progress`,
                {
                    sessions_completed: sessionsCompleted,
                    total_hours_spent: totalHoursSpent,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            return response.data.data || ({} as SkillProgress);
        } catch (error) {
            throw error;
        }
    },
};
