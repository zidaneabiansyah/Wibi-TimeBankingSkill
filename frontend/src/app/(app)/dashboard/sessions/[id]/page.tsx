'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { useSessionStore } from '@/stores/session.store'
import { useAuthStore } from '@/stores/auth.store'
import { sessionService } from '@/lib/services/session.service'
import { toast } from 'sonner'
import { m } from 'framer-motion'
import {
    ArrowLeft, Calendar, Clock, User, MapPin, Link as LinkIcon,
    FileText, Loader2, Video, CheckCircle2, Circle, AlertCircle, Info,
    MessageSquare, ShieldCheck, Zap
} from 'lucide-react'
import { SessionTimer } from '@/components/features/session/SessionTimer'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getSessionCreditStatus } from '@/lib/utils/session-status'
import type { Session } from '@/types'

const statusConfig: Record<string, { color: string; bg: string; border: string; label: string }> = {
    pending: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', label: 'Pending Approval' },
    approved: { color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', label: 'Scheduled' },
    in_progress: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', label: 'In Progress' },
    completed: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', label: 'Completed' },
    cancelled: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Cancelled' },
    rejected: { color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Rejected' },
    disputed: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Disputed' },
};

function SessionTimeline({ session }: { session: Session }) {
    const steps = [
        {
            label: 'Booked',
            date: session.created_at,
            completed: true,
            Icon: Circle
        },
        {
            label: 'Approved',
            date: session.status !== 'pending' && session.status !== 'rejected' ? session.updated_at : null,
            completed: session.status !== 'pending' && session.status !== 'rejected',
            Icon: session.status === 'rejected' ? AlertCircle : Circle
        },
        {
            label: 'In Progress',
            date: session.started_at,
            completed: !!session.started_at,
            Icon: Circle
        },
        {
            label: 'Completed',
            date: session.completed_at,
            completed: session.status === 'completed',
            Icon: CheckCircle2
        }
    ];

    return (
        <Card className="rounded-3xl border-border/40 bg-card/30 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Journey</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="relative space-y-6">
                    <div className="absolute left-[7px] top-2 bottom-4 w-0.5 bg-muted/30" />
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-4 relative">
                            <div className="z-10 bg-background rounded-full p-0.5 outline outline-4 outline-background">
                                <step.Icon className={`h-3 w-3 ${step.completed ? 'text-primary' : 'text-muted-foreground/30'}`} />
                            </div>
                            <div className="flex flex-col">
                                <p className={`text-xs font-bold ${step.completed ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                                    {step.label}
                                </p>
                                {step.date && (
                                    <p className="text-[10px] font-medium text-muted-foreground/60">
                                        {new Date(step.date).toLocaleDateString()} • {new Date(step.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function SessionDetailContent() {
    const router = useRouter()
    const params = useParams()
    const sessionId = params.id as string
    const { user } = useAuthStore()
    const { cancelSession, startSession, confirmCompletion } = useSessionStore()
    const [session, setSession] = useState<Session | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [cancelReason, setCancelReason] = useState('')
    const [showCancelForm, setShowCancelForm] = useState(false)
    const [showDisputeForm, setShowDisputeForm] = useState(false)
    const [disputeReason, setDisputeReason] = useState('')

    useEffect(() => {
        const fetchSession = async () => {
            if (!sessionId) return
            try {
                setIsLoading(true)
                const sessionData = await sessionService.getSession(parseInt(sessionId))
                setSession(sessionData)
            } catch (error) {
                toast.error('Failed to load session')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSession()
    }, [sessionId])

    const handleStartSession = async () => {
        if (!session) return
        setIsSubmitting(true)
        try {
            await startSession(session.id)
            toast.success('Session started')
            window.location.reload()
        } catch (error) {
            toast.error('Failed to start session')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmCompletion = async () => {
        if (!session) return
        setIsSubmitting(true)
        try {
            await confirmCompletion(session.id)
            toast.success('Session marked as completed')
            router.push('/dashboard/sessions')
        } catch (error) {
            toast.error('Failed to complete session')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelSession = async () => {
        if (!session || !cancelReason.trim()) {
            toast.error('Please provide a cancellation reason')
            return
        }
        setIsSubmitting(true)
        try {
            await cancelSession(session.id, { reason: cancelReason })
            toast.success('Session cancelled')
            router.push('/dashboard/sessions')
        } catch (error) {
            toast.error('Failed to cancel session')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDisputeSession = async () => {
        if (!session || !disputeReason.trim()) {
            toast.error('Please provide a dispute reason')
            return
        }
        setIsSubmitting(true)
        try {
            const { disputeSession } = useSessionStore.getState();
            await disputeSession(session.id, { reason: disputeReason })
            toast.success('Session disputed. Admin will review.')
            setShowDisputeForm(false)
            const sessionData = await sessionService.getSession(parseInt(sessionId))
            setSession(sessionData)
        } catch (error: any) {
            toast.error(error.message || 'Failed to dispute session')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
            </div>
        )
    }

    if (!session) return null

    const isTeacher = session.teacher_id === user?.id
    const isStudent = session.student_id === user?.id
    const otherParty = isTeacher ? session.student : session.teacher
    const canStart = session.status === 'approved' && (isTeacher || isStudent)
    const canConfirmCompletion = session.status === 'in_progress' && (isTeacher || isStudent)
    const canCancel = ['pending', 'approved'].includes(session.status) && (isTeacher || isStudent)
    const canDispute = ['approved', 'in_progress'].includes(session.status) && (isTeacher || isStudent)
    const canJoinVideoCall = ['approved', 'in_progress'].includes(session.status) &&
        ['online', 'hybrid'].includes(session.mode) &&
        (isTeacher || isStudent)

    const status = statusConfig[session.status] || statusConfig.pending

    return (
        <div className="min-h-screen bg-background" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            <Header />

            <main className="container mx-auto px-6 py-12 max-w-6xl">
                <m.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-xl hover:bg-muted/50 gap-2 font-bold text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Return to Sessions
                    </Button>
                </m.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Main Detail */}
                    <div className="lg:col-span-2 space-y-6">
                        <m.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="rounded-[2.5rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden border-t-primary/20">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status.border} ${status.bg} ${status.color}`}>
                                                {status.label}
                                            </span>
                                            {session.credit_held && (
                                                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    Shield Protected
                                                </Badge>
                                            )}
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                                            {session.title}
                                        </h1>
                                        <div className="flex items-center gap-4 text-muted-foreground">
                                            <div className="flex items-center gap-1.5 font-bold text-sm bg-muted/30 px-3 py-1.5 rounded-xl border border-border/10">
                                                <Zap className="h-4 w-4 text-primary" />
                                                {session.user_skill?.skill?.name || 'Skill Session'}
                                            </div>
                                            <div className="h-1 w-1 rounded-full bg-border" />
                                            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Session ID: #{session.id}</span>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-8 pt-4 space-y-8">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-[2rem] bg-muted/10 border border-border/10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date</span>
                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                <Calendar className="h-4 w-4 text-primary/60" />
                                                {session.scheduled_at ? new Date(session.scheduled_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Pending'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Time</span>
                                            <div className="flex items-center gap-2 font-bold text-sm">
                                                <Clock className="h-4 w-4 text-primary/60" />
                                                {session.scheduled_at ? new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Duration</span>
                                            <div className="flex items-center gap-2 font-bold text-sm text-secondary">
                                                <Zap className="h-4 w-4 fill-secondary/20" />
                                                {session.duration} Hours
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Credits</span>
                                            <div className="flex items-center gap-1.5 font-black text-lg text-secondary">
                                                {session.credit_amount}
                                                <span className="text-[10px] opacity-70 tracking-tighter">CRS</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="h-1 w-6 bg-primary rounded-full" />
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-foreground/80">Description</h3>
                                        </div>
                                        <p className="text-foreground/70 leading-relaxed text-sm font-medium">
                                            {session.description || 'No description provided for this session.'}
                                        </p>
                                    </div>

                                    {session.notes && (
                                        <div className="p-6 rounded-3xl bg-secondary/5 border border-secondary/10 space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4" />
                                                Private Notes
                                            </h4>
                                            <p className="text-sm text-foreground/80 italic leading-relaxed">"{session.notes}"</p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="p-8 pt-0 flex flex-col gap-4">
                                    <div className="h-px w-full bg-linear-to-r from-transparent via-border/40 to-transparent" />

                                    {!showCancelForm && !showDisputeForm ? (
                                        <div className="flex flex-wrap items-center gap-3 w-full">
                                            {canJoinVideoCall && (
                                                <Button
                                                    onClick={() => router.push(`/dashboard/sessions/${session.id}/room`)}
                                                    className="h-14 flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                                                >
                                                    <Video className="h-5 w-5" />
                                                    {session.status === 'in_progress' ? 'Join Virtual Classroom' : 'Enter Meeting Room'}
                                                </Button>
                                            )}

                                            {canStart && (
                                                <Button
                                                    onClick={handleStartSession}
                                                    disabled={isSubmitting}
                                                    className="h-14 flex-1 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                                >
                                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Kickoff Session'}
                                                </Button>
                                            )}

                                            {canConfirmCompletion && (
                                                <Button
                                                    onClick={handleConfirmCompletion}
                                                    disabled={isSubmitting}
                                                    className="h-14 flex-1 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/20 gap-2"
                                                >
                                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                                                    Mark as Successfully Completed
                                                </Button>
                                            )}

                                            <div className="flex items-center gap-3 ml-auto">
                                                {canCancel && (
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setShowCancelForm(true)}
                                                        disabled={isSubmitting}
                                                        className="h-12 px-6 rounded-xl text-rose-500 hover:bg-rose-500/5 font-bold text-xs uppercase tracking-widest"
                                                    >
                                                        Abandon
                                                    </Button>
                                                )}
                                                {canDispute && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setShowDisputeForm(true)}
                                                        disabled={isSubmitting}
                                                        className="h-12 px-6 rounded-xl border-orange-500/20 text-orange-600 hover:bg-orange-500/5 font-bold text-xs uppercase tracking-widest"
                                                    >
                                                        Dispute
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ) : showCancelForm ? (
                                        <div className="w-full space-y-4 p-6 rounded-[2rem] bg-rose-500/5 border border-rose-500/10">
                                            <h3 className="text-sm font-black text-rose-600 uppercase tracking-widest">Abandon Session</h3>
                                            <textarea
                                                value={cancelReason}
                                                onChange={(e) => setCancelReason(e.target.value)}
                                                placeholder="Briefly explain the reason for cancellation..."
                                                className="w-full h-24 p-4 rounded-2xl bg-background border-border/40 text-sm focus:ring-2 ring-rose-500/20"
                                            />
                                            <div className="flex gap-3">
                                                <Button variant="ghost" className="rounded-xl" onClick={() => setShowCancelForm(false)}>Go Back</Button>
                                                <Button variant="destructive" className="rounded-xl flex-1 font-black" onClick={handleCancelSession} disabled={isSubmitting}>
                                                    Confirm Abandonment
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full space-y-4 p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10">
                                            <h3 className="text-sm font-black text-orange-600 uppercase tracking-widest">Submit Dispute</h3>
                                            <textarea
                                                value={disputeReason}
                                                onChange={(e) => setDisputeReason(e.target.value)}
                                                placeholder="Describe the issue in detail..."
                                                className="w-full h-24 p-4 rounded-2xl bg-background border-border/40 text-sm focus:ring-2 ring-orange-500/20"
                                            />
                                            <div className="flex gap-3">
                                                <Button variant="ghost" className="rounded-xl" onClick={() => setShowDisputeForm(false)}>Cancel</Button>
                                                <Button className="rounded-xl flex-1 font-black bg-orange-600 hover:bg-orange-700" onClick={handleDisputeSession} disabled={isSubmitting}>
                                                    Submit for Review
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        </m.div>

                        {/* Additional Information Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {session.mode === 'online' && session.meeting_link && (
                                <Card className="rounded-3xl border-border/40 bg-card/20 backdrop-blur-sm px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                            <Video className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Meeting Link</span>
                                            <a href={session.meeting_link} target="_blank" rel="noopener noreferrer" className="block text-sm font-bold text-foreground hover:text-primary truncate">
                                                {session.meeting_link}
                                            </a>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            {(session.mode === 'offline' || session.mode === 'hybrid') && session.location && (
                                <Card className="rounded-3xl border-border/40 bg-card/20 backdrop-blur-sm px-6 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                            <MapPin className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</span>
                                            <p className="text-sm font-bold text-foreground truncate">{session.location}</p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            <Card className="rounded-3xl border-border/40 bg-card/20 backdrop-blur-sm px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <ShieldCheck className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Privacy Mode</span>
                                        <p className="text-sm font-bold text-foreground">End-to-End Encrypted</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Interaction & Timeline */}
                    <div className="space-y-6">
                        {session.status === 'in_progress' && session.started_at && (
                            <div className="rounded-[2.5rem] p-1 bg-linear-to-br from-primary/20 via-primary/5 to-secondary/20 shadow-xl">
                                <SessionTimer
                                    startTime={session.started_at}
                                    durationHours={session.duration}
                                    onTimeUp={() => toast.info('Session time is up!')}
                                />
                            </div>
                        )}

                        <Card className="rounded-[2rem] border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden">
                            <CardHeader className="p-6 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Knowledge Exchange</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/10">
                                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 flex items-center justify-center border border-border/30 text-lg font-black text-primary">
                                            {session.teacher?.full_name?.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">Expert Mentor</span>
                                            <span className="text-sm font-black text-foreground">{session.teacher?.full_name}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-center">
                                        <div className="h-8 w-px bg-linear-to-b from-primary/40 to-secondary/40" />
                                    </div>

                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/10">
                                        <div className="h-12 w-12 rounded-full bg-linear-to-br from-secondary/10 to-primary/10 flex items-center justify-center border border-border/30 text-lg font-black text-secondary">
                                            {session.student?.full_name?.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-secondary/60">Enthusiastic Student</span>
                                            <span className="text-sm font-black text-foreground">{session.student?.full_name}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <SessionTimeline session={session} />

                        <Card className="rounded-[2rem] border-primary/10 bg-primary/5 overflow-hidden">
                            <CardHeader className="p-6 pb-2">
                                <div className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-primary" />
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Guideline</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 pt-2">
                                <ul className="text-[11px] font-bold text-primary/70 space-y-2 leading-relaxed">
                                    <li>• Respect the scheduled time of your partner.</li>
                                    <li>• Ensure a stable internet for online sessions.</li>
                                    <li>• Credits are held in escrow until completion.</li>
                                    <li>• Contact support if any dispute arises.</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SessionDetailPage() {
    return (
        <ProtectedRoute>
            <SessionDetailContent />
        </ProtectedRoute>
    )
}
