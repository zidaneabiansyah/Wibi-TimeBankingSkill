'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSessionStore } from '@/stores/session.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { SessionCard } from './components/session-card';
import { SessionFilters } from './components/session-filters';
import type { SessionStatus } from '@/types';

type TabValue = 'all' | 'upcoming' | 'pending' | 'in_progress' | 'completed' | 'cancelled';

export function SessionsClient() {
    const { user } = useAuthStore();
    const {
        sessions,
        isLoading,
        fetchSessions,
        approveSession,
        rejectSession,
        cancelSession
    } = useSessionStore();

    const [activeTab, setActiveTab] = useState<TabValue>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (activeTab === 'all') {
            fetchSessions();
        } else {
            fetchSessions({ status: activeTab as SessionStatus });
        }
    }, [activeTab, fetchSessions]);

    const handleAction = async (action: string, sessionId: number) => {
        try {
            switch (action) {
                case 'approve':
                    await approveSession(sessionId);
                    toast.success('Session approved successfully');
                    break;
                case 'reject':
                    await rejectSession(sessionId, { reason: 'Rejected by teacher' });
                    toast.success('Session rejected');
                    break;
                case 'cancel':
                    await cancelSession(sessionId, { reason: 'Cancelled by user' });
                    toast.success('Session cancelled');
                    break;
            }
            fetchSessions();
        } catch (error) {
            toast.error('Action failed. Please try again.');
        }
    };

    const filteredSessions = sessions.filter(session => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            session.title.toLowerCase().includes(query) ||
            session.teacher?.full_name?.toLowerCase().includes(query) ||
            session.student?.full_name?.toLowerCase().includes(query) ||
            session.user_skill?.skill?.name?.toLowerCase().includes(query)
        );
    });

    return (
        <main className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">My Sessions</h1>
                        <p className="text-muted-foreground">Manage your teaching and learning sessions</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href="/marketplace">
                            <Button variant="outline">Find Skills</Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button>Back to Dashboard</Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <SessionFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Sessions List */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                        ))}
                    </div>
                ) : filteredSessions.length === 0 ? (
                    <EmptyState
                        icon={Calendar}
                        title={`No ${activeTab === 'all' ? '' : activeTab} sessions`}
                        description={
                            activeTab === 'all'
                                ? 'Book a session from the marketplace to get started!'
                                : `No ${activeTab.replace('_', ' ')} sessions`
                        }
                        action={{
                            label: 'Browse Skills',
                            onClick: () => window.location.href = '/marketplace',
                        }}
                        variant="card"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSessions.map((session) => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                currentUserId={user?.id || 0}
                                onAction={handleAction}
                            />
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
