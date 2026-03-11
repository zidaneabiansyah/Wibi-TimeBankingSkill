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
import { m, AnimatePresence } from 'framer-motion';

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
        <main className="container mx-auto px-6 py-12 max-w-7xl" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <div className="flex flex-col">
                {/* Header Section */}
                <m.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
                >
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-1 w-8 bg-primary rounded-full" />
                            <span className="text-xs font-bold uppercase tracking-widest text-primary/80">Schedule Manager</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                            My Sessions
                        </h1>
                        <p className="text-muted-foreground mt-3 text-lg max-w-2xl leading-relaxed">
                            Organize your teaching commitments and learning journey in one place.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <Link href="/marketplace" className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full rounded-2xl px-6 h-12 font-semibold border-border/60 hover:bg-muted/50 transition-all">
                                Explore Skills
                            </Button>
                        </Link>
                        <Link href="/dashboard" className="w-full sm:w-auto">
                            <Button className="w-full rounded-2xl px-6 h-12 bg-card hover:bg-muted border border-border/40 text-foreground font-semibold shadow-sm transition-all">
                                Dashboard
                            </Button>
                        </Link>
                    </div>
                </m.div>

                {/* Filters & Tabs Section */}
                <div className="flex flex-col items-center gap-10 mb-16">
                    <SessionFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                    />

                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)} className="w-full max-w-5xl">
                        <TabsList className="flex h-16 w-full p-2 bg-card/20 backdrop-blur-3xl border border-border/20 rounded-full shadow-2xl shadow-black/10 overflow-x-auto no-scrollbar">
                            {['all', 'upcoming', 'pending', 'in_progress', 'completed', 'cancelled'].map((tab) => (
                                <TabsTrigger
                                    key={tab}
                                    value={tab}
                                    className="flex-1 min-w-[120px] rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all duration-500 data-[state=active]:bg-linear-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] data-[state=inactive]:hover:bg-muted/30"
                                >
                                    {tab.replace('_', ' ')}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>

                {/* Sessions Content */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-80 bg-card/30 border border-border/30 rounded-[2.5rem] animate-pulse" />
                            ))}
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <m.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <EmptyState
                                icon={Calendar}
                                title={`${activeTab === 'all' ? 'No Sessions Found' : 'No ' + activeTab.replace('_', ' ') + ' sessions'}`}
                                description={
                                    activeTab === 'all'
                                        ? 'Start your learning journey by booking a session with a mentor from the marketplace!'
                                        : `You don't have any ${activeTab.replace('_', ' ')} sessions at the moment.`
                                }
                                action={{
                                    label: 'Browse Marketplace',
                                    onClick: () => window.location.href = '/marketplace',
                                }}
                                variant="card"
                            />
                        </m.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence mode="popLayout">
                                {filteredSessions.map((session, index) => (
                                    <m.div
                                        key={session.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                                    >
                                        <SessionCard
                                            session={session}
                                            currentUserId={user?.id || 0}
                                            onAction={handleAction}
                                        />
                                    </m.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </m.div>
            </div>
        </main>
    );
}

