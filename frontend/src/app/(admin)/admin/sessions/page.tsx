import type { Metadata } from 'next';
import SessionsClient from './sessions-client';

export const metadata: Metadata = {
    title: 'Session Management - Admin Panel | Wibi',
    description: 'Monitor and manage all learning sessions. Approve, reject, or resolve disputed sessions.',
    keywords: ['admin', 'sessions', 'session management', 'disputes'],
};

export default function SessionsPage() {
    return <SessionsClient />;
}
