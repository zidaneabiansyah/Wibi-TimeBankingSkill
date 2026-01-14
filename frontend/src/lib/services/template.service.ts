import { apiClient } from '@/lib/api';
import type { SessionTemplate, CreateTemplateRequest, ApiResponse } from '@/types';

export const templateService = {
    async createTemplate(data: CreateTemplateRequest): Promise<ApiResponse<SessionTemplate>> {
        return apiClient.post('/templates', data);
    },

    async getTemplates(): Promise<ApiResponse<SessionTemplate[]>> {
        return apiClient.get('/templates');
    },

    async updateTemplate(id: number, data: Partial<CreateTemplateRequest>): Promise<ApiResponse<SessionTemplate>> {
        return apiClient.put(`/templates/${id}`, data);
    },

    async deleteTemplate(id: number): Promise<ApiResponse> {
        return apiClient.delete(`/templates/${id}`);
    },
};
