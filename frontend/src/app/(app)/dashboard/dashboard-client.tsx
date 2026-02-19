'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useSessionStore } from "@/stores/session.store";
import { useBadgeStore } from "@/stores/badge.store";
import { useSkillStore } from "@/stores/skill.store";
import { m } from "framer-motion";
import { StatsCards } from './components/stats-cards';
import { PendingRequests } from './components/pending-requests';
import { UpcomingSessions } from './components/upcoming-sessions';
import { RecentTransactions } from './components/recent-transactions';
import { QuickActions } from './components/quick-actions';
import { LeaderboardSection } from './components/leaderboard-section';
import SessionApprovalModal from "@/components/features/session/SessionApprovalModal";
import type { Session } from "@/types";

export function DashboardClient() {
    const { user } = useAuthStore();
    const { stats, transactions, isLoading: userLoading, fetchStats, fetchTransactions } = useUserStore();
    const {
        upcomingSessions,
        pendingRequests,
        isLoading: sessionLoading,
        fetchUpcomingSessions,
        fetchPendingRequests
    } = useSessionStore();
    const { userBadges, leaderboards, fetchUserBadges, fetchLeaderboard } = useBadgeStore();
    const { skills, fetchSkills } = useSkillStore();

    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Parallel data fetching - all requests happen simultaneously
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                await Promise.all([
                    fetchStats(),
                    fetchTransactions(5, 0),
                    fetchUpcomingSessions(3),
                    fetchPendingRequests(),
                    fetchUserBadges(),
                    fetchSkills({ limit: 4 }),
                    fetchLeaderboard('rating', 5),
                    fetchLeaderboard('sessions', 5),
                ]);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchAllData();
    }, [
        fetchStats,
        fetchTransactions,
        fetchUpcomingSessions,
        fetchPendingRequests,
        fetchUserBadges,
        fetchSkills,
        fetchLeaderboard
    ]);

    const handleOpenApprovalModal = (session: Session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
        fetchPendingRequests().catch(console.error);
    };

    const firstName = user?.full_name?.split(' ')[0] || 'User';

    return (
        <>
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col space-y-8">
                    {/* Welcome Section */}
                    <m.div
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
                            <p className="text-muted-foreground">Here's what's happening with your Time Banking account</p>
                        </div>
                        <QuickActions />
                    </m.div>

                    {/* Stats Cards */}
                    <StatsCards
                        user={user}
                        stats={stats}
                        isLoading={userLoading}
                    />

                    {/* Pending Requests Alert */}
                    {pendingRequests.length > 0 && (
                        <PendingRequests
                            requests={pendingRequests}
                            onReview={handleOpenApprovalModal}
                        />
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Sessions & Transactions */}
                        <div className="lg:col-span-2 space-y-8">
                            <UpcomingSessions
                                sessions={upcomingSessions}
                                isLoading={sessionLoading}
                            />

                            <RecentTransactions
                                transactions={transactions}
                                isLoading={userLoading}
                            />
                        </div>

                        {/* Right Column - Leaderboard & Quick Stats */}
                        <div className="space-y-8">
                            <LeaderboardSection
                                leaderboards={leaderboards}
                                userBadges={userBadges}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Modals */}
            {selectedSession && (
                <SessionApprovalModal
                    session={selectedSession}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
}
