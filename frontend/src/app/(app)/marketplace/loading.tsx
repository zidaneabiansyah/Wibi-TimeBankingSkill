export default function MarketplaceLoading() {
    return (
        <div className="min-h-screen bg-background text-zinc-100 selection:bg-orange-500/30">
            <div className="container mx-auto px-4 pt-6 pb-16 max-w-7xl animate-pulse">
                {/* 1. Bento Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-16 h-auto lg:min-h-[480px]">
                    {/* Block A Skeleton */}
                    <div className="lg:col-span-8 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center">
                        <div className="w-12 h-1 bg-zinc-800/50 mb-8 rounded-full" />
                        <div className="w-2/3 h-14 bg-zinc-800/50 mb-4 rounded-2xl" />
                        <div className="w-1/2 h-14 bg-zinc-800/50 mb-12 rounded-2xl" />
                        <div className="w-full max-w-xl h-15 bg-black/40 border border-zinc-800/50 rounded-2xl" />
                    </div>

                    {/* Block B Skeleton */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <div className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem] p-10 flex flex-col justify-center">
                            <div className="w-24 h-3 bg-zinc-800/50 mb-4 rounded-full" />
                            <div className="w-32 h-10 bg-zinc-800/50 mb-10 rounded-xl" />
                            <div className="space-y-6 pt-6 border-t border-zinc-800/50">
                                <div className="flex justify-between">
                                    <div className="w-20 h-8 bg-zinc-800/30 rounded-lg" />
                                    <div className="w-20 h-8 bg-zinc-800/30 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        <div className="h-44 bg-zinc-900/40 border border-zinc-800/80 rounded-[2.5rem]" />
                    </div>
                </div>

                {/* 2. Navigation Bar Skeleton */}
                <div className="relative mb-12 h-[68px] bg-black/40 backdrop-blur-2xl border border-zinc-800/80 rounded-2xl p-2.5 flex items-center">
                    <div className="flex gap-2 pl-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-24 h-9 bg-zinc-800/50 rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* 3. Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-[520px] bg-zinc-900/20 border border-zinc-800/40 rounded-[2.5rem]" />
                    ))}
                </div>
            </div>
        </div>
    );
}
