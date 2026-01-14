'use client';

import { useEffect } from 'react';
import { useFavoriteStore } from '@/stores';
import { FavoriteTeacherCard } from './FavoriteTeacherCard';
import { Button } from '@/components/ui/button';
import { Loader2, HeartOff } from 'lucide-react';

export function FavoriteList() {
    const { favorites, total, isLoading, fetchFavorites } = useFavoriteStore();

    useEffect(() => {
        fetchFavorites();
    }, []);

    if (isLoading && favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading your favorites...</p>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto">
                <div className="bg-muted/30 p-6 rounded-full">
                    <HeartOff className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">No favorites yet</h3>
                    <p className="text-muted-foreground mt-2">
                        Start exploring the marketplace and save your favorite teachers here for quick access.
                    </p>
                </div>
                <Button variant="default" className="mt-4" onClick={() => window.location.href = '/marketplace'}>
                    Explore Marketplace
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((fav) => (
                    fav.teacher && <FavoriteTeacherCard key={fav.id} teacher={fav.teacher} />
                ))}
            </div>

            {favorites.length < total && (
                <div className="flex justify-center pt-8">
                    <Button
                        variant="outline"
                        onClick={() => fetchFavorites(10, favorites.length)}
                        disabled={isLoading}
                        className="px-8"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Load More
                    </Button>
                </div>
            )}
        </div>
    );
}
