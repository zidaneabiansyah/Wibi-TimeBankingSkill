'use client';

import { m, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface PageLoaderProps {
    message?: string;
    fullScreen?: boolean;
}

export function PageLoader({ message, fullScreen = true }: PageLoaderProps) {
    const containerClass = fullScreen
        ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background'
        : 'flex flex-col items-center justify-center py-12';

    return (
        <div className={containerClass}>
            <div className="flex flex-col items-center gap-8 text-center">
                {/* Simple Branded Logo Animation */}
                <m.div
                    animate={{
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-20 h-20"
                >
                    <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
                    <Image
                        src="/wibi.png"
                        alt="Wibi Logo"
                        fill
                        className="object-contain relative z-10"
                        priority
                    />
                </m.div>

                {/* Simple Progress Bar */}
                <div className="w-40 h-1 bg-muted rounded-full overflow-hidden relative">
                    <m.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-y-0 w-1/2 bg-primary"
                    />
                </div>

                {message && (
                    <m.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase"
                    >
                        {message}
                    </m.p>
                )}
            </div>
        </div>
    );
}

export function CardLoader() {
    return (
        <div className="flex items-center justify-center p-12">
            <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full shadow-[0_0_10px_rgba(255,112,32,0.2)]"
            />
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="rounded-3xl border border-border bg-card/50 p-6 space-y-5 animate-pulse overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-muted rounded-2xl" />
                <div className="space-y-2 flex-1">
                    <div className="h-4 bg-muted rounded-full w-3/4" />
                    <div className="h-3 bg-muted rounded-full w-1/2" />
                </div>
            </div>
            <div className="h-40 bg-muted rounded-2xl w-full" />
            <div className="flex justify-between items-center pt-2">
                <div className="h-8 w-24 bg-muted rounded-full" />
                <div className="h-8 w-24 bg-muted rounded-full" />
            </div>
        </div>
    );
}
