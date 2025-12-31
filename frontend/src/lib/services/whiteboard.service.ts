import api from '../api';
import type { Whiteboard } from '@/types';

/**
 * Whiteboard Service - Handles all whiteboard-related API calls
 * Includes getting, saving, and clearing whiteboard data
 */
export const whiteboardService = {
    // Get or create whiteboard for a session
    async getOrCreateWhiteboard(sessionId: number): Promise<Whiteboard> {
        const response = await api.get(`/sessions/${sessionId}/whiteboard`);
        return response.data.data;
    },

    // Save drawing data to whiteboard
    async saveDrawing(sessionId: number, drawingData: Record<string, any>): Promise<Whiteboard> {
        const response = await api.post(
            `/sessions/${sessionId}/whiteboard/save`,
            drawingData
        );
        return response.data.data;
    },

    // Clear whiteboard
    async clearWhiteboard(sessionId: number): Promise<void> {
        await api.post(`/sessions/${sessionId}/whiteboard/clear`);
    },

    // Delete whiteboard
    async deleteWhiteboard(sessionId: number): Promise<void> {
        await api.delete(`/sessions/${sessionId}/whiteboard`);
    },

    // Get whiteboard data
    async getWhiteboard(sessionId: number): Promise<Whiteboard> {
        const response = await api.get(`/sessions/${sessionId}/whiteboard/data`);
        return response.data.data;
    },
};
