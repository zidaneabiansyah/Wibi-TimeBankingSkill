import { apiClient } from '@/lib/api/client';
import { VideoSessionResponse, StartVideoSessionRequest, EndVideoSessionRequest } from '@/types';

export const videoService = {
    // Start a video session
    async startVideoSession(sessionId: number, request: StartVideoSessionRequest): Promise<VideoSessionResponse> {
        const response = await apiClient.post(`/sessions/${sessionId}/video/start`, request);
        return response.data.data;
    },

    // Get video session status
    async getVideoSessionStatus(sessionId: number): Promise<VideoSessionResponse> {
        const response = await apiClient.get(`/sessions/${sessionId}/video/status`);
        return response.data.data;
    },

    // End a video session
    async endVideoSession(sessionId: number, request: EndVideoSessionRequest): Promise<VideoSessionResponse> {
        const response = await apiClient.post(`/sessions/${sessionId}/video/end`, request);
        return response.data.data;
    },

    // Get user's video call history
    async getVideoHistory(limit: number = 10, offset: number = 0): Promise<any> {
        const response = await apiClient.get(`/user/video-history?limit=${limit}&offset=${offset}`);
        return response.data.data;
    },

    // Get user's video statistics
    async getVideoStats(): Promise<any> {
        const response = await apiClient.get(`/user/video-stats`);
        return response.data.data;
    },
};
