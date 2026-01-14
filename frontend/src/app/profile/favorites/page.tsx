'use client';

import { FavoriteList } from '@/components/favorite';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Heart, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

function FavoritesContent() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <div className="bg-red-500/10 p-2 rounded-lg text-red-600">
                                <Heart className="h-5 w-5 fill-current" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Favorite Teachers</h1>
                        </div>
                        <p className="text-muted-foreground ml-8">
                            Keep track of the tutors you've enjoyed working with and want to book again.
                        </p>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <Link href="/marketplace" className="flex-1 md:flex-none">
                            <Button variant="outline" className="w-full gap-2">
                                <Search className="h-4 w-4" />
                                Find Tutors
                            </Button>
                        </Link>
                        <Link href="/profile" className="flex-1 md:flex-none">
                            <Button variant="ghost" className="w-full gap-2">
                                <ExternalLink className="h-4 w-4" />
                                My Profile
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-card/50 border border-border/40 rounded-3xl p-6 md:p-8 backdrop-blur-sm">
                    <FavoriteList />
                </div>
            </main>
        </div>
    );
}

export default function FavoritesPage() {
    return (
        <ProtectedRoute>
            <FavoritesContent />
        </ProtectedRoute>
    );
}
