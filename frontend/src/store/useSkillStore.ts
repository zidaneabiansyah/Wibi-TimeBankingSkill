import { create } from 'zustand';
import { skillsApi } from '@/lib/api/skills';
import type {
    Skill,
    SkillListResponse,
    UserSkill,
    LearningSkill,
    CreateUserSkillRequest,
    UpdateUserSkillRequest,
    CreateLearningSkillRequest,
    SkillCategory
} from '@/types';

interface SkillStore {
    // Skills State
    skills: Skill[];
    skillsLoading: boolean;
    skillsError: string | null;
    skillsTotal: number;
    skillsPage: number;
    skillsLimit: number;

    // User Skills State
    userSkills: UserSkill[];
    userSkillsLoading: boolean;
    userSkillsError: string | null;

    // Learning Skills State
    learningSkills: LearningSkill[];
    learningSkillsLoading: boolean;
    learningSkillsError: string | null;

    // Filters & Search
    filters: {
        category?: SkillCategory;
        search?: string;
    };

    // Actions - Skills
    fetchSkills: (params?: {
        page?: number;
        limit?: number;
        category?: SkillCategory;
        search?: string;
    }) => Promise<void>;
    setFilters: (filters: { category?: SkillCategory; search?: string }) => void;
    clearFilters: () => void;

    // Actions - User Skills
    fetchUserSkills: () => Promise<void>;
    addUserSkill: (skillData: CreateUserSkillRequest) => Promise<void>;
    updateUserSkill: (skillId: number, updates: UpdateUserSkillRequest) => Promise<void>;
    deleteUserSkill: (skillId: number) => Promise<void>;

    // Actions - Learning Skills
    fetchLearningSkills: () => Promise<void>;
    addLearningSkill: (skillData: CreateLearningSkillRequest) => Promise<void>;
    deleteLearningSkill: (skillId: number) => Promise<void>;
}

export const useSkillStore = create<SkillStore>((set, get) => ({
    // Initial State
    skills: [],
    skillsLoading: false,
    skillsError: null,
    skillsTotal: 0,
    skillsPage: 1,
    skillsLimit: 10,

    userSkills: [],
    userSkillsLoading: false,
    userSkillsError: null,

    learningSkills: [],
    learningSkillsLoading: false,
    learningSkillsError: null,

    filters: {},

    // Skills Actions
    fetchSkills: async (params = {}) => {
        set({ skillsLoading: true, skillsError: null });

        try {
            const { filters } = get();
            const queryParams = {
                page: params.page || get().skillsPage,
                limit: params.limit || get().skillsLimit,
                category: params.category || filters.category,
                search: params.search || filters.search,
            };

            const response = await skillsApi.getSkills(queryParams);

            if (response.success && response.data) {
                set({
                    skills: response.data.skills,
                    skillsTotal: response.data.total,
                    skillsPage: response.data.page,
                    skillsLimit: response.data.limit,
                    skillsLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch skills');
            }
        } catch (error) {
            set({
                skillsError: error instanceof Error ? error.message : 'Failed to fetch skills',
                skillsLoading: false,
            });
        }
    },

    setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
        // Auto-fetch with new filters
        get().fetchSkills();
    },

    clearFilters: () => {
        set({ filters: {} });
        get().fetchSkills();
    },

    // User Skills Actions
    fetchUserSkills: async () => {
        set({ userSkillsLoading: true, userSkillsError: null });

        try {
            const response = await skillsApi.getUserSkills();

            if (response.success && response.data) {
                set({
                    userSkills: response.data,
                    userSkillsLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch user skills');
            }
        } catch (error) {
            set({
                userSkillsError: error instanceof Error ? error.message : 'Failed to fetch user skills',
                userSkillsLoading: false,
            });
        }
    },

    addUserSkill: async (skillData) => {
        try {
            const response = await skillsApi.addUserSkill(skillData);

            if (response.success && response.data) {
                set({
                    userSkills: [...get().userSkills, response.data],
                });
            } else {
                throw new Error(response.message || 'Failed to add skill');
            }
        } catch (error) {
            set({
                userSkillsError: error instanceof Error ? error.message : 'Failed to add skill',
            });
            throw error;
        }
    },

    updateUserSkill: async (skillId, updates) => {
        try {
            const response = await skillsApi.updateUserSkill(skillId, updates);

            if (response.success && response.data) {
                set({
                    userSkills: get().userSkills.map(skill =>
                        skill.skill_id === skillId ? response.data! : skill
                    ),
                });
            } else {
                throw new Error(response.message || 'Failed to update skill');
            }
        } catch (error) {
            set({
                userSkillsError: error instanceof Error ? error.message : 'Failed to update skill',
            });
            throw error;
        }
    },

    deleteUserSkill: async (skillId) => {
        try {
            const response = await skillsApi.deleteUserSkill(skillId);

            if (response.success) {
                set({
                    userSkills: get().userSkills.filter(skill => skill.skill_id !== skillId),
                });
            } else {
                throw new Error(response.message || 'Failed to delete skill');
            }
        } catch (error) {
            set({
                userSkillsError: error instanceof Error ? error.message : 'Failed to delete skill',
            });
            throw error;
        }
    },

    // Learning Skills Actions
    fetchLearningSkills: async () => {
        set({ learningSkillsLoading: true, learningSkillsError: null });

        try {
            const response = await skillsApi.getLearningSkills();

            if (response.success && response.data) {
                set({
                    learningSkills: response.data,
                    learningSkillsLoading: false,
                });
            } else {
                throw new Error(response.message || 'Failed to fetch learning skills');
            }
        } catch (error) {
            set({
                learningSkillsError: error instanceof Error ? error.message : 'Failed to fetch learning skills',
                learningSkillsLoading: false,
            });
        }
    },

    addLearningSkill: async (skillData) => {
        try {
            const response = await skillsApi.addLearningSkill(skillData);

            if (response.success && response.data) {
                set({
                    learningSkills: [...get().learningSkills, response.data],
                });
            } else {
                throw new Error(response.message || 'Failed to add learning skill');
            }
        } catch (error) {
            set({
                learningSkillsError: error instanceof Error ? error.message : 'Failed to add learning skill',
            });
            throw error;
        }
    },

    deleteLearningSkill: async (skillId) => {
        try {
            const response = await skillsApi.deleteLearningSkill(skillId);

            if (response.success) {
                set({
                    learningSkills: get().learningSkills.filter(skill => skill.skill_id !== skillId),
                });
            } else {
                throw new Error(response.message || 'Failed to delete learning skill');
            }
        } catch (error) {
            set({
                learningSkillsError: error instanceof Error ? error.message : 'Failed to delete learning skill',
            });
            throw error;
        }
    },
}));
