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
            console.log('[PWA] Service Workers not supported');
            return;
        }

        // Register service worker
        const registerServiceWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });

                console.log('[PWA] Service Worker registered successfully:', registration);

                // Handle service worker updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker?.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] New service worker available');

                            // Show update notification to user
                            if (window.confirm('A new version of Wibi is available. Update now?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            } catch (error) {
                console.error('[PWA] Service Worker registration failed:', error);
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
            console.log('[PWA] Service Worker controller changed');
        });

        // Detect when app is installed
        let deferredPrompt: any = null;
        const onBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            deferredPrompt = e;
            console.log('[PWA] Install prompt ready');

            // You could trigger install UI here
            window.dispatchEvent(new CustomEvent('pwa-installable', { detail: deferredPrompt }));
        };

        const onAppInstalled = () => {
            console.log('[PWA] App installed');
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
