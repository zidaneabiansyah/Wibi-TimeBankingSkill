import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

export function PageLoader({ message = 'Loading...', fullScreen = true }: PageLoaderProps) {
    const containerClass = fullScreen
        ? 'min-h-screen flex items-center justify-center bg-background'
        : 'flex items-center justify-center py-12';

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">{message}</p>
            </div>
        </div>
    );
}

export function CardLoader() {
    return (
        <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-card p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-20 bg-muted rounded" />
        </div>
    );
}
