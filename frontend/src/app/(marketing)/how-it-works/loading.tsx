import React from 'react';

export default function HowItWorksLoading() {
    return (
        <div className="min-h-screen bg-black animate-pulse">
            {/* Hero Skeleton matching the real UI */}
            <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 sm:px-12 flex flex-col items-center justify-center min-h-screen">
                <div className="max-w-4xl mx-auto text-center w-full flex flex-col items-center">
                    <div className="h-20 w-3/4 bg-zinc-800 rounded-2xl mb-8" />
                    <div className="h-6 w-2/3 bg-zinc-800/60 rounded-xl mb-12" />
                    <div className="flex gap-4 w-full justify-center">
                        <div className="h-14 w-40 bg-zinc-800 rounded-full" />
                        <div className="h-14 w-40 bg-zinc-800/40 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Principles Section Skeleton */}
            <div className="py-24 bg-zinc-950 border-t border-zinc-900">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-zinc-900/50 rounded-3xl border border-zinc-800/50" />
                    ))}
                </div>
            </div>
        </div>
    );
}
