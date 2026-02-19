import { SkeletonCard } from '@/components/ui/page-loader';

export default function DashboardLoading() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="space-y-2 animate-pulse">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="h-4 bg-muted rounded w-64" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                            <div className="space-y-3">
                                <div className="h-4 bg-muted rounded w-20" />
                                <div className="h-8 bg-muted rounded w-16" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        </main>
    );
}
