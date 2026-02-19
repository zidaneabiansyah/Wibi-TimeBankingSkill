'use client';

import { ErrorDisplay } from '@/components/ui/error-display';

export default function AuthError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <ErrorDisplay
                error={error}
                reset={reset}
                title="Authentication Error"
                showHomeButton
            />
        </div>
    );
}
