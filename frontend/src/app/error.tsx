'use client';

import { ErrorDisplay } from '@/components/ui/error-display';

export default function Error({
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
                title="Application Error"
                showHomeButton
            />
        </div>
    );
}
