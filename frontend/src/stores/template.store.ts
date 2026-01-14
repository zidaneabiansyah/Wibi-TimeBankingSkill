import { create } from 'zustand';
import { templateService } from '@/lib/services/template.service';
import type { SessionTemplate, CreateTemplateRequest } from '@/types';
import { toast } from 'sonner';

interface TemplateState {
    templates: SessionTemplate[];
    isLoading: boolean;
    error: string | null;

    fetchTemplates: () => Promise<void>;
    createTemplate: (data: CreateTemplateRequest) => Promise<void>;
    updateTemplate: (id: number, data: Partial<CreateTemplateRequest>) => Promise<void>;
    deleteTemplate: (id: number) => Promise<void>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
    templates: [],
    isLoading: false,
    error: null,

    fetchTemplates: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await templateService.getTemplates();
            if (response.success) {
                set({ templates: response.data || [] });
            } else {
                set({ error: response.message });
            }
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch templates' });
        } finally {
            set({ isLoading: false });
        }
    },

    createTemplate: async (data: CreateTemplateRequest) => {
        try {
            const response = await templateService.createTemplate(data);
            if (response.success && response.data) {
                set({ templates: [response.data, ...get().templates] });
                toast.success('Template created successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create template');
        }
    },

    updateTemplate: async (id: number, data: Partial<CreateTemplateRequest>) => {
        try {
            const response = await templateService.updateTemplate(id, data);
            if (response.success && response.data) {
                set({ 
                    templates: get().templates.map(t => t.id === id ? response.data! : t) 
                });
                toast.success('Template updated successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to update template');
        }
    },

    deleteTemplate: async (id: number) => {
        try {
            const response = await templateService.deleteTemplate(id);
            if (response.success) {
                set({ templates: get().templates.filter(t => t.id !== id) });
                toast.success('Template deleted successfully');
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to delete template');
        }
    },
}));
