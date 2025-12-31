'use client';

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    sizes?: string;
    priority?: boolean;
    fill?: boolean;
    className?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
    objectPosition?: string;
    placeholder?: 'blur' | 'empty';
    onLoad?: () => void;
}

/**
 * Optimized responsive image component with lazy loading
 * Supports multiple sizes and automatic srcSet generation
 */
export function ResponsiveImage({
    src,
    alt,
    width,
    height,
    sizes,
    priority = false,
    fill = false,
    className,
    objectFit = 'cover',
    objectPosition = 'center',
    placeholder = 'empty',
    onLoad,
}: ResponsiveImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setError(true);
    };

    // Default sizes for responsive images
    const defaultSizes =
        sizes ||
        '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw';

    if (error) {
        return (
            <div
                className={cn(
                    'bg-muted flex items-center justify-center',
                    className
                )}
            >
                <span className="text-xs text-muted-foreground">Image not found</span>
            </div>
        );
    }

    if (fill) {
        return (
            <Image
                src={src}
                alt={alt}
                fill
                sizes={defaultSizes}
                priority={priority}
                loading={priority ? 'eager' : 'lazy'}
                quality={85}
                placeholder={placeholder === 'blur' ? 'blur' : undefined}
                className={cn(
                    'transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className
                )}
                style={{ objectFit, objectPosition }}
                onLoad={handleLoad}
                onError={handleError}
            />
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes={defaultSizes}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            quality={85}
            placeholder={placeholder === 'blur' ? 'blur' : undefined}
            className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                className
            )}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
}

/**
 * Picture-based responsive image with WebP support
 */
interface PictureImageProps {
    src: string;
    srcWebp?: string;
    alt: string;
    sizes?: string;
    className?: string;
    width?: number;
    height?: number;
}

export function PictureImage({
    src,
    srcWebp,
    alt,
    sizes,
    className,
    width,
    height,
}: PictureImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <picture>
            {srcWebp && (
                <source
                    srcSet={srcWebp}
                    type="image/webp"
                    sizes={sizes || '100vw'}
                />
            )}
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes || '100vw'}
                loading="lazy"
                className={cn(
                    'transition-opacity duration-300',
                    isLoaded ? 'opacity-100' : 'opacity-0',
                    className
                )}
                onLoad={() => setIsLoaded(true)}
            />
        </picture>
    );
}
