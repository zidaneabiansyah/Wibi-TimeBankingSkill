import type { Metadata } from 'next';
import { ProgressClient } from './progress-client';

export const metadata: Metadata = {
    title: 'Learning Progress - Track Your Growth | Wibi',
    description: 'Track your learning progress across different skills. View completed sessions, achievements, and skill development.',
    keywords: ['learning progress', 'skill tracking', 'achievements', 'growth', 'development'],
};

export default function ProgressPage() {
    return <ProgressClient />;
}
