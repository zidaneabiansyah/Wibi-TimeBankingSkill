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
import { CheckCircle2, Clock, Users, Video, MapPin, ExternalLink, Timer, AlertCircle, PenTool, LayoutDashboard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Card className={`${isOvertime ? 'border-yellow-500 bg-yellow-950/20' : 'border-primary/50 bg-primary/5'}`}>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Timer className={`h-5 w-5 ${isOvertime ? 'text-yellow-500' : 'text-primary'}`} />
                    Session Timer
                    {isOvertime && <Badge variant="outline" className="text-yellow-500 border-yellow-500">Overtime</Badge>}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <div className={`text-4xl font-mono font-bold ${isOvertime ? 'text-yellow-500' : 'text-primary'}`}>
                        {formatTime(hours, minutes, seconds)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                        of {duration} hour{duration !== 1 ? 's' : ''} planned
                    </p>
                </div>
                <div className="mt-4">
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ${isOvertime ? 'bg-yellow-500' : 'bg-primary'}`}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                        {progressPercent.toFixed(0)}% complete
                    </p>
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
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${myCheckIn ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">You</span>
                </div>
                {myCheckIn ? (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Checked In
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        Waiting...
                    </Badge>
                )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${partnerCheckIn ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="font-medium">{partnerName || 'Partner'}</span>
                </div>
                {partnerCheckIn ? (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Checked In
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        Waiting...
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
                <main className="container mx-auto px-4 py-8 max-w-4xl">
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

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex flex-col space-y-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/dashboard/sessions" className="hover:underline">My Sessions</Link>
                        <span>/</span>
                        <span>Session Room</span>
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{currentSession.title}</h1>
                            <p className="text-muted-foreground">
                                {currentSession.user_skill?.skill?.name || 'Session'} • {currentSession.duration} hour{currentSession.duration !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <Badge
                            className={`${sessionInProgress ? 'bg-green-500' :
                                    currentSession.status === 'approved' ? 'bg-blue-500' :
                                        currentSession.status === 'completed' ? 'bg-gray-500' : 'bg-yellow-500'
                                } text-white capitalize`}
                        >
                            {currentSession.status.replace('_', ' ')}
                        </Badge>
                    </div>

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
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Column - Check-in / Timer */}
                                <div className="space-y-6">
                                    {/* Check-in Card (before session starts) */}
                                    {!sessionInProgress && currentSession.status === 'approved' && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Users className="h-5 w-5" />
                                                    Check-in Status
                                                </CardTitle>
                                                <CardDescription>
                                                    Both participants must check in to start the session.
                                                    <span className="block mt-1 text-xs font-semibold text-primary">
                                                        Check-in is available 15 minutes before and after the scheduled time.
                                                    </span>
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <CheckInStatus session={currentSession} currentUserId={user.id} />
                                            </CardContent>
                                            <CardFooter>
                                                {!myCheckIn ? (
                                                    <Button
                                                        className="w-full"
                                                        onClick={handleCheckIn}
                                                        disabled={isCheckingIn}
                                                    >
                                                        {isCheckingIn ? 'Checking in...' : 'Check In Now'}
                                                    </Button>
                                                ) : !bothCheckedIn ? (
                                                    <div className="w-full text-center text-muted-foreground">
                                                        <AlertCircle className="h-5 w-5 mx-auto mb-2" />
                                                        Waiting for partner to check in...
                                                    </div>
                                                ) : null}
                                            </CardFooter>
                                        </Card>
                                    )}

                                    {/* Timer (during session) */}
                                    {sessionInProgress && (
                                        <SessionTimer
                                            startedAt={currentSession.started_at}
                                            duration={currentSession.duration}
                                        />
                                    )}

                                    {/* Complete Session Card */}
                                    {sessionInProgress && (
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    Complete Session
                                                </CardTitle>
                                                <CardDescription>
                                                    Both participants must confirm to complete the session
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                        <span>Your confirmation</span>
                                                        {myConfirmation ? (
                                                            <Badge className="bg-green-500 text-white">Confirmed</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Pending</Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                                        <span>Partner confirmation</span>
                                                        {(isTeacher ? currentSession.student_confirmed : currentSession.teacher_confirmed) ? (
                                                            <Badge className="bg-green-500 text-white">Confirmed</Badge>
                                                        ) : (
                                                            <Badge variant="outline">Pending</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter>
                                                {!myConfirmation ? (
                                                    <Button
                                                        className="w-full"
                                                        onClick={handleComplete}
                                                        disabled={isCompleting}
                                                    >
                                                        {isCompleting ? 'Confirming...' : 'Confirm Completion'}
                                                    </Button>
                                                ) : (
                                                    <div className="w-full text-center text-muted-foreground">
                                                        Waiting for partner to confirm...
                                                    </div>
                                                )}
                                            </CardFooter>
                                        </Card>
                                    )}

                                    {/* Completed State */}
                                    {currentSession.status === 'completed' && (
                                        <Card className="border-green-500 bg-green-950/20">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-green-500">
                                                    <CheckCircle2 className="h-5 w-5" />
                                                    Session Completed
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-muted-foreground">
                                                    {currentSession.credit_amount} credits have been transferred.
                                                </p>
                                                <div className="mt-4 flex gap-2">
                                                    <Link href="/dashboard/sessions">
                                                        <Button variant="outline">Back to Sessions</Button>
                                                    </Link>
                                                    {!isTeacher && (
                                                        <Link href={`/dashboard/sessions/${sessionId}/review`}>
                                                            <Button>Leave a Review</Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>

                                {/* Right Column - Session Info */}
                                <div className="space-y-6">
                                    {/* Session Details */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Session Details</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Scheduled Time</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {currentSession.scheduled_at
                                                            ? new Date(currentSession.scheduled_at).toLocaleString()
                                                            : 'Not scheduled'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge variant="outline" className="capitalize">{currentSession.mode}</Badge>
                                                <span className="text-sm text-muted-foreground">
                                                    {currentSession.duration} hour{currentSession.duration !== 1 ? 's' : ''} • {currentSession.credit_amount} credits
                                                </span>
                                            </div>

                                            {currentSession.mode !== 'offline' && currentSession.meeting_link && (
                                                <div className="flex items-center gap-3">
                                                    <Video className="h-5 w-5 text-muted-foreground" />
                                                    <div className="flex-1">
                                                        <p className="font-medium">Meeting Link</p>
                                                        <a
                                                            href={currentSession.meeting_link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-primary hover:underline flex items-center gap-1"
                                                        >
                                                            Join Meeting <ExternalLink className="h-3 w-3" />
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {currentSession.mode !== 'online' && currentSession.location && (
                                                <div className="flex items-center gap-3">
                                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">Location</p>
                                                        <p className="text-sm text-muted-foreground">{currentSession.location}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {currentSession.description && (
                                                <div>
                                                    <p className="font-medium mb-1">Description</p>
                                                    <p className="text-sm text-muted-foreground">{currentSession.description}</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {/* Participant Info */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Participants</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="font-bold text-primary">
                                                        {currentSession.teacher?.full_name?.charAt(0) || 'T'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{currentSession.teacher?.full_name || 'Teacher'}</p>
                                                    <p className="text-sm text-muted-foreground">Teacher</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="font-bold text-primary">
                                                        {currentSession.student?.full_name?.charAt(0) || 'S'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium">{currentSession.student?.full_name || 'Student'}</p>
                                                    <p className="text-sm text-muted-foreground">Student</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
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