'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';

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

    // Show loading spinner while hydrating auth state from localStorage
    if (!isHydrated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
