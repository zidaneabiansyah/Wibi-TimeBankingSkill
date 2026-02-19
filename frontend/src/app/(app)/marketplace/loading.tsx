import { SkeletonCard } from '@/components/ui/page-loader';

export default function MarketplaceLoading() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="h-4 bg-muted rounded w-96" />
                </div>

                {/* Filters Skeleton */}
                <div className="flex gap-4 animate-pulse">
                    <div className="h-10 bg-muted rounded w-64" />
                    <div className="h-10 bg-muted rounded w-32" />
                    <div className="h-10 bg-muted rounded w-32" />
                </div>

                {/* Skills Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(9)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            </div>
        </main>
    );
}
