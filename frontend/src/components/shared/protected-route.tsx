'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, loadUser } = useAuthStore();

    useEffect(() => {
        // Load user from localStorage on mount
        loadUser();

        // Redirect to login if not authenticated
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loadUser, router]);

    // Show nothing while checking authentication
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
