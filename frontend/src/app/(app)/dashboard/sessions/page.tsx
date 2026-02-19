import type { Metadata } from 'next';
import { SessionsClient } from './sessions-client';

export const metadata: Metadata = {
    title: 'My Sessions - Manage Your Learning | Wibi',
    description: 'View and manage your teaching and learning sessions. Track upcoming, completed, and pending sessions.',
    keywords: ['sessions', 'my sessions', 'teaching sessions', 'learning sessions', 'time banking'],
};

export default function SessionsPage() {
    return <SessionsClient />;
}
