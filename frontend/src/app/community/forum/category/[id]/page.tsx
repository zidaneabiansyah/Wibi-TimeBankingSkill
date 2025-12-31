'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ArrowLeft, MessageSquare, Plus, Calendar, User, Pin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { toast } from 'sonner';
import type { ForumThread, ForumCategory } from '@/types';
import { useAuthStore } from '@/stores/auth.store';

export default function CategoryThreadsPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = parseInt(params.id as string);
    const { isAuthenticated } = useAuthStore();

    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [currentCategory, setCurrentCategory] = useState<ForumCategory | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalThreads, setTotalThreads] = useState(0);

    useEffect(() => {
        if (!isNaN(categoryId)) {
            fetchData();
        }
    }, [categoryId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [threadsData, categoriesData] = await Promise.all([
                communityService.getThreadsByCategory(categoryId),
                communityService.getCategories()
            ]);

            setThreads(threadsData.threads);
            setTotalThreads(threadsData.total);
            setCategories(categoriesData);
            
            const category = categoriesData.find(c => c.id === categoryId);
            setCurrentCategory(category || null);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load threads');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground mb-4">Category not found</p>
                    <Button onClick={() => router.push('/community/forum')}>Go Back to Forum</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
            <div className="w-full max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    
                    {isAuthenticated && (
                        <Button 
                            onClick={() => router.push(`/community/forum/new?category=${categoryId}`)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            New Discussion
                        </Button>
                    )}
                </div>

                <div className="mb-8 text-center md:text-left">
                    <div className="flex items-center gap-4 mb-2 justify-center md:justify-start">
                         <div 
                            className="p-3 rounded-lg"
                            style={{ backgroundColor: `${currentCategory.color}20`, color: currentCategory.color }}
                         >
                            <MessageSquare className="h-6 w-6" />
                         </div>
                         <h1 className="text-3xl font-bold">{currentCategory.name}</h1>
                    </div>
                    <p className="text-muted-foreground max-w-2xl">{currentCategory.description}</p>
                </div>

                <div className="grid gap-4">
                    {threads.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-12 text-center">
                            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="text-xl font-semibold mb-2">No discussions yet</h3>
                            <p className="text-muted-foreground mb-6">Be the first to start a discussion in this category!</p>
                            {isAuthenticated && (
                                <Button onClick={() => router.push(`/community/forum/new?category=${categoryId}`)}>
                                    Start a Discussion
                                </Button>
                            )}
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <Link href={`/community/forum/thread/${thread.id}`} key={thread.id}>
                                <div className="group bg-card hover:bg-accent/5 transition-colors rounded-xl border border-border p-6 shadow-sm hover:shadow-md">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {thread.is_pinned && (
                                                    <span className="bg-blue-500/10 text-blue-600 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Pin className="h-3 w-3 rotate-45" /> Pinned
                                                    </span>
                                                )}
                                                {thread.is_closed && (
                                                    <span className="bg-red-500/10 text-red-600 text-xs px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Lock className="h-3 w-3" /> Locked
                                                    </span>
                                                )}
                                                {thread.tags?.map((tag) => (
                                                    <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {thread.title}
                                            </h3>
                                            
                                            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                                {thread.content}
                                            </p>
                                            
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-3.5 w-3.5" />
                                                    <span>{thread.author?.full_name || 'Anonymous'}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MessageSquare className="h-3.5 w-3.5" />
                                                    <span>{thread.reply_count} replies</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
