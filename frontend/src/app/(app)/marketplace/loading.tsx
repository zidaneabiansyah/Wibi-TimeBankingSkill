import React from 'react';

export default function MarketplaceLoading() {
    return (
        <div className="container mx-auto px-4 pt-6 pb-16 max-w-7xl animate-pulse">
            <div className="space-y-12">
                {/* Bento Grid Skeleton matching the real UI */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-auto lg:min-h-[480px]">
                    {/* Block A Skeleton (Main Big One) */}
                    <div className="lg:col-span-8 bg-card border border-border/80 rounded-[2.5rem] p-8 md:p-14 flex flex-col justify-center">
                        <div className="h-12 w-2/3 bg-muted rounded-2xl mb-8" />
                        <div className="h-6 w-1/2 bg-muted rounded-xl mb-12" />
                        <div className="h-16 w-full max-w-xl bg-background border border-border/50 rounded-2xl" />
                    </div>

                    {/* Block B Skeletons (Two Right Ones) */}
                    <div className="lg:col-span-4 flex flex-col gap-5">
                        <div className="flex-1 bg-card border border-border/80 rounded-[2.5rem] p-10">
                            <div className="h-4 w-24 bg-muted rounded-full mb-4" />
                            <div className="h-8 w-32 bg-muted rounded-xl mb-10" />
                            <div className="h-px bg-border/50 w-full mb-6" />
                            <div className="flex justify-between">
                                <div className="h-8 w-20 bg-muted/60 rounded-lg" />
                                <div className="h-8 w-20 bg-muted/60 rounded-lg" />
                            </div>
                        </div>
                        <div className="h-44 bg-card border border-border/80 rounded-[2.5rem]" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="h-[420px] bg-muted/20 border border-border/40 rounded-[2.5rem]" />
                    ))]}
                </div>
            </div>
        </div>
    );
}
