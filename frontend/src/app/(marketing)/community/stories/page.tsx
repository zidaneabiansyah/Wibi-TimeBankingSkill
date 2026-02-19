'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/features/community';
import { communityService } from '@/lib/services/community.service';
import { useAuthStore } from '@/stores/auth.store';
import type { SuccessStory } from '@/types';
import { toast } from 'sonner';

export default function StoriesPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [stories, setStories] = useState<SuccessStory[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);
    const limit = 12;

    useEffect(() => {
        fetchStories();
    }, [offset]);

    const fetchStories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getPublishedStories(limit, offset);
            setStories(data.stories);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to fetch stories:', error);
            toast.error('Failed to load success stories');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (storyId: number) => {
        if (!isAuthenticated) {
            toast.error('Please login to like stories');
            router.push('/login');
            return;
        }

        try {
            await communityService.likeStory(storyId);
            // Update local state
            setStories(
                stories.map((s) =>
                    s.id === storyId ? { ...s, like_count: s.like_count + 1 } : s
                )
            );
            toast.success('Story liked!');
        } catch (error) {
            console.error('Failed to like story:', error);
            toast.error('Failed to like story');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Main Container */}
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="py-12 md:py-16 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-purple-500/10">
                                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Success Stories
                            </h1>
                        </div>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Discover inspiring stories from our community members. Learn how others have grown and succeeded through time banking.
                        </p>
                    </div>
                    
                    {/* CTA Button - Only show once */}
                    {isAuthenticated && (
                        <div>
                            <Button 
                                onClick={() => router.push('/community/stories/new')}
                                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Share Your Story
                            </Button>
                        </div>
                    )}
                </div>

                {/* Stories Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
                        <p className="text-muted-foreground">Loading success stories...</p>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                            <BookOpen className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Stories Yet</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            {isAuthenticated 
                                ? "Be the first to share your success story! Your journey can inspire others in our community."
                                : "Login to share your success story and inspire others in our community."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8 mb-8">
                            {stories.map((story) => (
                                <StoryCard
                                    key={story.id}
                                    story={story}
                                    onLike={handleLike}
                                    isLiked={false}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > limit && (
                            <div className="flex items-center justify-center gap-4 py-8 border-t border-border">
                                <Button
                                    variant="outline"
                                    disabled={offset === 0}
                                    onClick={() => setOffset(Math.max(0, offset - limit))}
                                >
                                    ← Previous
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    {offset + 1} - {Math.min(offset + limit, total)} of {total}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={offset + limit >= total}
                                    onClick={() => setOffset(offset + limit)}
                                >
                                    Next →
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
