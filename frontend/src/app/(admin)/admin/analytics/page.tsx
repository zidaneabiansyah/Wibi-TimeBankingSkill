import type { Metadata } from 'next';
import AnalyticsClient from './analytics-client';

export const metadata: Metadata = {
    title: 'Analytics & Reports - Admin Panel | Wibi',
    description: 'Comprehensive platform insights and performance metrics. View user growth, session trends, and credit flow.',
    keywords: ['admin', 'analytics', 'reports', 'metrics', 'insights'],
};

export default function AnalyticsPage() {
    return <AnalyticsClient />;
}
