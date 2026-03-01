'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, MessageSquare, Search, ChevronDown, User, Eye, ChevronUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { useAuthStore } from '@/stores/auth.store';
import type { ForumCategory, ForumThread } from '@/types';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

export default function ForumPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'latest' | 'popular' | 'older'>('latest');
    const [totalThreads, setTotalThreads] = useState(0);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchThreads();
    }, [selectedCategoryId, activeTab]);

    const fetchInitialData = async () => {
        try {
            const cats = await communityService.getCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        }
    };

    const fetchThreads = async () => {
        try {
            setLoading(true);
            let data: { threads: ForumThread[]; total: number };
            if (selectedCategoryId) {
                // Fetch specific category
                data = await communityService.getThreadsByCategory(selectedCategoryId, 20, 0);
            } else {
                // If no category, fetch a general list using getAllThreads
                data = await communityService.getAllThreads(20, 0); 
            }
            
            let fetchedThreads = data.threads || [];
            
            // Client-side sorting for demonstration logic based on tabs
            if (activeTab === 'popular') {
                fetchedThreads.sort((a, b) => b.view_count - a.view_count);
            } else if (activeTab === 'older') {
                fetchedThreads.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            } else {
                // Latest
                fetchedThreads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            }
            
            setThreads(fetchedThreads);
            setTotalThreads(data.total || fetchedThreads.length);
        } catch (error) {
            console.error('Failed to fetch threads:', error);
            toast.error('Failed to load discussions');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/community/forum/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const POPULAR_TAGS = ['Programming', 'Design', 'Marketing', 'Language', 'Music', 'Photography', 'Writing'];

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-28 pb-20" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-14">
                
                {/* Breadcrumb / Status area */}
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center text-sm font-medium tracking-wide text-stone-400 uppercase">
                        <Link href="/community" className="hover:text-primary transition-colors">Forum</Link>
                        {selectedCategoryId && (
                            <>
                                <span className="mx-2 text-stone-600">/</span>
                                <span className="text-white">
                                    {categories.find(c => c.id === selectedCategoryId)?.name || 'Category'}
                                </span>
                            </>
                        )}
                        {!selectedCategoryId && activeTab && (
                            <>
                                <span className="mx-2 text-stone-600">/</span>
                                <span className="text-white">{activeTab}</span>
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
                                placeholder="Search for topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-5 pr-12 py-3.5 bg-card/60 border border-white/5 rounded-full focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm shadow-sm transition-all text-white placeholder:text-stone-500"
                            />
                            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-primary hover:text-white bg-primary/10 rounded-full transition-colors">
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Navigation Tabs */}
                        <div className="bg-card/40 border border-white/5 rounded-[2rem] p-2 flex flex-col">
                            <button
                                onClick={() => { setActiveTab('latest'); setSelectedCategoryId(null); }}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'latest' && !selectedCategoryId ? 'bg-primary text-primary-foreground font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]' : 'text-stone-400 hover:text-stone-200'}`}
                            >
                                Latest
                            </button>
                            <button
                                onClick={() => { setActiveTab('popular'); setSelectedCategoryId(null); }}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'popular' && !selectedCategoryId ? 'bg-primary text-primary-foreground font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]' : 'text-stone-400 hover:text-stone-200'}`}
                            >
                                Popular
                            </button>
                            <button
                                onClick={() => { setActiveTab('older'); setSelectedCategoryId(null); }}
                                className={`flex items-center gap-3 px-5 py-3.5 rounded-3xl text-[14px] font-medium transition-all ${activeTab === 'older' && !selectedCategoryId ? 'bg-primary text-primary-foreground font-semibold shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]' : 'text-stone-400 hover:text-stone-200'}`}
                            >
                                Older
                            </button>
                        </div>

                        {/* Categories List */}
                        <div className="bg-transparent pt-4">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <h3 className="font-semibold text-base text-white">Categories ({categories.length})</h3>
                                <ChevronDown className="w-4 h-4 text-stone-500" />
                            </div>
                            <div className="space-y-1 bg-card/40 border border-white/5 p-2 rounded-[2rem]">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategoryId(category.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-3xl text-[14px] font-medium transition-all text-left group ${selectedCategoryId === category.id ? 'bg-white/10 text-white font-semibold' : 'text-stone-400 hover:text-stone-200 hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color || '#f97316' }} />
                                            <span className="truncate">{category.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        </div>
                    </aside>

                    {/* ===== MIDDLE FEED (span 6) ===== */}
                    <main className="col-span-1 lg:col-span-6 flex flex-col min-w-0 space-y-4 min-h-[40vh]">
                        
                        {/* Feed Info */}
                        <div className="flex justify-center mb-2">
                            <span className="text-[13px] font-semibold text-primary">
                                {loading ? 'Fetching posts...' : `${totalThreads} Posts`}
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : threads.length === 0 ? (
                            <div className="bg-card/50 border border-white/5 rounded-[2rem] p-12 text-center">
                                <MessageSquare className="w-12 h-12 mx-auto text-stone-600 mb-4 opacity-50" />
                                <h3 className="text-lg font-semibold text-white mb-2">No discussions found</h3>
                                <p className="text-stone-400 text-[14px]">Be the first to start a conversation in this area.</p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {threads.map(thread => (
                                    <Link href={`/community/forum/thread/${thread.id}`} key={thread.id} className="block group">
                                        <div className="bg-card border border-white/5 rounded-[2rem] p-6 lg:p-7 transition-all duration-300 hover:bg-card/80 hover:border-white/15 relative overflow-hidden group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                                            
                                            {/* Top info */}
                                            <div className="flex items-start justify-between mb-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                                        {thread.author?.avatar ? (
                                                            <img src={thread.author.avatar} alt={thread.author?.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User className="w-5 h-5 text-stone-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-medium text-stone-400">
                                                            Posted by <span className="text-stone-100 font-semibold">{thread.author?.full_name || 'Anonymous'}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-xs text-stone-500 font-medium whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                                                </div>
                                            </div>

                                            {/* Content Area */}
                                            <div className="mb-6">
                                                <h3 className="text-lg md:text-[19px] font-semibold text-stone-100 mb-2.5 group-hover:text-primary transition-colors leading-snug">
                                                    {thread.title}
                                                </h3>
                                                <p className="text-[14px] text-stone-400 line-clamp-2 leading-relaxed font-normal">
                                                    {thread.content}
                                                </p>
                                                {/* Thread Tags Display */}
                                                {thread.tags && thread.tags.length > 0 && (
                                                    <div className="flex items-center gap-2 mt-4">
                                                        {thread.tags.slice(0,3).map(tag => (
                                                            <span key={tag} className="text-[12px] font-medium text-primary/90 bg-primary/10 px-2.5 py-1 rounded-md">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom interaction bar */}
                                            <div className="flex items-center justify-between border-t border-white/5 pt-5">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2 text-[#059669] font-bold text-[14px]">
                                                        <ChevronUp className="w-4 h-4 stroke-[3]" />
                                                        <span>11</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-stone-400 text-[13px] font-medium">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{thread.view_count || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-stone-400 text-[13px] font-medium">
                                                        <MessageSquare className="w-4 h-4" />
                                                        <span>{thread.reply_count || 0}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 group-hover:bg-primary/20 flex items-center justify-center text-stone-400 group-hover:text-primary transition-all">
                                                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </Link>
                                ))}
                                
                                {threads.length > 0 && (
                                    <div className="pt-6 flex justify-center">
                                        <Button variant="secondary" className="rounded-full px-8 py-6 font-semibold bg-white/5 hover:bg-white/10 text-white border-0 text-[15px]">
                                            See more
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>

                    {/* ===== RIGHT SIDEBAR (span 3) ===== */}
                    <aside className="hidden lg:block lg:col-span-3 shrink-0">
                        <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto flex flex-col space-y-6 pb-4 scrollbar-hide">
                        
                        {/* New Topic CTA */}
                        <div className="w-full">
                            <Button 
                                onClick={() => router.push(selectedCategoryId ? `/community/forum/new?category=${selectedCategoryId}` : '/community/forum/new')}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl py-7 shadow-[0_10px_25px_-5px_rgba(249,115,22,0.4)] text-[15px]"
                            >
                                <Plus className="mr-2 h-5 w-5" /> Start a new topic
                            </Button>
                        </div>

                        {/* Popular Tags */}
                        <div className="space-y-5">
                            <h3 className="font-semibold text-[17px] text-white">Popular tags</h3>
                            <div className="flex flex-wrap gap-2.5">
                                {POPULAR_TAGS.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="px-4 py-1.5 bg-card border border-white/5 rounded-xl text-[13px] font-medium text-stone-300 hover:bg-white/10 hover:border-white/20 hover:text-white cursor-pointer transition-all"
                                    >
                                        {tag}
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
