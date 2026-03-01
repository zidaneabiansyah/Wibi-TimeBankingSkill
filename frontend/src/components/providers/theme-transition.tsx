'use client';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from 'next-themes';

export function ThemeTransition() {
    const { resolvedTheme } = useTheme();
    const [prevTheme, setPrevTheme] = useState(resolvedTheme);
    const [animating, setAnimating] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (resolvedTheme !== prevTheme && !animating) {
            triggerTransition();
        }
    }, [resolvedTheme]);

    const triggerTransition = () => {
        // Fallback for browsers that don't support document.startViewTransition
        // @ts-ignore
        if (!document.startViewTransition) {
            setPrevTheme(resolvedTheme);
            return;
        }

        // @ts-ignore
        document.startViewTransition(() => {
            setPrevTheme(resolvedTheme);
        });
    };

    return null;
}
