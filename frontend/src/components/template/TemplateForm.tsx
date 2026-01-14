'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTemplateStore, useSkillStore } from '@/stores';
import type { SessionTemplate } from '@/types';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    user_skill_id: z.string().min(1, 'Please select a skill'),
    duration: z.coerce.number().min(0.5, 'Minimum duration is 0.5 hours').max(5, 'Maximum duration is 5 hours'),
    mode: z.string().min(1, 'Please select a mode'),
    location: z.string().optional(),
    meeting_link: z.string().url('Invalid URL').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
    template?: SessionTemplate;
    onSuccess?: () => void;
}

export function TemplateForm({ template, onSuccess }: TemplateFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { createTemplate, updateTemplate } = useTemplateStore();
    const { userSkills } = useSkillStore();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: template?.title || '',
            description: template?.description || '',
            user_skill_id: template?.user_skill_id?.toString() || '',
            duration: template?.duration || 1,
            mode: template?.mode || 'online',
            location: template?.location || '',
            meeting_link: template?.meeting_link || '',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            const data: any = {
                ...values,
                user_skill_id: parseInt(values.user_skill_id),
            };

            if (template) {
                await updateTemplate(template.id, data);
            } else {
                await createTemplate(data);
            }
            onSuccess?.();
            if (!template) form.reset();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control as any}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Template Title</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Mathematics Tutoring - Introduction" {...field} />
                            </FormControl>
                            <FormDescription>A catchy name for this session configuration.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control as any}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Describe what this session covers..." 
                                    className="min-h-[120px] resize-none"
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control as any}
                        name="user_skill_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Teaching Skill</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a skill" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {userSkills?.map((skill) => (
                                            <SelectItem key={skill.id} value={skill.id.toString()}>
                                                {skill.skill?.name || 'Unknown Skill'}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration (Hours)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.5" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control as any}
                        name="mode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mode</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a mode" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                        <SelectItem value="hybrid">Hybrid</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control as any}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location / Meeting Link</FormLabel>
                                <FormControl>
                                    <Input placeholder="Physical address or URL" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {template ? 'Update Template' : 'Create Template'}
                </Button>
            </form>
        </Form>
    );
}
