'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { PageLoader } from '@/components/ui/page-loader';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { loadUser, isHydrated } = useAuthStore();

    useEffect(() => {
        // Load user from localStorage on mount
        console.log('🔐 AuthProvider: Loading user from localStorage...');
        loadUser();
    }, [loadUser]);

    // Show premium splash screen while hydrating auth state from localStorage
    if (!isHydrated) {
        return <PageLoader message="Menyiapkan Wibi..." fullScreen />;
    }

    return <>{children}</>;
}
