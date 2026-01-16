'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout";
import { ProtectedRoute } from "@/components/auth";
import { TimeCreditsDisplay } from "@/components/ui/time-credits-display";
import { SessionCard } from "@/components/ui/session-card";
import { useAuthStore } from "@/stores/auth.store";
import { useUserStore } from "@/stores/user.store";
import { useSessionStore } from "@/stores/session.store";
import { useBadgeStore } from "@/stores/badge.store";
import { useSkillStore } from "@/stores/skill.store";
import { LeaderboardCard } from "@/components/dashboard/LeaderboardCard";
import SessionApprovalModal from "@/components/session/SessionApprovalModal";
import TransactionDetailModal from "@/components/transaction/TransactionDetailModal";
import { LoadingSpinner, LoadingSkeleton } from "@/components/ui/loading";
import { EmptyState } from "@/components/ui/empty-state";
import { m } from "framer-motion";
import { Calendar, Award, Receipt, Zap, TrendingUp, Users, Star, Info, PlayCircle } from "lucide-react";
import { getSessionCreditStatus } from '@/lib/utils/session-status';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Transaction, Session, Skill } from "@/types";

// Format date
function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

// Get transaction type display
function getTransactionTypeColor(type: string): string {
    switch (type) {
        case 'earned':
        case 'initial':
        case 'bonus':
            return 'text-green-500';
        case 'spent':
        case 'hold':
            return 'text-red-500';
        case 'refund':
            return 'text-blue-500';
        default:
            return '';
    }
}

function DashboardContent() {
    const { user } = useAuthStore();
    const { stats, transactions, isLoading, fetchStats, fetchTransactions } = useUserStore();
    const { upcomingSessions, pendingRequests, fetchUpcomingSessions, fetchPendingRequests } = useSessionStore();
    const { userBadges, fetchUserBadges, leaderboards, fetchLeaderboard } = useBadgeStore();
    const { skills, fetchSkills } = useSkillStore();
    const [selectedSession, setSelectedSession] = useState<Session | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    useEffect(() => {
        fetchStats().catch(console.error);
        fetchTransactions(5, 0).catch(console.error);
        fetchUpcomingSessions(3).catch(console.error);
        fetchPendingRequests().catch(console.error);
        fetchUserBadges().catch(console.error);
        fetchUserBadges().catch(console.error);
        fetchSkills({ limit: 4 }).catch(console.error);
        fetchLeaderboard('rating', 5).catch(console.error);
        fetchLeaderboard('sessions', 5).catch(console.error);
    }, [fetchStats, fetchTransactions, fetchUpcomingSessions, fetchPendingRequests, fetchUserBadges, fetchSkills, fetchLeaderboard]);

    const handleOpenApprovalModal = (session: Session) => {
        setSelectedSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedSession(null);
        // Refresh pending requests
        fetchPendingRequests().catch(console.error);
    };

    const firstName = user?.full_name?.split(' ')[0] || 'User';
    return (
        <div className="min-h-screen bg-background">
            <Header />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col space-y-8">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Welcome back, {firstName}!</h1>
                            <p className="text-muted-foreground">Here's what's happening with your Time Banking account</p>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/marketplace">
                                <Button variant="outline">Find Skills</Button>
                            </Link>
                            <Link href="/profile/skills/new">
                                <Button>Add New Skill</Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Cards - Animated Grid */}
                    <m.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.08,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {/* Credit Balance Card */}
                        <m.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Zap className="h-4 w-4 text-secondary" />
                                        Credit Balance
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <LoadingSkeleton className="h-9 w-20" />
                                    ) : (
                                        <div>
                                            <div className="text-3xl font-bold text-primary">
                                                {((user?.credit_balance || 0) - (user?.credit_held || 0)).toFixed(1)}
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2 text-xs">
                                                <p className="text-muted-foreground">Available credits</p>
                                                {(user?.credit_held || 0) > 0 && (
                                                    <p className="text-secondary font-medium flex items-center gap-1">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                                                        {user?.credit_held?.toFixed(1)} held in escrow
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </m.div>

                        {/* Sessions as Teacher */}
                        <m.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Users className="h-4 w-4 text-secondary" />
                                        Teaching
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <LoadingSkeleton className="h-9 w-16" />
                                    ) : (
                                        <div>
                                            <div className="text-3xl font-bold text-primary">
                                                {stats?.total_sessions_as_teacher || 0}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                {isLoading ? (
                                                    <LoadingSkeleton className="h-3 w-24" />
                                                ) : (
                                                    `${stats?.total_credits_earned?.toFixed(1) || '0.0'} credits earned`
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </m.div>

                        {/* Sessions as Student */}
                        <m.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <Card className="border-border/40 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <TrendingUp className="h-4 w-4 text-secondary" />
                                        Learning
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <LoadingSkeleton className="h-9 w-16" />
                                    ) : (
                                        <div>
                                            <div className="text-3xl font-bold text-primary">
                                                {stats?.total_sessions_as_student || 0}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-2">
                                                {isLoading ? (
                                                    <LoadingSkeleton className="h-3 w-24" />
                                                ) : (
                                                    `${stats?.total_credits_spent?.toFixed(1) || '0.0'} credits spent`
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </m.div>

                        {/* Average Rating */}
                        <m.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <Card className="border-border/40 hover:border-secondary/40 hover:shadow-lg hover:shadow-secondary/10 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                        <Star className="h-4 w-4 text-secondary fill-secondary" />
                                        Your Rating
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <LoadingSkeleton className="h-9 w-12" />
                                    ) : (
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-3xl font-bold text-secondary">
                                                    {stats?.average_rating_as_teacher?.toFixed(1) || 'N/A'}
                                                </div>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-2">As teacher</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </m.div>
                    </m.div>

                    {/* Pending Requests Alert */}
                    {pendingRequests.length > 0 && (
                        <m.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="border-secondary/30 bg-linear-to-br from-secondary/5 to-transparent hover:border-secondary/50 transition-all duration-300">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                        </svg>
                                        {pendingRequests.length} Pending Request{pendingRequests.length > 1 ? 's' : ''}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <p className="text-sm text-muted-foreground">Students are waiting for your approval</p>
                                    <div className="space-y-2">
                                        {pendingRequests.slice(0, 3).map((session: Session) => (
                                            <m.div
                                                key={session.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex items-center justify-between p-3 bg-muted/30 border border-border/20 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{session.student?.full_name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">{session.title}</p>
                                                </div>
                                                <Button size="sm" className="ml-2 bg-primary hover:bg-primary/90" onClick={() => handleOpenApprovalModal(session)}>
                                                    Review
                                                </Button>
                                            </m.div>
                                        ))}
                                    </div>
                                    {pendingRequests.length > 3 && (
                                        <Link href="/dashboard/sessions">
                                            <Button size="sm" variant="ghost" className="w-full text-primary hover:text-primary/80">
                                                View All ({pendingRequests.length}) →
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        </m.div>
                    )}

                    {/* Upcoming Sessions */}
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-2xl font-bold">Upcoming Sessions</h2>
                                <p className="text-sm text-muted-foreground mt-1">Your scheduled learning and teaching sessions</p>
                            </div>
                            <Link href="/dashboard/sessions">
                                <Button variant="outline" className="border-border/40 hover:border-primary/50">View All</Button>
                            </Link>
                        </div>
                        {upcomingSessions.length === 0 ? (
                            <EmptyState
                                icon={Calendar}
                                title="No upcoming sessions"
                                description="Book a session from the marketplace to get started!"
                                action={{
                                    label: 'Browse Skills',
                                    onClick: () => window.location.href = '/marketplace',
                                }}
                                variant="card"
                            />
                        ) : (
                            <m.div 
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.1 }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.08,
                                        },
                                    },
                                }}
                            >
                                {upcomingSessions.map((session: Session) => (
                                    <m.div
                                        key={session.id}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                                        }}
                                    >
                                        <Link href={session.status === 'in_progress' ? `/dashboard/sessions/${session.id}/room` : `/dashboard/sessions`}>
                                            <Card className={`h-full border-border/30 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                                                session.status === 'in_progress' 
                                                    ? 'border-primary/50 shadow-md shadow-primary/5 bg-primary/5' 
                                                    : 'hover:border-primary/40 hover:shadow-primary/10'
                                            }`}>
                                                <CardHeader className="pb-4">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <CardTitle className={`text-lg transition-colors truncate ${
                                                                    session.status === 'in_progress' ? 'text-primary' : 'group-hover:text-primary'
                                                                }`}>
                                                                    {session.title}
                                                                </CardTitle>
                                                                {session.status === 'in_progress' && (
                                                                    <div className="flex items-center gap-1">
                                                                        <span className="relative flex h-2 w-2">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                                        </span>
                                                                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">Live</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <CardDescription className="text-xs">
                                                                {session.scheduled_at ? formatDate(session.scheduled_at) : 'Not scheduled'}
                                                            </CardDescription>
                                                        </div>
                                                         <div className="flex flex-col items-end gap-1 shrink-0">
                                                            <Badge 
                                                                variant={session.status === 'in_progress' ? 'default' : 'outline'} 
                                                                className="capitalize border-border/50"
                                                            >
                                                                {session.status.replace('_', ' ')}
                                                            </Badge>
                                                            {session.credit_held && (
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Badge 
                                                                                variant={getSessionCreditStatus(session, user?.id || 0).variant}
                                                                                className="text-[10px] py-0 h-4 cursor-help flex items-center gap-0.5"
                                                                            >
                                                                                {getSessionCreditStatus(session, user?.id || 0).label}
                                                                                <Info className="h-2.5 w-2.5" />
                                                                            </Badge>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p className="text-xs">{getSessionCreditStatus(session, user?.id || 0).description}</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-3">
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className={`h-4 w-4 ${session.status === 'in_progress' ? 'text-primary' : 'text-secondary'}`} />
                                                        <span>{session.duration} hour{session.duration !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Users className={`h-4 w-4 ${session.status === 'in_progress' ? 'text-primary' : 'text-secondary'}`} />
                                                        <span className="truncate">
                                                            {session.teacher_id === user?.id 
                                                                ? `Teaching ${session.student?.full_name || 'Student'}`
                                                                : `Learning from ${session.teacher?.full_name || 'Teacher'}`}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="pt-0">
                                                    <Button 
                                                        variant={session.status === 'in_progress' ? 'default' : 'outline'} 
                                                        size="sm" 
                                                        className={`w-full transition-all ${
                                                            session.status === 'in_progress'
                                                                ? 'shadow-lg shadow-primary/20 hover:scale-[1.02]'
                                                                : 'border-border/40 hover:border-primary/50 group-hover:bg-primary/5'
                                                        }`}
                                                    >
                                                        {session.status === 'in_progress' ? (
                                                            <span className="flex items-center gap-1.5 font-bold">
                                                                <PlayCircle className="h-4 w-4" />
                                                                Join Room NOW
                                                            </span>
                                                        ) : (
                                                            "View Details →"
                                                        )}
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        </Link>
                                    </m.div>
                                ))}
                            </m.div>
                        )}
                    </m.div>

    {/* Leaderboard Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Top Rated Teachers</h2>
                            <Link href="/community#leaderboard">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <LeaderboardCard
                                title="Highest Rated"
                                valueLabel="Rating"
                                entries={leaderboards['rating']?.slice(0, 5).map((entry, index) => ({
                                    ...entry,
                                    rank: entry.rank || index + 1,
                                    user: {
                                        id: entry.user_id,
                                        name: entry.full_name,
                                        username: entry.username,
                                        avatar: entry.avatar
                                    },
                                    value: entry.score
                                })) || []}
                                onTimeRangeChange={(range) => fetchLeaderboard('rating', 5, range)}
                            />
                            <LeaderboardCard
                                title="Most Active"
                                valueLabel="Sessions"
                                entries={leaderboards['sessions']?.slice(0, 5).map((entry, index) => ({
                                    ...entry,
                                    rank: entry.rank || index + 1,
                                    user: {
                                        id: entry.user_id,
                                        name: entry.full_name,
                                        username: entry.username,
                                        avatar: entry.avatar
                                    },
                                    value: entry.score
                                })) || []}
                                icon={<Calendar className="h-4 w-4" />}
                                onTimeRangeChange={(range) => fetchLeaderboard('sessions', 5, range)}
                            />
                        </div>
                    </div>

                    {/* Recommended Skills */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Recommended for You</h2>
                            <Link href="/marketplace">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {skills.slice(0, 4).map((skill: Skill) => (
                                    <Card key={skill.id} className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                                    <div className="h-32 bg-muted flex items-center justify-center text-4xl">
                                        {skill.icon || '📚'}
                                    </div>
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base line-clamp-1">{skill.name}</CardTitle>
                                            <Badge variant="secondary" className="text-xs">{skill.category}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                            {skill.description || 'No description available'}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>{skill.total_teachers || 0} Tutors</span>
                                            <span>{skill.total_learners || 0} Learners</span>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <Link href={`/marketplace/${skill.id}`} className="w-full">
                                            <Button variant="outline" size="sm" className="w-full">View Details</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Transaction History</h2>
                            <Link href="/dashboard/transactions">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        <Card>
                            <CardContent className="p-0">
                                {isLoading ? (
                                    <div className="p-8 text-center">
                                        <LoadingSpinner size="lg" />
                                        <p className="mt-2 text-muted-foreground">Loading transactions...</p>
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <EmptyState
                                        icon={Receipt}
                                        title="No transactions yet"
                                        description="Your transaction history will appear here."
                                        variant="compact"
                                    />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left p-4">Date</th>
                                                    <th className="text-left p-4">Description</th>
                                                    <th className="text-right p-4">Amount</th>
                                                    <th className="text-right p-4">Balance</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transactions.map((transaction: Transaction) => (
                                                    <tr 
                                                        key={transaction.id} 
                                                        className="border-b last:border-0 hover:bg-muted/50 cursor-pointer transition-colors duration-150"
                                                        onClick={() => {
                                                            setSelectedTransaction(transaction);
                                                            setIsTransactionModalOpen(true);
                                                        }}
                                                    >
                                                        <td className="p-4">{formatDate(transaction.created_at)}</td>
                                                        <td className="p-4">{transaction.description}</td>
                                                        <td className={`p-4 text-right ${getTransactionTypeColor(transaction.type)}`}>
                                                            {transaction.amount > 0 ? `+${transaction.amount.toFixed(1)}` : transaction.amount.toFixed(1)}
                                                        </td>
                                                        <td className="p-4 text-right font-medium">{transaction.balance_after.toFixed(1)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Badges */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Your Badges</h2>
                            <Link href="/profile">
                                <Button variant="ghost" size="sm">View All</Button>
                            </Link>
                        </div>
                        {userBadges.length === 0 ? (
                            <EmptyState
                                icon={Award}
                                title="No badges yet"
                                description="Complete sessions and achievements to earn badges!"
                                variant="card"
                            />
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                {userBadges.slice(0, 6).map((userBadge: any) => (
                                    <div key={userBadge.id} className="flex flex-col items-center">
                                        <div 
                                            className={`h-16 w-16 rounded-full flex items-center justify-center text-2xl ${userBadge.is_pinned ? 'ring-2 ring-yellow-400' : ''}`}
                                            style={{ backgroundColor: userBadge.badge?.color || '#e5e7eb' }}
                                        >
                                            {userBadge.badge?.icon || '🏆'}
                                        </div>
                                        <span className="text-sm font-medium mt-2 text-center">{userBadge.badge?.name}</span>
                                        <Badge className="mt-1 text-xs">{userBadge.badge?.type}</Badge>
                                    </div>
                                ))}
                                {userBadges.length > 6 && (
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                            <span className="text-sm font-medium">+{userBadges.length - 6}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-2">More badges</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Session Approval Modal */}
            <SessionApprovalModal
                session={selectedSession}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onApproved={handleCloseModal}
            />

            {/* Transaction Detail Modal */}
            <TransactionDetailModal
                transaction={selectedTransaction}
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}
