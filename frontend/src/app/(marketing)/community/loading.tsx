import React from 'react';

export default function CommunityLoading() {
    return (
        <div className="min-h-screen bg-background animate-pulse">
            {/* Split Hero Skeleton */}
            <section className="relative w-full h-dvh min-h-[600px] overflow-hidden border-b border-border/50">
                <div className="absolute top-0 left-0 h-full w-[55%] bg-card/50 flex flex-col justify-center px-10 md:px-16 space-y-6">
                    <div className="h-4 w-32 bg-muted rounded-full" />
                    <div className="h-16 w-full max-w-sm bg-muted rounded-2xl" />
                    <div className="h-12 w-2/3 bg-muted/60 rounded-xl" />
                    <div className="h-12 w-40 bg-primary/20 rounded-xl mt-4" />
                </div>
                <div className="absolute top-0 right-0 h-full w-[45%] bg-muted/20" />
            </section>

            <div className="mx-auto max-w-screen-2xl px-6 sm:px-12 lg:px-16 py-16 space-y-24">
                {/* Leaderboard Section Skeleton */}
                <div className="space-y-12">
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <div className="h-12 w-3/4 bg-muted rounded-2xl mx-auto" />
                        <div className="h-6 w-full bg-muted/60 rounded-lg mx-auto" />
                    </div>
                    <div className="h-[500px] w-full bg-card/30 border border-border rounded-[3rem]" />
                </div>
            </div>
        </div>
    );
}
