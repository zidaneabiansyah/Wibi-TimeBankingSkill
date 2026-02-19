'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFavoriteStore } from '@/stores/favorite.store';
import { toast } from 'sonner';
import { Heart, Star, BookOpen, ArrowLeft } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingSkeleton } from '@/components/ui/loading';

export function FavoritesClient() {
    const { favorites, isLoading, fetchFavorites, removeFavorite } = useFavoriteStore();

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const handleRemoveFavorite = async (teacherId: number) => {
        try {
            await removeFavorite(teacherId);
            toast.success('Removed from favorites');
            fetchFavorites();
        } catch (error) {
            toast.error('Failed to remove favorite');
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/profile">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Favorite Teachers</h1>
                        <p className="text-muted-foreground">Teachers you've marked as favorites</p>
                    </div>
                </div>

                {/* Favorites List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <LoadingSkeleton className="h-40 w-full" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : favorites.length === 0 ? (
                    <EmptyState
                        icon={Heart}
                        title="No favorites yet"
                        description="Browse the marketplace and add your favorite teachers!"
                        action={{
                            label: 'Browse Marketplace',
                            onClick: () => window.location.href = '/marketplace',
                        }}
                        variant="card"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite) => (
                            <Card key={favorite.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage 
                                                src={favorite.teacher?.avatar || ''} 
                                                alt={favorite.teacher?.full_name} 
                                            />
                                            <AvatarFallback>
                                                {favorite.teacher?.full_name 
                                                    ? getInitials(favorite.teacher.full_name) 
                                                    : 'T'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg truncate">
                                                {favorite.teacher?.full_name}
                                            </CardTitle>
                                            <CardDescription className="truncate">
                                                @{favorite.teacher?.username}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {favorite.teacher?.bio && (
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {favorite.teacher.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                            <span className="font-medium">
                                                {favorite.teacher?.average_rating_as_teacher?.toFixed(1) || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                {favorite.teacher?.total_sessions_as_teacher || 0} sessions
                                            </span>
                                        </div>
                                    </div>

                                    {favorite.teacher?.school && (
                                        <Badge variant="secondary" className="text-xs">
                                            {favorite.teacher.school}
                                        </Badge>
                                    )}

                                    <div className="flex gap-2 pt-2">
                                        <Link 
                                            href={`/users/${favorite.teacher?.username}`} 
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full" size="sm">
                                                View Profile
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveFavorite(favorite.teacher_id)}
                                        >
                                            <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
