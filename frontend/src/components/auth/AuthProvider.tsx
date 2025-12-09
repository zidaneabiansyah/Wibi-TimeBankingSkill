'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const { loadUser, isAuthenticated } = useAuthStore();
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load user from localStorage on mount
        console.log('🔐 AuthProvider: Loading user from localStorage...');
        loadUser();
        setIsInitialized(true);
        console.log('🔐 AuthProvider: Initialized. Authenticated:', isAuthenticated);
    }, []);

    // Show nothing while initializing to prevent flash
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{children}</>;
}
