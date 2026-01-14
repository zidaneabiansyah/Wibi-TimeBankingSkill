'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoriteStore } from '@/stores';
import { useAuthStore } from '@/stores';
import { cn } from '@/lib/utils';
import { favoriteService } from '@/lib/services/favorite.service';

interface FavoriteButtonProps {
    teacherId: number;
    className?: string;
    size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function FavoriteButton({ teacherId, className, size = 'icon' }: FavoriteButtonProps) {
    const { isAuthenticated } = useAuthStore();
    const { addFavorite, removeFavorite } = useFavoriteStore();
    const [isFavorited, setIsFavorited] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            checkStatus();
        }
    }, [teacherId, isAuthenticated]);

    const checkStatus = async () => {
        try {
            const response = await favoriteService.checkFavorite(teacherId);
            if (response.success && response.data) {
                setIsFavorited(response.data.is_favorite);
            }
        } catch (error) {
            console.error('Failed to check favorite status:', error);
        }
    };

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            return;
        }

        setIsLoading(true);
        try {
            if (isFavorited) {
                await removeFavorite(teacherId);
                setIsFavorited(false);
            } else {
                await addFavorite(teacherId);
                setIsFavorited(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size={size}
            className={cn(
                "rounded-full transition-all duration-300",
                isFavorited ? "text-red-500 hover:text-red-600 bg-red-50" : "text-muted-foreground hover:text-red-500 hover:bg-red-50",
                className
            )}
            onClick={toggleFavorite}
            disabled={isLoading}
        >
            <Heart className={cn("h-5 w-5", isFavorited && "fill-current")} />
        </Button>
    );
}
