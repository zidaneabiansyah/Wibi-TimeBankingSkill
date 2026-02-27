'use client';
import * as React from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

export function TopLoader() {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Reset and start loading on path change
        setLoading(true);

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setLoading(false);
        }, 500);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [pathname]);

    return (
        <AnimatePresence mode="wait">
            {loading && (
                <m.div
                    key="top-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none"
                >
                    {/* Glow effect */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-[#FF7020]/20 blur-lg" />

                    {/* Main Bar */}
                    <m.div
                        className="h-[3px] bg-gradient-to-r from-[#FF7020] via-orange-400 to-[#FF7020] shadow-[0_0_10px_rgba(255,112,32,0.8)]"
                        initial={{ width: '0%', x: '-100%' }}
                        animate={{
                            width: ['20%', '40%', '60%', '80%', '95%'],
                            x: '0%'
                        }}
                        transition={{
                            duration: 0.8,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Head light */}
                    <m.div
                        className="absolute top-0 h-[3px] w-20 bg-white blur-[2px]"
                        animate={{ left: '100%' }}
                        initial={{ left: '0%' }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    />
                </m.div>
            )}
        </AnimatePresence>
    );
}
