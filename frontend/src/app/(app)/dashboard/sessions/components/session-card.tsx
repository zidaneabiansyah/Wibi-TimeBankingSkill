'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Video, MapPin, Calendar, Clock } from 'lucide-react';
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

const statusConfig: Record<SessionStatus, { color: string; bg: string; border: string; label: string }> = {
    pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pending Approval' },
    approved: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', label: 'Scheduled' },
    in_progress: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'In Progress' },
    completed: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Completed' },
    cancelled: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Cancelled' },
    rejected: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Rejected' },
    disputed: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Disputed' },
};

export function SessionCard({ session, currentUserId, onAction }: SessionCardProps) {
    const isTeacher = session.teacher_id === currentUserId;
    const isStudent = session.student_id === currentUserId;
    const otherParty = isTeacher ? session.student : session.teacher;
    const canApprove = isTeacher && session.status === 'pending';
    const canCancel = ['pending', 'approved'].includes(session.status);
    const canJoin = session.status === 'in_progress';
    const status = statusConfig[session.status] || statusConfig.pending;

    return (
        <Card className="group relative flex flex-col h-full rounded-[1.75rem] border border-border/40 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-primary/40 hover:bg-card/60 hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_15px_35px_-12px_rgba(0,0,0,0.2)] overflow-hidden" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${status.border} ${status.bg} ${status.color}`}>
                                {status.label}
                            </span>
                        </div>
                        <CardTitle className="text-lg font-semibold tracking-tight text-foreground/90 group-hover:text-primary transition-colors truncate">
                            {session.title}
                        </CardTitle>
                        <CardDescription className="text-xs font-semibold text-muted-foreground/80 mt-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            {isTeacher ? 'Teaching' : 'Learning'} • {session.user_skill?.skill?.name || 'Skill Session'}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-5 py-1 space-y-3">
                <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-muted/20 border border-border/10 transition-colors group-hover:bg-muted/40">
                    <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-border/30 text-xs text-foreground font-bold">
                        {otherParty?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-muted-foreground">{isTeacher ? 'Student' : 'Mentor'}</span>
                        <span className="text-xs font-bold text-foreground/90 truncate">{otherParty?.full_name || 'Anonymous User'}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2 border-y border-border/20">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Date</span>
                        </div>
                        <span className="text-[11px] font-bold text-foreground/80">{formatDate(session.scheduled_at)}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 items-end text-right">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Investment</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[11px] font-bold text-foreground/80">{session.duration}h</span>
                            <span className="text-sm font-bold text-secondary">{session.credit_amount} <span className="text-[9px] opacity-70">CRS</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/30 text-[10px] font-bold text-foreground/70 border border-border/10">
                        {session.mode === 'online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        <span className="capitalize">{session.mode}</span>
                    </div>

                    {session.credit_held && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/5 text-blue-600 dark:text-blue-400 border border-blue-500/5">
                            <Info className="h-3 w-3" />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Escrow</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-3 mt-auto">
                <div className="flex flex-col w-full gap-3">
                    {canJoin && (
                        <Link href={`/dashboard/sessions/${session.id}/room`} className="w-full">
                            <Button className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/10 gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Video className="h-4 w-4" />
                                Join Virtual Room
                            </Button>
                        </Link>
                    )}

                    {canApprove && (
                        <div className="flex flex-col gap-2 w-full">
                            <Button
                                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => onAction('approve', session.id)}
                            >
                                Approve Session
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl border-rose-500/10 text-rose-600 hover:bg-rose-500/5 text-xs font-bold transition-all"
                                onClick={() => onAction('reject', session.id)}
                            >
                                Reject Session Request
                            </Button>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 w-full">
                        <Link href={`/dashboard/sessions/${session.id}`} className="w-full">
                            <Button variant="secondary" className="w-full h-11 rounded-xl bg-muted/40 hover:bg-muted text-foreground text-xs font-bold transition-all">
                                View Session Details
                            </Button>
                        </Link>

                        {session.status === 'completed' && !session.review && (
                            <Link href={`/dashboard/sessions/${session.id}/review`} className="w-full">
                                <Button className="w-full h-11 rounded-xl border-secondary/20 text-secondary hover:bg-secondary/5 text-xs font-bold transition-all" variant="outline">
                                    Write a Review
                                </Button>
                            </Link>
                        )}

                        {canCancel && !canApprove && (
                            <Button
                                variant="ghost"
                                className="h-10 w-full rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/5 transition-all text-[10px] font-bold uppercase tracking-widest"
                                onClick={() => onAction('cancel', session.id)}
                            >
                                Cancel Session
                            </Button>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}


