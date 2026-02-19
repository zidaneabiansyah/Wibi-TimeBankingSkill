import type { Metadata } from 'next';
import { DashboardClient } from './dashboard-client';

export const metadata: Metadata = {
    title: 'Dashboard - Your Learning Hub | Wibi',
    description: 'View your time banking dashboard. Track credits, sessions, progress, and connect with the community.',
    keywords: ['dashboard', 'my account', 'time credits', 'sessions', 'learning progress'],
};

// Server Component - handles metadata and initial setup
export default async function DashboardPage() {
    // TODO: Fetch initial data server-side for better performance
    // const initialData = await fetchDashboardData();

    return <DashboardClient />;
}
