'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, User, BookOpen, Loader2 } from 'lucide-react'
import { useSessionStore } from '@/stores/session.store'
import { toast } from 'sonner'
import type { Session } from '@/types'

interface SessionApprovalModalProps {
    session: Session | null
    isOpen: boolean
    onClose: () => void
    onApproved?: () => void
}

export default function SessionApprovalModal({
    session,
    isOpen,
    onClose,
    onApproved,
}: SessionApprovalModalProps) {
    const { approveSession, rejectSession } = useSessionStore()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [scheduledAt, setScheduledAt] = useState(session?.scheduled_at || '')
    const [meetingLink, setMeetingLink] = useState(session?.meeting_link || '')
    const [location, setLocation] = useState(session?.location || '')
    const [notes, setNotes] = useState(session?.notes || '')
    const [rejectReason, setRejectReason] = useState('')
    const [isRejecting, setIsRejecting] = useState(false)

    if (!session) return null

    const handleApprove = async () => {
        setIsSubmitting(true)
        try {
            await approveSession(session.id, {
                scheduled_at: scheduledAt || undefined,
                meeting_link: meetingLink,
                location,
                notes,
            })
            toast.success('Session approved successfully')
            onApproved?.()
            onClose()
        } catch (error) {
            toast.error('Failed to approve session')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a rejection reason')
            return
        }

        setIsSubmitting(true)
        try {
            await rejectSession(session.id, { reason: rejectReason })
            toast.success('Session rejected')
            onApproved?.()
            onClose()
        } catch (error) {
            toast.error('Failed to reject session')
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Review Session Request</DialogTitle>
                    <DialogDescription>
                        Review and approve or reject this session request
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Session Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">{session.title}</CardTitle>
                            <CardDescription>{session.user_skill?.skill?.name || 'Skill'}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Student</p>
                                        <p className="text-sm font-medium">{session.student?.full_name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Duration</p>
                                        <p className="text-sm font-medium">{session.duration} hours</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Credits</p>
                                        <p className="text-sm font-medium">{session.credit_amount}</p>
                                    </div>
                                </div>
                                <div>
                                    <Badge>{session.mode}</Badge>
                                </div>
                            </div>
                            {session.description && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">Description</p>
                                    <p className="text-sm">{session.description}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {!isRejecting ? (
                        <>
                            {/* Approval Form */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="scheduled-at">Schedule Date & Time</Label>
                                    <Input
                                        id="scheduled-at"
                                        type="datetime-local"
                                        value={scheduledAt}
                                        onChange={(e) => setScheduledAt(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="meeting-link">Meeting Link (for online sessions)</Label>
                                    <Input
                                        id="meeting-link"
                                        placeholder="https://zoom.us/..."
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="location">Location (for offline sessions)</Label>
                                    <Input
                                        id="location"
                                        placeholder="Cafe, Library, etc."
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Any additional information for the student..."
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsRejecting(true)}>
                                    Reject
                                </Button>
                                <Button onClick={handleApprove} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Approve Session
                                </Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            {/* Rejection Form */}
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="reject-reason">Rejection Reason</Label>
                                    <Textarea
                                        id="reject-reason"
                                        placeholder="Please explain why you're rejecting this session..."
                                        value={rejectReason}
                                        onChange={(e) => setRejectReason(e.target.value)}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <DialogFooter className="flex gap-2">
                                <Button variant="outline" onClick={() => setIsRejecting(false)}>
                                    Back
                                </Button>
                                <Button variant="destructive" onClick={handleReject} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm Rejection
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
