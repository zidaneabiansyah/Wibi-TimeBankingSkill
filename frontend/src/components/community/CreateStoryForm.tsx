'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { toast } from 'sonner';

interface CreateStoryFormProps {
    onSuccess?: () => void;
}

export function CreateStoryForm({ onSuccess }: CreateStoryFormProps) {
    const { addStory } = useCommunityStore();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [featuredImageURL, setFeaturedImageURL] = useState('');
    const [tags, setTags] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        try {
            setLoading(true);
            const tagArray = tags
                .split(',')
                .map((t) => t.trim())
                .filter((t) => t);

            const story = await communityService.createStory(title, description, featuredImageURL, [], tagArray, isPublished);
            addStory(story);
            setTitle('');
            setDescription('');
            setFeaturedImageURL('');
            setTags('');
            setIsPublished(false);
            toast.success('Story created successfully!');
            onSuccess?.();
        } catch (err) {
            toast.error('Failed to create story');
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
                    placeholder="Enter story title..."
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell your success story..."
                    rows={6}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL (Optional)</label>
                <input
                    type="url"
                    value={featuredImageURL}
                    onChange={(e) => setFeaturedImageURL(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g. achievement, learning, success"
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-border"
                />
                <label htmlFor="published" className="text-sm font-medium">
                    Publish immediately
                </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating...' : 'Create Story'}
            </Button>
        </form>
    );
}
