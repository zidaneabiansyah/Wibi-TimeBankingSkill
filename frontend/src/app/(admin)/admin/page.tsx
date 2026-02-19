import type { Metadata } from 'next';
import AdminDashboardClient from './admin-dashboard-client';

export const metadata: Metadata = {
    title: 'Admin Dashboard - Platform Overview | Wibi',
    description: 'Admin dashboard for Wibi Time Banking platform. Monitor users, sessions, and platform analytics.',
    keywords: ['admin', 'dashboard', 'analytics', 'platform management'],
};

export default function AdminDashboardPage() {
    return <AdminDashboardClient />;
}
