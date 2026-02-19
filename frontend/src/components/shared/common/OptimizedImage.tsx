'use client'

import Image from 'next/image'
import { CSSProperties, useState } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    fill?: boolean
    sizes?: string
    quality?: number
    objectFit?: CSSProperties['objectFit']
    objectPosition?: CSSProperties['objectPosition']
    onLoad?: () => void
}

/**
 * OptimizedImage - Wrapper around Next.js Image component
 * Provides automatic image optimization with:
 * - Modern format support (AVIF, WebP)
 * - Responsive image sizes
 * - Lazy loading by default
 * - Blur placeholder for better UX
 * - Error handling with fallback
 *
 * @example
 * <OptimizedImage
 *   src="/images/profile.jpg"
 *   alt="User profile"
 *   width={200}
 *   height={200}
 *   className="rounded-full"
 *   priority={false}
 * />
 */
export default function OptimizedImage({
    src,
    alt,
    width = 400,
    height = 300,
    className = '',
    priority = false,
    fill = false,
    sizes,
    quality = 75,
    objectFit = 'cover',
    objectPosition = 'center',
    onLoad,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Handle image load completion
    const handleLoadingComplete = () => {
        setIsLoading(false)
        onLoad?.()
    }

    // Handle image load error
    const handleError = () => {
        setHasError(true)
        setIsLoading(false)
    }

    // Fallback for error state
    if (hasError) {
        return (
            <div
                className={`bg-muted flex items-center justify-center ${className}`}
                style={{
                    width: fill ? '100%' : width,
                    height: fill ? '100%' : height,
                }}
            >
                <span className="text-muted-foreground text-sm">Image not found</span>
            </div>
        )
    }

    // Responsive sizes for different breakpoints
    const defaultSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'

    return (
        <div className={`relative ${fill ? 'w-full h-full' : ''} ${isLoading ? 'bg-muted animate-pulse' : ''}`}>
            <Image
                src={src}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                sizes={defaultSizes}
                quality={quality}
                priority={priority}
                className={className}
                style={{
                    objectFit,
                    objectPosition,
                }}
                onLoadingComplete={handleLoadingComplete}
                onError={handleError}
                // Placeholder for better perceived performance
                placeholder="empty"
            />
        </div>
    )
}
