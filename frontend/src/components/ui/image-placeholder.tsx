'use client';

import { cn } from '@/lib/utils';

interface ImagePlaceholderProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    variant?: 'skeleton' | 'shimmer' | 'blur';
}

/**
 * Image placeholder component for loading states
 */
export function ImagePlaceholder({
    width = '100%',
    height = '100%',
    className,
    variant = 'shimmer',
}: ImagePlaceholderProps) {
    const widthClass = typeof width === 'number' ? `w-[${width}px]` : 'w-full';
    const heightClass = typeof height === 'number' ? `h-[${height}px]` : 'h-full';

    const variants = {
        skeleton: 'bg-muted animate-pulse',
        shimmer: 'bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-shimmer',
        blur: 'bg-muted/50 blur-lg',
    };

    return (
        <div
            className={cn(
                widthClass,
                heightClass,
                variants[variant],
                'rounded-lg',
                className
            )}
            role="status"
            aria-label="Loading image"
        />
    );
}

/**
 * Blurred placeholder for LQIP (Low Quality Image Placeholder)
 */
interface BlurredImagePlaceholderProps {
    blurDataURL?: string;
    className?: string;
}

export function BlurredImagePlaceholder({
    blurDataURL,
    className,
}: BlurredImagePlaceholderProps) {
    return (
        <div
            className={cn('w-full h-full bg-muted rounded-lg overflow-hidden', className)}
            style={{
                backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: blurDataURL ? 'blur(20px)' : undefined,
            }}
        />
    );
}
