'use client';

import { useEffect } from 'react';

/**
 * Component to handle mobile viewport meta tags and mobile optimizations
 */
export function MobileOptimization() {
    useEffect(() => {
        // Prevent zoom on input focus on iOS
        const inputs = document.querySelectorAll('input, select, textarea');

        inputs.forEach((input) => {
            input.addEventListener('focus', () => {
                // Don't disable zoom, just ensure proper scaling
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute(
                        'content',
                        'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes'
                    );
                }
            });
        });

        // Prevent double-tap zoom on buttons
        let lastTouchEnd = 0;
        document.addEventListener(
            'touchend',
            (event) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            },
            false
        );

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('focus', () => { });
            });
            document.removeEventListener('touchend', () => { });
        };
    }, []);

    return null;
}
