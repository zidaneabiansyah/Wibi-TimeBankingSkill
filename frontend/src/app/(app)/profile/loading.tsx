import { SkeletonCard } from '@/components/ui/page-loader';

export default function ProfileLoading() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center animate-pulse">
                    <div className="h-8 bg-muted rounded w-48" />
                    <div className="flex gap-2">
                        <div className="h-10 bg-muted rounded w-32" />
                        <div className="h-10 bg-muted rounded w-32" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="space-y-6">
                        <div className="rounded-lg border bg-card p-6 animate-pulse">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="h-24 w-24 rounded-full bg-muted" />
                                <div className="space-y-2 w-full">
                                    <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                                    <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                                </div>
                            </div>
                        </div>
                        <SkeletonCard />
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-lg border bg-card p-6 animate-pulse">
                                    <div className="h-16 bg-muted rounded" />
                                </div>
                            ))}
                        </div>
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                </div>
            </div>
        </main>
    );
}
