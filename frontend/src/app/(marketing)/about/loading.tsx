import React from 'react';

export default function AboutLoading() {
    return (
        <div className="min-h-screen bg-background animate-pulse overflow-hidden">
            {/* Sticky Hero Skeleton matching AboutPage */}
            <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden pt-24">
                {/* Background Blobs Skeleton */}
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl" />

                {/* Content Skeleton */}
                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
                    <div className="space-y-4 mb-4">
                        <div className="h-20 md:h-28 w-[300px] md:w-[600px] bg-muted rounded-2xl mx-auto" />
                        <div className="h-20 md:h-28 w-[250px] md:w-[500px] bg-muted rounded-2xl mx-auto" />
                    </div>

                    <div className="space-y-2 max-w-2xl w-full">
                        <div className="h-4 w-full bg-muted/60 rounded-full mx-auto" />
                        <div className="h-4 w-3/4 bg-muted/60 rounded-full mx-auto" />
                    </div>

                    {/* Scroll Indicator Skeleton */}
                    <div className="mt-12 flex flex-col items-center gap-2">
                        <div className="h-3 w-16 bg-muted/60 rounded-full" />
                        <div className="w-px h-12 bg-muted/40" />
                    </div>
                </div>
            </section>

            {/* Marquee Divider Skeleton */}
            <div className="bg-primary/10 py-6 border-y-4 border-orange-500/10" />

            {/* Content Section Skeleton */}
            <div className="py-32 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div className="aspect-square rounded-3xl bg-card border border-border/50" />
                    <div className="space-y-8">
                        <div className="h-12 w-3/4 bg-muted rounded-2xl" />
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-muted/60 rounded-lg" />
                            <div className="h-4 w-full bg-muted/60 rounded-lg" />
                            <div className="h-4 w-2/3 bg-muted/60 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
