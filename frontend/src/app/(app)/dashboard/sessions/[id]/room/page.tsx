'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { useSessionStore } from '@/stores/session.store';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';
import type { Session } from '@/types';
import { CheckCircle2, Clock, Users, Video, MapPin, ExternalLink, Timer, AlertCircle, PenTool, LayoutDashboard, Info, AlertTriangle, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewDialog from '@/components/features/review/ReviewDialog';
import dynamic from 'next/dynamic';
import { sessionService } from '@/lib/services/session.service';

const ClassroomLayout = dynamic(
    () => import('@/components/features/classroom/ClassroomLayout').then(mod => mod.ClassroomLayout),
    {
        ssr: false, loading: () => (
            <div className="h-150 flex items-center justify-center animate-pulse bg-muted rounded-lg border border-dashed">
                <div className="text-center">
                    <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p>Loading Classroom View...</p>
                </div>
            </div>
        )
    }
);

/**
 * SessionTimer - Real-time timer component for active sessions
 * Shows elapsed time since session started
 */
function SessionTimer({ startedAt, duration }: { startedAt: string | null; duration: number }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!startedAt) return;

        const startTime = new Date(startedAt).getTime();

        const updateElapsed = () => {
            const now = Date.now();
            const elapsedMs = now - startTime;
            setElapsed(Math.floor(elapsedMs / 1000));
        };

        updateElapsed();
        const interval = setInterval(updateElapsed, 1000);

        return () => clearInterval(interval);
    }, [startedAt]);

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed % 3600) / 60);
    const seconds = elapsed % 60;

    const plannedDurationSeconds = duration * 3600;
    const progressPercent = Math.min((elapsed / plannedDurationSeconds) * 100, 100);
    const isOvertime = elapsed > plannedDurationSeconds;

    const formatTime = (h: number, m: number, s: number) => {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Card className={`border shadow-sm overflow-hidden bg-card ${isOvertime ? 'border-yellow-500/30 bg-yellow-50/30 dark:bg-yellow-950/10' : 'border-orange-500/20 bg-orange-50/30 dark:bg-orange-950/10'}`}>
            <CardHeader className="pb-2 border-b border-border/50 bg-background/50">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${isOvertime ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/40'}`}>
                        <Timer className="h-4 w-4" />
                    </div>
                    Session Timer
                    {isOvertime && <Badge variant="outline" className="text-yellow-500 border-yellow-500 ml-auto bg-background">Overtime</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-6 bg-background/30">
                <div className="text-center">
                    <div className={`text-4xl font-mono tracking-tight font-medium ${isOvertime ? 'text-yellow-600 dark:text-yellow-500' : 'text-orange-600 dark:text-orange-500'}`}>
                        {formatTime(hours, minutes, seconds)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {duration} hour{duration !== 1 ? 's' : ''} planned
                    </p>
                </div>
                <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                        <span>Progress</span>
                        <span>{progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden border border-border/50">
                        <div
                            className={`h-full transition-all duration-300 ${isOvertime ? 'bg-yellow-500' : 'bg-orange-500'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * CheckInStatus - Shows check-in status for both participants
 */
function CheckInStatus({ session, currentUserId }: { session: Session; currentUserId: number }) {
    const isTeacher = session.teacher_id === currentUserId;
    const myCheckIn = isTeacher ? session.teacher_checked_in : session.student_checked_in;
    const partnerCheckIn = isTeacher ? session.student_checked_in : session.teacher_checked_in;
    const partnerName = isTeacher ? session.student?.full_name : session.teacher?.full_name;

    return (
        <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${myCheckIn ? 'bg-green-50/50 dark:bg-green-950/20 border-green-500/20' : 'bg-card border-border/50'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${myCheckIn ? 'bg-green-100 text-green-600 dark:bg-green-900/50' : 'bg-muted text-muted-foreground'}`}>
                        {myCheckIn ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                        <span className="font-semibold text-sm block">You</span>
                        <span className="text-[10px] text-muted-foreground">{isTeacher ? 'Teacher' : 'Student'}</span>
                    </div>
                </div>
                {myCheckIn ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none shadow-none">
                        Checked In
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground bg-background shadow-none">
                        Waiting
                    </Badge>
                )}
            </div>

            <div className={`flex items-center justify-between p-3 rounded-lg border shadow-sm ${partnerCheckIn ? 'bg-green-50/50 dark:bg-green-950/20 border-green-500/20' : 'bg-card border-border/50'}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${partnerCheckIn ? 'bg-green-100 text-green-600 dark:bg-green-900/50' : 'bg-muted text-muted-foreground'}`}>
                        {partnerCheckIn ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                        <span className="font-semibold text-sm block truncate max-w-[100px]">{partnerName || 'Partner'}</span>
                        <span className="text-[10px] text-muted-foreground">{!isTeacher ? 'Teacher' : 'Student'}</span>
                    </div>
                </div>
                {partnerCheckIn ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none shadow-none">
                        Checked In
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground bg-background shadow-none">
                        Waiting
                    </Badge>
                )}
            </div>
        </div>
    );
}

function SessionRoomContent() {
    const params = useParams();
    const router = useRouter();
    const sessionId = Number(params.id);
    const { user } = useAuthStore();
    const { currentSession, fetchSession, checkIn, confirmCompletion, isLoading } = useSessionStore();

    const [isCheckingIn, setIsCheckingIn] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);


    // Fetch session on mount and poll for updates
    useEffect(() => {
        if (sessionId) {
            fetchSession(sessionId);

            // Poll every 5 seconds to get partner's check-in status
            const interval = setInterval(() => {
                fetchSession(sessionId);
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [sessionId, fetchSession]);

    const handleCheckIn = async () => {
        try {
            setIsCheckingIn(true);
            await checkIn(sessionId);
            toast.success('Checked in successfully!');
            await fetchSession(sessionId);
        } catch (error: any) {
            toast.error(error.message || 'Failed to check in');
        } finally {
            setIsCheckingIn(false);
        }
    };

    const handleComplete = async () => {
        try {
            setIsCompleting(true);
            await confirmCompletion(sessionId);
            toast.success('Completion confirmed!');
            await fetchSession(sessionId);
        } catch (error: any) {
            toast.error(error.message || 'Failed to confirm completion');
        } finally {
            setIsCompleting(false);
        }
    };


    if (!currentSession || !user) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <Card>
                        <CardContent className="py-12 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading session...</p>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    const isTeacher = currentSession.teacher_id === user.id;
    const myCheckIn = isTeacher ? currentSession.teacher_checked_in : currentSession.student_checked_in;
    const bothCheckedIn = currentSession.teacher_checked_in && currentSession.student_checked_in;
    const sessionInProgress = currentSession.status === 'in_progress';
    const myConfirmation = isTeacher ? currentSession.teacher_confirmed : currentSession.student_confirmed;

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/dashboard/sessions" className="hover:underline">My Sessions</Link>
                        <span>/</span>
                        <span>Session Room</span>
                    </div>

                    {/* Header removed from here to reduce redundancy with workspace header */}

                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:w-75">
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="classroom" disabled={!sessionInProgress && currentSession.status !== 'completed'}>
                                Classroom
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="classroom" className="mt-6">
                            <ClassroomLayout 
                                sessionId={sessionId} 
                                onLeave={() => router.push('/dashboard/sessions')}
                            />
                        </TabsContent>

                        <TabsContent value="details" className="mt-6">
                            {/* Workspace Header (Moved above columns to ensure perfect vertical alignment between Left and Right columns) */}
                            <div className="pb-6">
                                <h2 className="text-3xl font-semibold text-foreground tracking-tight">{currentSession.title}</h2>
                                <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground font-medium">
                                    <Badge
                                        variant="secondary"
                                        className={`
                                            capitalize px-2.5 py-0.5 text-xs rounded-full border leading-tight shadow-sm
                                            ${sessionInProgress ? 'bg-green-50 text-green-700 border-green-200/60 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 shadow-green-500/10' :
                                            currentSession.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 shadow-blue-500/10' :
                                            currentSession.status === 'completed' ? 'bg-orange-50 text-orange-700 border-orange-200/60 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20 shadow-orange-500/10' : 'bg-yellow-50 text-yellow-700 border-yellow-200/60 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20 shadow-yellow-500/10'}
                                        `}
                                    >
                                        {sessionInProgress && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 -ml-0.5 animate-pulse inline-block align-middle mb-[1px]" />}
                                        {currentSession.status.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span>{currentSession.user_skill?.skill?.name || 'Session'}</span>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span className="font-mono text-[11px] mt-0.5 text-muted-foreground/70">ID: #{currentSession.id}</span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Workspace */}
                                <div className="lg:col-span-2 space-y-8">

                                    {/* Top Cards Row: Timer & Status */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Status / Check-in / Complete (Always show one depending on state) */}
                                        {!sessionInProgress && currentSession.status === 'approved' && (
                                            <Card className="border shadow-sm">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                                        <Users className="h-4 w-4 text-orange-500" />
                                                        Waiting for partner
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <CheckInStatus session={currentSession} currentUserId={user.id} />
                                                    <div className="mt-4">
                                                        {!myCheckIn ? (
                                                            <Button
                                                                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                                                                onClick={handleCheckIn}
                                                                disabled={isCheckingIn}
                                                            >
                                                                {isCheckingIn ? 'Checking in...' : 'Check In Now'}
                                                            </Button>
                                                        ) : !bothCheckedIn ? (
                                                            <div className="flex items-center justify-center p-2 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/30 font-medium text-sm">
                                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                                Waiting for partner...
                                                            </div>
                                                        ) : null}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {sessionInProgress && (
                                            <Card className="border shadow-sm">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4 text-orange-500" />
                                                        Complete Session
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">Your confirmation</span>
                                                            {myConfirmation ? (
                                                                <Badge className="bg-green-500/10 text-green-600 border-none hover:bg-green-500/10">Confirmed</Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="bg-muted text-muted-foreground">Pending</Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-medium">Partner confirmation</span>
                                                            {(isTeacher ? currentSession.student_confirmed : currentSession.teacher_confirmed) ? (
                                                                <Badge className="bg-green-500/10 text-green-600 border-none hover:bg-green-500/10">Confirmed</Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="bg-muted text-muted-foreground">Pending</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4">
                                                        {!myConfirmation ? (
                                                            <Button
                                                                className="w-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                                                                onClick={handleComplete}
                                                                disabled={isCompleting}
                                                            >
                                                                {isCompleting ? 'Confirming...' : 'Mark Completed'}
                                                            </Button>
                                                        ) : (
                                                            <div className="flex items-center justify-center p-2 rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950/30 font-medium text-sm">
                                                                Waiting for partner...
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {currentSession.status === 'completed' && (
                                            <Card className="border-green-500/30 bg-green-50/50 dark:bg-green-950/20 shadow-sm col-span-1 md:col-span-2">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-base font-semibold text-green-600 flex items-center gap-2">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Session Completed
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-foreground">
                                                        This session was successfully completed. <span className="font-semibold text-orange-500">{currentSession.credit_amount} 💎</span> credits were transferred.
                                                    </p>
                                                    <div className="mt-4 flex gap-3">
                                                        <Link href="/dashboard/sessions">
                                                            <Button variant="outline" size="sm" className="bg-white dark:bg-background border-border">Back to Sessions</Button>
                                                        </Link>
                                                        {!isTeacher && (
                                                            <ReviewDialog 
                                                                session={currentSession}
                                                                trigger={
                                                                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white shadow-[0_4px_10px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_15px_rgba(249,115,22,0.4)]">
                                                                        Leave a Review
                                                                    </Button>
                                                                }
                                                            />
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Timer Component */}
                                        {sessionInProgress && (
                                            <SessionTimer
                                                startedAt={currentSession.started_at}
                                                duration={currentSession.duration}
                                            />
                                        )}
                                        {/* Show empty placeholder if only Checkin card is visible so it aligns nicely if needed, but grid handles it */}
                                    </div>

                                    {/* Session Details & Materials Section */}
                                    <div className="pt-2">
                                        <h3 className="text-xl font-bold text-foreground mb-4">Session Details & Materials</h3>
                                        <Card className="border shadow-sm overflow-hidden bg-card hover:border-orange-500/30 transition-colors">
                                            {/* Top Banner / Summary Segment */}
                                            <div className="bg-orange-50/50 dark:bg-orange-950/20 p-5 md:p-6 border-b border-orange-500/10 flex flex-col md:flex-row items-start md:items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 flex items-center justify-center shrink-0 shadow-sm border border-orange-200 dark:border-orange-800">
                                                    <LayoutDashboard className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground text-lg mb-1 truncate">{currentSession.title}</p>
                                                    <p className="text-xs font-medium text-muted-foreground truncate flex items-center gap-2">
                                                        <span>{currentSession.user_skill?.skill?.name || 'Skill Category'}</span>
                                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                                                        <span className="capitalize text-orange-600 dark:text-orange-400 font-semibold">{currentSession.mode}</span>
                                                    </p>
                                                </div>
                                                <div className="flex flex-row md:flex-col gap-3 shrink-0">
                                                    <div className="bg-background rounded-lg px-3 py-1.5 border border-border shadow-sm text-center">
                                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Duration</p>
                                                        <p className="text-sm font-bold text-foreground">{currentSession.duration}h</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Description & DB Bindings Segment */}
                                            <div className="p-5 md:p-6 space-y-6">
                                                {/* Description */}
                                                {currentSession.description && (
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                                                        <p className="text-sm text-foreground leading-relaxed">
                                                            {currentSession.description}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                                    {/* Materials */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                            <PenTool className="h-3 w-3" /> Materials
                                                        </h4>
                                                        {currentSession.materials ? (
                                                            <div className="bg-orange-50/30 dark:bg-orange-950/10 rounded-lg p-3 border border-orange-500/20 text-sm text-foreground leading-relaxed h-full">
                                                                {currentSession.materials}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground italic h-full flex flex-col justify-center">
                                                                No specific materials listed.
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Notes */}
                                                    <div>
                                                        <h4 className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                            <AlertCircle className="h-3 w-3" /> Notes
                                                        </h4>
                                                        {currentSession.notes ? (
                                                            <div className="bg-orange-50/30 dark:bg-orange-950/10 rounded-lg p-3 border border-orange-500/20 text-sm text-foreground leading-relaxed h-full">
                                                                {currentSession.notes}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground italic h-full flex flex-col justify-center">
                                                                No additional notes provided.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    {/* Participants Section */}
                                    <div className="pt-2">
                                        <h3 className="text-xl font-bold text-foreground mb-4">Participants</h3>
                                        <Card className="border border-border/50 shadow-md bg-card overflow-hidden transition-colors rounded-2xl">
                                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                                {/* Teacher Avatar Card */}
                                                <div className="p-5 flex items-center gap-4 hover:bg-orange-50/30 dark:hover:bg-orange-950/10 transition-colors">
                                                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400 flex items-center justify-center shrink-0 border border-orange-200 dark:border-orange-800">
                                                        <span className="font-bold text-lg">
                                                            {currentSession.teacher?.full_name?.charAt(0).toUpperCase() || 'T'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="font-semibold text-sm truncate text-foreground">
                                                                {currentSession.teacher?.full_name || 'Teacher'}
                                                            </p>
                                                            {isTeacher && <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 border-none text-[9px] uppercase px-1.5 py-0 h-4 absolute top-4 right-4">You</Badge>}
                                                        </div>
                                                        <p className="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Teacher</p>
                                                    </div>
                                                </div>

                                                {/* Student Avatar Card */}
                                                <div className="p-5 flex items-center gap-4 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-colors">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                                                        <span className="font-bold text-lg">
                                                            {currentSession.student?.full_name?.charAt(0).toUpperCase() || 'S'}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="font-semibold text-sm truncate text-foreground">
                                                                {currentSession.student?.full_name || 'Student'}
                                                            </p>
                                                            {!isTeacher && <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border-none text-[9px] uppercase px-1.5 py-0 h-4 absolute top-4 right-4">You</Badge>}
                                                        </div>
                                                        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">Student</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </div>

                                {/* Right Column - Sidebar */}
                                <div className="lg:col-span-1 space-y-8">
                                    {/* Schedule Card (List View) */}
                                    <div className="bg-card border border-border/50 shadow-sm rounded-[24px] p-6 space-y-5">
                                        <h3 className="text-xl font-bold text-foreground">Schedule</h3>
                                        <div className="space-y-2">
                                            <div className="flex bg-secondary/30 hover:bg-secondary/50 transition-colors rounded-[16px] p-3 pl-3.5 pr-4 group">
                                                <div className="w-1.5 rounded-full bg-blue-400 shrink-0 my-1 mr-3.5"></div>
                                                <div className="min-w-0 flex-1 py-1 space-y-1">
                                                    <p className="text-[15px] font-semibold text-foreground truncate leading-tight">
                                                        {currentSession.user_skill?.skill?.name || 'Session'}
                                                    </p>
                                                    <p className="text-[13px] text-muted-foreground truncate font-medium">
                                                        {currentSession.title || 'General Topic'}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground/70 pt-1">
                                                        <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
                                                        <span>
                                                            {currentSession.scheduled_at 
                                                                ? `${new Date(currentSession.scheduled_at).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} • ${new Date(currentSession.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                                : 'Unscheduled'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Oriented Reminders */}
                                    <div className="space-y-4 mt-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xl font-bold text-foreground">Reminders</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {sessionInProgress ? (
                                                <div className="relative bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex gap-4 items-start overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-green-500/10 to-transparent pointer-events-none"></div>
                                                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center shrink-0 border border-green-100 dark:border-green-500/20 z-10">
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 z-10 pt-0.5">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="font-bold text-[15px] text-foreground">Active Session</p>
                                                            <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
                                                        </div>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Ensure you communicate clearly and confirm completion together when finished.</p>
                                                    </div>
                                                </div>
                                            ) : currentSession.status === 'completed' ? (
                                                <div className="relative bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex gap-4 items-start overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-blue-500/10 to-transparent pointer-events-none"></div>
                                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 z-10">
                                                        <Info className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0 z-10 pt-0.5">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <p className="font-bold text-[15px] text-foreground">Session Finished</p>
                                                            <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
                                                        </div>
                                                        <p className="text-[13px] text-muted-foreground leading-relaxed">Don't forget to navigate back to leave an honest review for your partner.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Meeting Link Binding */}
                                                    {currentSession.mode !== 'offline' && currentSession.meeting_link && (
                                                        <div className="relative bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex gap-4 items-start overflow-hidden cursor-pointer hover:border-blue-500/40 hover:shadow-md transition-all group" onClick={() => window.open(currentSession.meeting_link, '_blank')}>
                                                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-blue-500/10 to-transparent pointer-events-none group-hover:from-blue-500/15 transition-colors"></div>
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 z-10 group-hover:scale-105 transition-transform">
                                                                <Info className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 z-10 pt-0.5">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-bold text-[15px] text-foreground group-hover:text-blue-600 transition-colors">Meeting Link</p>
                                                                    <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-blue-500/60 transition-colors" />
                                                                </div>
                                                                <p className="text-[13px] text-muted-foreground leading-relaxed">Click here to join the virtual room for your scheduled session.</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {/* Location Binding */}
                                                    {currentSession.mode !== 'online' && currentSession.location && (
                                                        <div className="relative bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex gap-4 items-start overflow-hidden">
                                                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-blue-500/10 to-transparent pointer-events-none"></div>
                                                            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 z-10">
                                                                <Info className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1 min-w-0 z-10 pt-0.5">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <p className="font-bold text-[15px] text-foreground">Location Details</p>
                                                                    <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
                                                                </div>
                                                                <p className="text-[13px] text-muted-foreground leading-relaxed bg-secondary/30 p-2 rounded-lg border border-border/30 mt-1.5">{currentSession.location}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Check-in Required */}
                                                    <div className="relative bg-card border border-border/50 shadow-sm rounded-2xl p-4 flex gap-4 items-start overflow-hidden">
                                                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-orange-500/10 to-transparent pointer-events-none"></div>
                                                        <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-500/20 z-10">
                                                            <AlertTriangle className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 min-w-0 z-10 pt-0.5">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <p className="font-bold text-[15px] text-foreground">Check-in Required</p>
                                                                <button className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"><X className="w-4 h-4" /></button>
                                                            </div>
                                                            <p className="text-[13px] text-muted-foreground leading-relaxed">Both users must check in to officially start the session timer. Make sure you are present.</p>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default function SessionRoomPage() {
    return (
        <ProtectedRoute>
            <SessionRoomContent />
        </ProtectedRoute>
    );
}