'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, MessageSquare, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ForumCategoryCard } from '@/components/community';
import { communityService } from '@/lib/services/community.service';
import { useAuthStore } from '@/stores/auth.store';
import type { ForumCategory } from '@/types';
import { toast } from 'sonner';

export default function ForumPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [categories, setCategories] = useState<ForumCategory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await communityService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load forum categories');
        } finally {
            setLoading(false);
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
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-500/10">
                                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Community Forum
                            </h1>
                        </div>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Join discussions, share knowledge, and connect with other learners and teachers in our vibrant community.
                        </p>
                    </div>
                    
                    {/* CTA Button - Only show once */}
                    {isAuthenticated && (
                        <div>
                            <Button 
                                onClick={() => router.push('/community/forum/new')}
                                className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Start New Discussion
                            </Button>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="mb-12 max-w-2xl">
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                            if (query.trim()) {
                                router.push(`/community/forum/search?q=${encodeURIComponent(query)}`);
                            }
                        }}
                        className="relative"
                    >
                        <input
                            name="q"
                            type="text"
                            placeholder="Search discussions..."
                            className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                             {/* Use Search icon if imported, else fallback */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </div>
                        <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-8">
                            Search
                        </Button>
                    </form>
                </div>

                {/* Categories Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : categories.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">No forum categories available yet</p>
                        <Button variant="outline" onClick={fetchCategories}>
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <ForumCategoryCard key={category.id} category={category} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
