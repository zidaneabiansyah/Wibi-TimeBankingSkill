import api from '../api';
import type {
    Skill,
    SkillListResponse,
    UserSkill,
    LearningSkill,
    CreateUserSkillRequest,
    UpdateUserSkillRequest,
    CreateLearningSkillRequest,
    ApiResponse
} from '@/types';

export const skillsApi = {
    // Public Skills
    getSkills: async (params: {
        page?: number;
        limit?: number;
        category?: string;
        search?: string;
    } = {}) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', params.page.toString());
        if (params.limit) searchParams.set('limit', params.limit.toString());
        if (params.category) searchParams.set('category', params.category);
        if (params.search) searchParams.set('search', params.search);

        const response = await api.get<ApiResponse<SkillListResponse>>(
            `/skills?${searchParams.toString()}`
        );
        return response.data;
    },

    getSkillById: async (id: number) => {
        const response = await api.get<ApiResponse<Skill>>(`/skills/${id}`);
        return response.data;
    },

    // User Skills (Teaching)
    getUserSkills: async () => {
        const response = await api.get<ApiResponse<UserSkill[]>>('/user/skills');
        return response.data;
    },

    addUserSkill: async (skillData: CreateUserSkillRequest) => {
        const response = await api.post<ApiResponse<UserSkill>>('/user/skills', skillData);
        return response.data;
    },

    updateUserSkill: async (skillId: number, updates: UpdateUserSkillRequest) => {
        const response = await api.put<ApiResponse<UserSkill>>(
            `/user/skills/${skillId}`,
            updates
        );
        return response.data;
    },

    deleteUserSkill: async (skillId: number) => {
        const response = await api.delete<ApiResponse<void>>(`/user/skills/${skillId}`);
        return response.data;
    },

    // Learning Skills (Wishlist)
    getLearningSkills: async () => {
        const response = await api.get<ApiResponse<LearningSkill[]>>('/user/learning-skills');
        return response.data;
    },

    addLearningSkill: async (skillData: CreateLearningSkillRequest) => {
        const response = await api.post<ApiResponse<LearningSkill>>(
            '/user/learning-skills',
            skillData
        );
        return response.data;
    },

    deleteLearningSkill: async (skillId: number) => {
        const response = await api.delete<ApiResponse<void>>(
            `/user/learning-skills/${skillId}`
        );
        return response.data;
    },

    // Admin Skills (for future use)
    createSkill: async (skillData: { name: string; category: string; description?: string; icon?: string }) => {
        const response = await api.post<ApiResponse<Skill>>('/admin/skills', skillData);
        return response.data;
    },

    updateSkill: async (id: number, updates: Partial<Skill>) => {
        const response = await api.put<ApiResponse<Skill>>(`/admin/skills/${id}`, updates);
        return response.data;
    },

    deleteSkill: async (id: number) => {
        const response = await api.delete<ApiResponse<void>>(`/admin/skills/${id}`);
        return response.data;
    }
};
