export default function AdminLoading() {
    return (
        <div className="p-8 space-y-8 animate-pulse w-full">
            {/* Admin Header Skeleton */}
            <div className="flex justify-between items-end mb-6">
                <div className="space-y-3">
                    <div className="h-8 w-64 bg-muted rounded-xl" />
                    <div className="h-4 w-96 bg-muted rounded-lg" />
                </div>
                <div className="h-10 w-32 bg-muted rounded-xl" />
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-card/50 border rounded-3xl p-6 space-y-4">
                        <div className="h-4 w-24 bg-muted rounded" />
                        <div className="h-8 w-16 bg-muted rounded-lg" />
                    </div>
                ))}
            </div>

            {/* Admin Table Skeleton */}
            <div className="bg-card/30 border rounded-[2rem] p-8 space-y-6">
                <div className="h-6 w-48 bg-muted rounded-lg" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex gap-4 items-center">
                            <div className="h-10 w-10 bg-muted rounded-full" />
                            <div className="h-4 flex-1 bg-muted rounded" />
                            <div className="h-4 w-24 bg-muted rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
