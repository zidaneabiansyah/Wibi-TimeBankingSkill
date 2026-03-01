import { SkeletonCard } from '../../components/ui/page-loader';

export default function MarketingLoading() {
    return (
        <div className="w-full space-y-12 pb-20">
            {/* Hero Skeleton */}
            <div className="container mx-auto px-4 pt-20">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-pulse">
                    <div className="h-4 w-32 bg-muted rounded-full mx-auto" />
                    <div className="h-16 w-3/4 bg-muted rounded-2xl mx-auto" />
                    <div className="h-6 w-1/2 bg-muted rounded-xl mx-auto" />
                    <div className="flex justify-center gap-4 pt-4">
                        <div className="h-12 w-40 bg-muted rounded-xl" />
                        <div className="h-12 w-40 bg-muted rounded-xl" />
                    </div>
                </div>
            </div>

            {/* Features Skeleton */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-64 bg-card/50 border rounded-[2rem] animate-pulse p-8 space-y-4">
                            <div className="h-12 w-12 bg-muted rounded-2xl" />
                            <div className="h-6 w-1/2 bg-muted rounded-lg" />
                            <div className="h-4 w-full bg-muted rounded-lg" />
                            <div className="h-4 w-3/4 bg-muted rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
