'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { toast } from 'sonner';
import type { ForumCategory } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

export default function CreateThreadPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedCategoryId = searchParams.get('category');
    const { isAuthenticated } = useAuthStore();

    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        categoryId: preSelectedCategoryId ? parseInt(preSelectedCategoryId) : 0,
        title: '',
        content: '',
        tags: '',
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login?redirect=/community/forum/new');
            return;
        }
        fetchCategories();
    }, [isAuthenticated]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getCategories();
            setCategories(data);
            
            // If only one category exists or none selected, select first
            if (data.length > 0 && !formData.categoryId) {
                // setFormData(prev => ({ ...prev, categoryId: data[0].id }));
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            toast.error('Please select a category');
            return;
        }
        if (!formData.title.trim() || !formData.content.trim()) {
            toast.error('Please fill in title and content');
            return;
        }

        try {
            setSubmitting(true);
            const tagArray = formData.tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            const thread = await communityService.createThread(
                formData.categoryId,
                formData.title,
                formData.content,
                tagArray
            );
            
            if (!thread) {
                throw new Error('Failed to create thread: No data returned');
            }

            toast.success('Thread created successfully!');
            router.push(`/community/forum/thread/${thread.id}`);
        } catch (error) {
            console.error('Failed to create thread:', error);
            toast.error('Failed to create thread');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="w-full max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>

                <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
                    <h1 className="text-2xl font-bold mb-6">Start New Discussion</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <select
                                value={formData.categoryId}
                                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value={0} disabled>Select a category</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="What's on your mind?"
                                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Describe your topic in detail..."
                                rows={8}
                                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="e.g. question, help, announcement"
                                className="w-full p-3 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()} className="mr-4">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting || !formData.categoryId}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Create Thread'
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
