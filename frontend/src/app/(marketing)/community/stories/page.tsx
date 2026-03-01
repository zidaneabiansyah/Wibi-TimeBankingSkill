'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'older'>('latest');
    const limit = 10;
    
    const POPULAR_TAGS = ['Inspiration', 'SkillShare', 'Community', 'Journey', 'Learning', 'Growth', 'Success'];

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

    const handleLike = async (storyId: number, liked: boolean, count: number) => {
        // Auth check is now handled in StoryCard, but we keep the redirect logic here as a fallback
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Update local state based on data from child
        setStories(
            stories.map((s) =>
                s.id === storyId ? { ...s, like_count: count } : s
            )
        );
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Future implementation for search
            toast.info('Search feature coming soon');
        }
    };

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {/* Main Container */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
                
                {/* Breadcrumb / Status area */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium tracking-wide text-muted-foreground uppercase">
                        <Link href="/community" className="hover:text-primary transition-colors">Success Stories</Link>
                        {activeTab && (
                            <>
                                <span className="mx-2 text-border">/</span>
                                <span className="text-foreground">{activeTab}</span>
                            </>
                        )}
                    </div>
                </div>

                {/* 3-Column Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* ===== LEFT SIDEBAR (span 3) ===== */}
                    <aside className="hidden lg:block lg:col-span-3 shrink-0">
                        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto flex flex-col space-y-6 pb-4 scrollbar-hide">
                            {/* Search Bar */}
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <input
                                    type="text"
                                    placeholder="Search for stories..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-5 pr-12 py-3.5 bg-card border border-border rounded-full focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm shadow-sm transition-all text-foreground placeholder:text-muted-foreground"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-primary-foreground hover:bg-primary bg-primary/10 rounded-full transition-colors">
                                    <Search className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Navigation Tabs */}
                            <div className="bg-card border border-border rounded-4xl p-2 flex flex-col mt-4">
                                <button
                                    onClick={() => setActiveTab('latest')}
                                    className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'latest' ? 'bg-primary text-primary-foreground font-semibold shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Latest
                                </button>
                                <button
                                    onClick={() => setActiveTab('popular')}
                                    className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'popular' ? 'bg-primary text-primary-foreground font-semibold shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Popular
                                </button>
                                <button
                                    onClick={() => setActiveTab('older')}
                                    className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'older' ? 'bg-primary text-primary-foreground font-semibold shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    Older
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* ===== MAIN CONTENT (span 6) ===== */}
                    <main className="lg:col-span-6 min-w-0">
                        {/* Feed Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-foreground font-bold text-[18px]">
                                {total} Stories
                            </h2>
                        </div>

                        {/* Stories Feed */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 rounded-4xl border border-border bg-card">
                                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                                <p className="text-muted-foreground font-medium">Loading stories...</p>
                            </div>
                        ) : stories.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-32 px-4 rounded-4xl border border-border border-dashed bg-card/20">
                                <div className="h-16 w-16 rounded-3xl bg-muted border border-border flex items-center justify-center mb-6 shadow-sm">
                                    <BookOpen className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">No Stories Yet</h3>
                                <p className="text-muted-foreground text-center max-w-md font-medium text-[15px]">
                                    {isAuthenticated
                                        ? "Be the first to share your success story! Your journey can inspire others in our community."
                                        : "Login to share your success story and inspire others in our community."}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6 lg:gap-8 mb-12">
                                {stories.map((story) => (
                                    <StoryCard
                                        key={story.id}
                                        story={story}
                                        onLike={handleLike}
                                        isLiked={false}
                                    />
                                ))}

                                {/* Pagination (See More) */}
                                {stories.length < total && (
                                    <div className="pt-8 flex justify-center pb-10">
                                        <button
                                            onClick={() => setOffset(offset + limit)}
                                            className="px-8 py-3 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-foreground text-[14px] font-semibold transition-colors border border-border"
                                        >
                                            See more
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* ===== RIGHT SIDEBAR (span 3) ===== */}
                    <aside className="hidden lg:block lg:col-span-3 shrink-0">
                        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto flex flex-col space-y-6 pb-4 scrollbar-hide">
                            
                            {/* CTA Button */}
                            <div className="w-full">
                                <Button
                                    onClick={() => router.push(isAuthenticated ? '/community/stories/new' : '/login')}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl py-7 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] text-[15px]"
                                >
                                    <Plus className="mr-2 h-5 w-5 stroke-[2.5]" /> 
                                    Share a new story
                                </Button>
                            </div>

                            {/* Popular Tags */}
                            <div className="space-y-5">
                                <h3 className="font-semibold text-[17px] text-foreground">Popular tags</h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {POPULAR_TAGS.map(tag => (
                                        <span 
                                            key={tag} 
                                            className="px-4 py-1.5 bg-card border border-border rounded-xl text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-all"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
