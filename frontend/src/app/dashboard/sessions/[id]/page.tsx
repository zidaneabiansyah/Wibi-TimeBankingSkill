'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout'
import { ProtectedRoute } from '@/components/auth'
import { useSessionStore } from '@/stores/session.store'
import { useAuthStore } from '@/stores/auth.store'
import { sessionService } from '@/lib/services/session.service'
import { toast } from 'sonner'
import { 
    ArrowLeft, Calendar, Clock, User, MapPin, Link as LinkIcon, 
    FileText, Loader2, Video, CheckCircle2, Circle, AlertCircle
} from 'lucide-react'
import { SessionTimer } from '@/components/session/SessionTimer'
import type { Session } from '@/types'

function SessionTimeline({ session }: { session: Session }) {
    const steps = [
        { 
            label: 'Booked', 
            date: session.created_at, 
            completed: true,
            icon: <Circle className="h-4 w-4 fill-primary text-primary" />
        },
        { 
            label: 'Approved', 
            date: session.status !== 'pending' && session.status !== 'rejected' ? session.updated_at : null, 
            completed: session.status !== 'pending' && session.status !== 'rejected',
            icon: session.status === 'rejected' ? <AlertCircle className="h-4 w-4 text-destructive" /> : <Circle className={`h-4 w-4 ${session.status !== 'pending' ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        },
        { 
            label: 'In Progress', 
            date: session.started_at, 
            completed: !!session.started_at,
            icon: <Circle className={`h-4 w-4 ${session.started_at ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
        },
        { 
            label: 'Completed', 
            date: session.completed_at, 
            completed: session.status === 'completed',
            icon: <CheckCircle2 className={`h-4 w-4 ${session.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
        }
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Session Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="relative space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="z-10">{step.icon}</div>
                                {index < steps.length - 1 && (
                                    <div className={`w-0.5 h-full -mt-0.5 ${step.completed ? 'bg-primary' : 'bg-muted'}`} />
                                )}
                            </div>
                            <div className="pb-4">
                                <p className={`text-sm font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step.label}
                                </p>
                                {step.date && (
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(step.date).toLocaleString()}
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
    // Video call state removed, using redirection

    useEffect(() => {
        // Fetch session details
        const fetchSession = async () => {
            if (!sessionId) return
            try {
                setIsLoading(true)
                const sessionData = await sessionService.getSession(parseInt(sessionId))
                setSession(sessionData)
            } catch (error) {
                console.error('Failed to load session:', error)
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
            router.refresh()
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
            // Reload session
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
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading session...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8">
                    <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <p className="text-lg font-medium">Session not found</p>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }

    const isTeacher = session.teacher_id === user?.id
    const isStudent = session.student_id === user?.id
    const canStart = session.status === 'approved' && (isTeacher || isStudent)
    const canConfirmCompletion = session.status === 'in_progress' && (isTeacher || isStudent)
    const canCancel = ['pending', 'approved'].includes(session.status) && (isTeacher || isStudent)
    const canDispute = ['approved', 'in_progress'].includes(session.status) && (isTeacher || isStudent)
    // Allow video call for approved or in_progress sessions with online/hybrid mode
    const canJoinVideoCall = ['approved', 'in_progress'].includes(session.status) && 
                            ['online', 'hybrid'].includes(session.mode) && 
                            (isTeacher || isStudent)

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{session.title}</h1>
                            <p className="text-muted-foreground mt-1">{session.user_skill?.skill?.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className="text-base">{session.status}</Badge>
                            {session.credit_held && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                                    Credits in Escrow
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Session Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Session Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Scheduled</p>
                                            <p className="text-sm font-medium">
                                                {session.scheduled_at
                                                    ? new Date(session.scheduled_at).toLocaleString()
                                                    : 'Not scheduled'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                            <p className="text-sm font-medium">{session.duration} hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Credits</p>
                                            <p className="text-sm font-medium">{session.credit_amount}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline">{session.mode}</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {session.mode === 'online' && session.meeting_link && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Meeting Link</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <a
                                            href={session.meeting_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-primary hover:underline"
                                        >
                                            <LinkIcon className="h-4 w-4" />
                                            {session.meeting_link}
                                        </a>
                                    </CardContent>
                                </Card>
                            )}

                            {session.mode === 'offline' && session.location && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Location</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <p>{session.location}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {session.status === 'in_progress' && session.started_at && (
                                <SessionTimer
                                    startTime={session.started_at}
                                    durationHours={session.duration}
                                    onTimeUp={() => toast.info('Session time is up!')}
                                />
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Participants</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Teacher</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <p className="text-sm font-medium">{session.teacher?.full_name}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Student</p>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            <p className="text-sm font-medium">{session.student?.full_name}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {session.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{session.notes}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {session.description && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Description</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm">{session.description}</p>
                                    </CardContent>
                                </Card>
                            )}

                            <SessionTimeline session={session} />
                        </div>
                    </div>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!showCancelForm && !showDisputeForm ? (
                                <div className="flex flex-wrap gap-2">
                                    {canStart && (
                                        <Button onClick={handleStartSession} disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Start Session
                                        </Button>
                                    )}

                                    {canJoinVideoCall && (
                                        <Button
                                            onClick={() => router.push(`/dashboard/sessions/${session.id}/room`)}
                                            disabled={isSubmitting}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Video className="mr-2 h-4 w-4" />
                                            {session.status === 'in_progress' ? 'Enter Session Room' : 'Enter Session Room'}
                                        </Button>
                                    )}

                                    {canConfirmCompletion && (
                                        <Button onClick={handleConfirmCompletion} disabled={isSubmitting}>
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Confirm Completion
                                        </Button>
                                    )}

                                    {canCancel && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCancelForm(true)}
                                            disabled={isSubmitting}
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                        >
                                            Cancel Session
                                        </Button>
                                    )}

                                    {canDispute && (
                                        <Button
                                            variant="destructive"
                                            onClick={() => setShowDisputeForm(true)}
                                            disabled={isSubmitting}
                                        >
                                            Dispute Session
                                        </Button>
                                    )}

                                    {!canStart && !canConfirmCompletion && !canCancel && !canDispute && (
                                        <p className="text-sm text-muted-foreground">No actions available for this session</p>
                                    )}
                                </div>
                            ) : showCancelForm ? (
                                <div className="space-y-3">
                                    {/* Cancellation Form */}
                                    <div>
                                        <label className="text-sm font-medium">Cancellation Reason</label>
                                        <textarea
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            placeholder="Please explain why you're cancelling this session..."
                                            rows={3}
                                            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCancelForm(false)}
                                            disabled={isSubmitting}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleCancelSession}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Confirm Cancellation
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Dispute Form */}
                                    <div className="p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
                                        <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Disputing this session will notify an administrator to review the credits.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Issue Description</label>
                                        <textarea
                                            value={disputeReason}
                                            onChange={(e) => setDisputeReason(e.target.value)}
                                            placeholder="Please describe the issue you're having with this session..."
                                            rows={3}
                                            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowDisputeForm(false)}
                                            disabled={isSubmitting}
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleDisputeSession}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Submit Dispute
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
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
