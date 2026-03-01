'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { SuccessStory } from '@/types';
import { communityService } from '@/lib/services/community.service';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

interface StoryCardProps {
    story: SuccessStory;
    onLike?: (storyId: number, liked: boolean, count: number) => void;
    isLiked?: boolean;
}

export function StoryCard({ story, onLike, isLiked: externalIsLiked = false }: StoryCardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [hasLiked, setHasLiked] = useState(externalIsLiked);
    const [likeCount, setLikeCount] = useState(story.like_count || 0);
    const [loadingLike, setLoadingLike] = useState(false);

    useEffect(() => {
        const checkLike = async () => {
            try {
                const data = await communityService.checkStoryLike(story.id);
                setHasLiked(data.liked);
                setLikeCount(data.count);
            } catch (err) {
                console.error("Failed to check story like:", err);
            }
        };
        checkLike();
    }, [story.id]);

    const handleToggleLike = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error('Please login to like stories');
            router.push('/login');
            return;
        }
        
        // Optimistic update
        const prevLiked = hasLiked;
        const prevCount = likeCount;
        setHasLiked(!prevLiked);
        setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

        try {
            setLoadingLike(true);
            const data = await communityService.toggleStoryLike(story.id);
            setHasLiked(data.liked);
            setLikeCount(data.count);
            if (onLike) onLike(story.id, data.liked, data.count);
        } catch (err) {
            setHasLiked(prevLiked);
            setLikeCount(prevCount);
            toast.error('Failed to update like status');
        } finally {
            setLoadingLike(false);
        }
    };

    return (
        <div className="group bg-card border border-border rounded-[24px] p-6 transition-all flex flex-col h-full hover:border-primary/20">
            {/* Content Area */}
            <div className="flex flex-col flex-1 min-w-0">
                
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {story.user?.full_name ? (
                            <span className="text-primary-foreground text-sm font-semibold tracking-wider">
                                {story.user.full_name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                            </span>
                        ) : (
                            <span className="text-primary-foreground text-sm font-semibold tracking-wider">AN</span>
                        )}
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-foreground leading-tight mb-0.5">
                            {story.user?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-[13px] font-medium text-muted-foreground">
                            {new Date(story.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/community/stories/${story.id}`} className="mb-2 block">
                    <h3 className="font-bold text-[20px] leading-tight text-foreground group-hover:text-primary transition-colors tracking-tight">
                        {story.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-[15px] text-muted-foreground mb-5 leading-relaxed font-medium">
                    {story.description}
                </p>

                {/* Tags */}
                <div className="mb-6">
                    {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                            {story.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 bg-muted border border-border rounded-full text-[13px] font-semibold text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Image Preview (Now placed below text like a standard social post) */}
                {(story.featured_image_url || (story.images && story.images.length > 0)) && (
                    <div className="relative h-[280px] sm:h-[360px] w-full rounded-2xl overflow-hidden mb-6 bg-muted border border-border shrink-0">
                        <Image
                            src={story.featured_image_url || (story.images?.[0] ?? '')}
                            alt={story.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}

                {/* Stats and Actions */}
                <div className="flex items-center justify-between pt-5 border-t border-border mt-auto">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={handleToggleLike}
                            disabled={loadingLike}
                            className={`flex items-center gap-2 font-bold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                hasLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Heart className={`w-4 h-4 transition-transform duration-300 ${hasLiked ? 'fill-rose-500 stroke-rose-500 scale-110' : 'stroke-[2.5]'}`} />
                            <span>{likeCount}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-muted-foreground text-[14px] font-bold">
                            <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>{story.comment_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
