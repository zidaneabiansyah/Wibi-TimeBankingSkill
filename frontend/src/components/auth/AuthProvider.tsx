'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { PageLoader } from '@/components/ui/page-loader';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { loadUser, isHydrated } = useAuthStore();

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    if (!isHydrated) {
        return <PageLoader message="Menyiapkan Wibi..." fullScreen />;
    }

    return <>{children}</>;
}
