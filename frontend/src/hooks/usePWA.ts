'use client';

import { useEffect } from 'react';

/**
 * Hook to initialize PWA service worker
 * Handles service worker registration and updates
 */
export function usePWA() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Check if service workers are supported
        if (!('serviceWorker' in navigator)) {
            return;
        }

        // Register service worker
        const registerServiceWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });


                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker?.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show update notification to user
                            if (window.confirm('A new version of Wibi is available. Update now?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            } catch {
                // Registration failed silently
            }
        };

        // Register service worker after a short delay
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', registerServiceWorker);
        } else {
            registerServiceWorker();
        }

        // Handle when service worker takes control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            // Silent update
        });

        // Detect when app is installed
        let deferredPrompt: any = null;
        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            deferredPrompt = e;
            window.dispatchEvent(new CustomEvent('pwa-installable', { detail: deferredPrompt }));
        };

        const onAppInstalled = () => {
            deferredPrompt = null;
        };

        window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
        window.addEventListener('appinstalled', onAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
            window.removeEventListener('appinstalled', onAppInstalled);
        };
    }, []);
}
