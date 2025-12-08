import axios from 'axios';
import type { Whiteboard } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Whiteboard Service - Handles all whiteboard-related API calls
 * Includes getting, saving, and clearing whiteboard data
 */
export const whiteboardService = {
    // Get or create whiteboard for a session
    async getOrCreateWhiteboard(sessionId: number): Promise<Whiteboard> {
        const response = await axios.get(`${API_BASE}/sessions/${sessionId}/whiteboard`);
        return response.data.data;
    },

    // Save drawing data to whiteboard
    async saveDrawing(sessionId: number, drawingData: Record<string, any>): Promise<Whiteboard> {
        const response = await axios.post(
            `${API_BASE}/sessions/${sessionId}/whiteboard/save`,
            drawingData
        );
        return response.data.data;
    },

    // Clear whiteboard
    async clearWhiteboard(sessionId: number): Promise<void> {
        await axios.post(`${API_BASE}/sessions/${sessionId}/whiteboard/clear`);
    },

    // Delete whiteboard
    async deleteWhiteboard(sessionId: number): Promise<void> {
        await axios.delete(`${API_BASE}/sessions/${sessionId}/whiteboard`);
    },

    // Get whiteboard data
    async getWhiteboard(sessionId: number): Promise<Whiteboard> {
        const response = await axios.get(`${API_BASE}/sessions/${sessionId}/whiteboard/data`);
        return response.data.data;
    },
};
