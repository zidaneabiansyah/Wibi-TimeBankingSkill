'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Video, MapPin } from 'lucide-react';
import type { Session, SessionStatus } from '@/types';

interface SessionCardProps {
    session: Session;
    currentUserId: number;
    onAction: (action: string, sessionId: number) => void;
}

function formatDate(dateString: string | null) {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function getStatusColor(status: SessionStatus): string {
    switch (status) {
        case 'pending': return 'bg-yellow-500';
        case 'approved': return 'bg-blue-500';
        case 'in_progress': return 'bg-green-500';
        case 'completed': return 'bg-gray-500';
        case 'cancelled': return 'bg-red-500';
        case 'rejected': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
}

export function SessionCard({ session, currentUserId, onAction }: SessionCardProps) {
    const isTeacher = session.teacher_id === currentUserId;
    const isStudent = session.student_id === currentUserId;
    const otherParty = isTeacher ? session.student : session.teacher;
    const canApprove = isTeacher && session.status === 'pending';
    const canCancel = ['pending', 'approved'].includes(session.status);
    const canJoin = session.status === 'in_progress';

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{session.title}</CardTitle>
                        <CardDescription className="truncate">
                            {isTeacher ? 'Teaching' : 'Learning'} • {session.user_skill?.skill?.name || 'Unknown Skill'}
                        </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(session.status)} text-white capitalize shrink-0`}>
                        {session.status.replace('_', ' ')}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {/* Other Party */}
                <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="truncate">
                        {isTeacher ? 'Student: ' : 'Teacher: '}
                        <strong>{otherParty?.full_name || 'Unknown'}</strong>
                    </span>
                </div>

                {/* Schedule */}
                <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                        <line x1="16" x2="16" y1="2" y2="6" />
                        <line x1="8" x2="8" y1="2" y2="6" />
                        <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    <span className="truncate">{formatDate(session.scheduled_at)}</span>
                </div>

                {/* Duration & Credits */}
                <div className="flex items-center gap-2 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{session.duration}h • {session.credit_amount} credits</span>
                </div>

                {/* Mode & Status Badges */}
                <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
                    <Badge variant="outline" className="capitalize">
                        {session.mode === 'online' ? <Video className="h-3 w-3 mr-1" /> : <MapPin className="h-3 w-3 mr-1" />}
                        {session.mode}
                    </Badge>

                    {session.credit_held && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant="secondary" className="cursor-help">
                                        <Info className="h-3 w-3 mr-1" />
                                        Credits Held
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Credits are held in escrow until session completion</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex gap-2">
                {canJoin && (
                    <Link href={`/dashboard/sessions/${session.id}/room`} className="flex-1">
                        <Button className="w-full" variant="default">
                            Join Session
                        </Button>
                    </Link>
                )}

                {canApprove && (
                    <>
                        <Button
                            className="flex-1"
                            variant="default"
                            onClick={() => onAction('approve', session.id)}
                        >
                            Approve
                        </Button>
                        <Button
                            className="flex-1"
                            variant="destructive"
                            onClick={() => onAction('reject', session.id)}
                        >
                            Reject
                        </Button>
                    </>
                )}

                {canCancel && !canApprove && (
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => onAction('cancel', session.id)}
                    >
                        Cancel
                    </Button>
                )}

                {session.status === 'completed' && !session.review && (
                    <Link href={`/dashboard/sessions/${session.id}/review`} className="flex-1">
                        <Button className="w-full" variant="outline">
                            Leave Review
                        </Button>
                    </Link>
                )}

                <Link href={`/dashboard/sessions/${session.id}`} className="flex-1">
                    <Button className="w-full" variant="ghost">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
