'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { toast } from 'sonner';

interface CreateThreadFormProps {
    categoryId: number;
    onSuccess?: () => void;
}

export function CreateThreadForm({ categoryId, onSuccess }: CreateThreadFormProps) {
    const { addThread } = useCommunityStore();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const tagArray = tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            const thread = await communityService.createThread(categoryId, title, content, tagArray);
            if (thread) {
                addThread(thread);
            }
            setTitle('');
            setContent('');
            setTags('');
            toast.success('Thread created successfully!');
            onSuccess?.();
        } catch (err) {
            toast.error('Failed to create thread');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter thread title..."
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your discussion here..."
                    rows={6}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. help, question, discussion"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Thread'}
            </Button>
        </form>
    );
}
