'use client';

import { ErrorDisplay } from '@/components/ui/error-display';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <ErrorDisplay
                        error={error}
                        reset={reset}
                        title="Application Error"
                        showHomeButton
                    />
                </div>
            </body>
        </html>
    );
}
