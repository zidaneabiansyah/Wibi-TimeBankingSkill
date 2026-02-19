'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import type { ForumThread } from '@/types';
import { toast } from 'sonner';

export default function ForumSearchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [threads, setThreads] = useState<ForumThread[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    const handleSearch = async (q: string) => {
        try {
            setLoading(true);
            const data = await communityService.searchThreads(q);
            setThreads(data.threads);
            setTotal(data.total);
        } catch (error) {
            console.error('Failed to search threads:', error);
            toast.error('Failed to search discussions');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="w-full max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Forum
                </Button>

                <h1 className="text-3xl font-bold mb-6">
                    Search Results for "{query}"
                </h1>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : threads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                        <p>No discussions found matching your query.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-muted-foreground mb-4">Found {total} results</p>
                        {threads.map((thread) => (
                            <div 
                                key={thread.id} 
                                onClick={() => router.push(`/community/forum/${thread.id}`)}
                                className="bg-card p-6 rounded-lg border border-border hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <h3 className="text-xl font-semibold mb-2">{thread.title}</h3>
                                <p className="text-muted-foreground line-clamp-2 mb-4">{thread.content}</p>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" />
                                        {thread.reply_count} replies
                                    </span>
                                    {thread.tags && thread.tags.length > 0 && (
                                        <div className="flex gap-2 ml-auto">
                                            {thread.tags.map(tag => (
                                                <span key={tag} className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
