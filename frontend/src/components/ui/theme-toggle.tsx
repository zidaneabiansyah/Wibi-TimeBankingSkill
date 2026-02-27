'use client';

import { m, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9 border border-border rounded-full" />;

    const isDark = resolvedTheme === 'dark';

    return (
        <m.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground transition-all duration-300 shadow-sm overflow-hidden"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <m.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ y: 20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                >
                    {isDark ? (
                        <Sun className="w-4 h-4 text-orange-400 group-hover:drop-shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                    ) : (
                        <Moon className="w-4 h-4 text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                    )}
                </m.div>
            </AnimatePresence>

            {/* Subtle glow background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${isDark ? 'bg-orange-400' : 'bg-blue-500'}`} />
        </m.button>
    );
}
