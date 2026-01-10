import type { Session } from '@/types';

/**
 * Get human-readable credit status for a session
 * This helps users understand what happened to their credits
 */
export function getSessionCreditStatus(session: Session, currentUserID: number): {
    label: string;
    description: string;
    variant: 'default' | 'secondary' | 'success' | 'warning' | 'destructive';
} {
    const isStudent = session.student_id === currentUserID;
    const isTeacher = session.teacher_id === currentUserID;

    // Completed sessions - credits transferred
    if (session.status === 'completed') {
        if (isStudent) {
            return {
                label: 'Credits Spent',
                description: `${session.credit_amount} credits transferred to teacher`,
                variant: 'success',
            };
        }
        if (isTeacher) {
            return {
                label: 'Credits Earned',
                description: `${session.credit_amount} credits received`,
                variant: 'success',
            };
        }
    }

    // In progress - waiting for confirmation
    if (session.status === 'in_progress') {
        if (session.teacher_confirmed && session.student_confirmed) {
            return {
                label: 'Processing Payment',
                description: 'Credits being transferred...',
                variant: 'warning',
            };
        }
        if (isStudent && session.student_confirmed) {
            return {
                label: 'Awaiting Teacher Confirmation',
                description: `${session.credit_amount} credits in escrow`,
                variant: 'warning',
            };
        }
        if (isTeacher && session.teacher_confirmed) {
            return {
                label: 'Awaiting Student Confirmation',
                description: `${session.credit_amount} credits in escrow`,
                variant: 'warning',
            };
        }
        return {
            label: 'Session In Progress',
            description: `${session.credit_amount} credits in escrow`,
            variant: 'secondary',
        };
    }

    // Approved sessions - credits held
    if (session.status === 'approved') {
        if (isStudent) {
            return {
                label: 'Credits Reserved',
                description: `${session.credit_amount} credits held for this session`,
                variant: 'secondary',
            };
        }
        if (isTeacher) {
            return {
                label: 'Payment Secured',
                description: `${session.credit_amount} credits reserved by student`,
                variant: 'secondary',
            };
        }
    }

    // Pending sessions - no credits held yet
    if (session.status === 'pending') {
        if (isStudent) {
            return {
                label: 'Credits Reserved',
                description: `${session.credit_amount} credits held pending approval`,
                variant: 'warning',
            };
        }
        if (isTeacher) {
            return {
                label: 'Awaiting Your Approval',
                description: `${session.credit_amount} credits will be secured upon approval`,
                variant: 'default',
            };
        }
    }

    // Cancelled or rejected - credits refunded
    if (session.status === 'cancelled' || session.status === 'rejected') {
        if (isStudent) {
            return {
                label: 'Credits Refunded',
                description: session.credit_held ? `${session.credit_amount} credits returned` : 'No charges applied',
                variant: 'destructive',
            };
        }
        if (isTeacher) {
            return {
                label: 'Session Cancelled',
                description: 'No payment received',
                variant: 'destructive',
            };
        }
    }

    // Default fallback
    return {
        label: 'Credits in Escrow',
        description: `${session.credit_amount} credits`,
        variant: 'default',
    };
}
