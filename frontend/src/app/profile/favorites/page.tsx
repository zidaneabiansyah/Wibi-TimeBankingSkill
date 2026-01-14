'use client';

import { FavoriteList } from '@/components/favorite';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, Heart } from 'lucide-react';

export default function FavoritesPage() {
    return (
        <div className="container py-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="space-y-4">
                <Link href="/profile">
                    <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back to Profile
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
                        <Heart className="h-6 w-6 fill-current" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Favorite Teachers</h1>
                        <p className="text-muted-foreground">
                            Teachers you've saved for quick access and regular sessions.
                        </p>
                    </div>
                </div>
            </div>

            <hr className="border-border/50" />

            {/* List */}
            <FavoriteList />
        </div>
    );
}
