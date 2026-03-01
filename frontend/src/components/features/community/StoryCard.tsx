'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { SuccessStory } from '@/types';
import { Button } from '@/components/ui/button';

interface StoryCardProps {
    story: SuccessStory;
    onLike?: (storyId: number) => void;
    isLiked?: boolean;
}

export function StoryCard({ story, onLike, isLiked = false }: StoryCardProps) {
    return (
        <div className="group bg-[#0A0A0A] border border-white/5 rounded-[24px] p-6 transition-all flex flex-col h-full hover:border-white/10">
            {/* Content Area */}
            <div className="flex flex-col flex-1 min-w-0">
                
                {/* Author Info */}
                <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#5B21B6] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                        {story.user?.full_name ? (
                            <span className="text-white text-sm font-semibold tracking-wider">
                                {story.user.full_name.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase()}
                            </span>
                        ) : (
                            <span className="text-white text-sm font-semibold tracking-wider">AN</span>
                        )}
                    </div>
                    <div>
                        <p className="text-[15px] font-bold text-white leading-tight mb-0.5">
                            {story.user?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-[13px] font-medium text-stone-500">
                            {new Date(story.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Title */}
                <Link href={`/community/stories/${story.id}`} className="mb-2 block">
                    <h3 className="font-bold text-[20px] leading-tight text-white group-hover:text-primary transition-colors tracking-tight">
                        {story.title}
                    </h3>
                </Link>

                {/* Description */}
                <p className="text-[15px] text-stone-400 mb-5 leading-relaxed font-medium">
                    {story.description}
                </p>

                {/* Tags */}
                <div className="mb-6">
                    {story.tags && story.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                            {story.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[13px] font-semibold text-white hover:bg-white/10 hover:border-white/20 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Image Preview (Now placed below text like a standard social post) */}
                {(story.featured_image_url || (story.images && story.images.length > 0)) && (
                    <div className="relative h-[280px] sm:h-[360px] w-full rounded-2xl overflow-hidden mb-6 bg-white/5 border border-white/5 shrink-0">
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
                <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={(e) => { e.preventDefault(); onLike?.(story.id); }}
                            className="flex items-center gap-2 text-rose-500 font-bold text-[14px] hover:text-rose-400 transition-colors"
                        >
                            <Heart className={`w-4 h-4 stroke-[2.5] ${isLiked ? 'fill-current' : ''}`} />
                            <span>{story.like_count || 0}</span>
                        </button>
                        <div className="flex items-center gap-1.5 text-stone-400 text-[14px] font-bold">
                            <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                            <span>{story.comment_count || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
