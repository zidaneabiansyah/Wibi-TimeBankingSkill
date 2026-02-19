'use client';

import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransferCreditsDialog } from './TransferCreditsDialog';
import { useAuthStore } from '@/stores/auth.store';

interface TransferCreditsButtonProps {
    onSuccess?: () => void;
    variant?: 'default' | 'outline' | 'ghost' | 'secondary';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    className?: string;
}

/**
 * Reusable button component that opens the Transfer Credits dialog
 * Can be placed anywhere in the app (dashboard, profile, etc.)
 */
export function TransferCreditsButton({
    onSuccess,
    variant = 'outline',
    size = 'default',
    className,
}: TransferCreditsButtonProps) {
    const { user } = useAuthStore();

    // Don't show button if user is not logged in
    if (!user) {
        return null;
    }

    return (
        <TransferCreditsDialog
            onSuccess={onSuccess}
            trigger={
                <Button variant={variant} size={size} className={className}>
                    <Send className="h-4 w-4 mr-2" />
                    Transfer Credits
                </Button>
            }
        />
    );
}
