'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAdminStore } from '@/stores/admin.store';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminProtectedRoute } from '@/components/auth/AdminProtectedRoute';
import { cn } from '@/lib/utils';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { loadAdmin } = useAdminStore();

    useEffect(() => {
        loadAdmin();
    }, [loadAdmin]);

    // Check if we're on the login page
    const isLoginPage = pathname === '/admin/login';

    // If we're on the login page, render without sidebar/header
    if (isLoginPage) {
        return (
            <AdminProtectedRoute>
                {children}
            </AdminProtectedRoute>
        );
    }

    // For all other admin pages, render with sidebar and header
    return (
        <AdminProtectedRoute>
            <div className="flex h-screen overflow-hidden bg-muted/10">
                {/* Sidebar */}
                <AdminSidebar
                    isCollapsed={isCollapsed}
                    onToggle={() => setIsCollapsed(!isCollapsed)}
                />

                {/* Main Content */}
                <div
                    className={cn(
                        'flex flex-1 flex-col transition-all duration-300',
                        isCollapsed ? 'ml-16' : 'ml-64'
                    )}
                >
                    {/* Header */}
                    <AdminHeader />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProtectedRoute>
    );
}
