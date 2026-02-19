'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import Link from 'next/link';

interface ErrorDisplayProps {
    error: Error & { digest?: string };
    reset: () => void;
    title?: string;
    showHomeButton?: boolean;
}

export function ErrorDisplay({
    error,
    reset,
    title = 'Something went wrong',
    showHomeButton = true
}: ErrorDisplayProps) {
    useEffect(() => {
        // Log error to error reporting service
        console.error('Error:', error);
    }, [error]);

    return (
        <div className="min-h-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="h-10 w-10 text-destructive" />
                    </div>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">{title}</h2>
                    <p className="text-muted-foreground">
                        {error.message || 'An unexpected error occurred. Please try again.'}
                    </p>
                    {error.digest && (
                        <p className="text-xs text-muted-foreground/60">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset} variant="default">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                    {showHomeButton && (
                        <Link href="/">
                            <Button variant="outline">
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export function NotFoundDisplay({ message = 'Page not found' }: { message?: string }) {
    return (
        <div className="min-h-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-primary">404</h1>
                    <h2 className="text-2xl font-bold text-foreground">Page Not Found</h2>
                    <p className="text-muted-foreground">{message}</p>
                </div>

                <Link href="/">
                    <Button>
                        <Home className="h-4 w-4 mr-2" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        </div>
    );
}
