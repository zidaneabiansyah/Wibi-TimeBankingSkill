'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token is missing. Please check the email link.');
                return;
            }

            try {
                const response = await authService.verifyEmailCode('', token);
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');

                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to verify email. The link may have expired.'
                );
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <m.div 
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Back Link */}
                <div className="mb-6">
                    <Link 
                        href="/login" 
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-card border rounded-2xl shadow-sm p-8">
                    {/* Logo Header */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <Image 
                            src="/wibi.png" 
                            alt="Wibi Logo" 
                            width={40} 
                            height={40}
                            priority
                            className="rounded-lg"
                        />
                        <span className="text-xl font-bold tracking-tight">Wibi</span>
                    </div>

                    {/* Status Content */}
                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center gap-4 py-4">
                            <div className="animate-spin">
                                <Loader2 className="w-12 h-12 text-primary" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">Verifying Email...</h2>
                                <p className="text-sm text-muted-foreground">Please wait while we verify your email address</p>
                            </div>
                        </div>
                    )}

                    {status === 'success' && (
                        <m.div 
                            className="flex flex-col items-center justify-center gap-4 py-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
                                <p className="text-sm text-muted-foreground mb-4">{message}</p>
                                <p className="text-xs text-muted-foreground">Redirecting to login in 3 seconds...</p>
                            </div>
                            <Button 
                                className="w-full h-11 mt-2"
                                onClick={() => router.push('/login')}
                            >
                                Go to Login Now
                            </Button>
                        </m.div>
                    )}

                    {status === 'error' && (
                        <m.div 
                            className="flex flex-col items-center justify-center gap-4 py-4"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="bg-destructive/10 rounded-full p-4">
                                <AlertCircle className="w-12 h-12 text-destructive" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl font-semibold mb-2">Verification Failed</h2>
                                <p className="text-sm text-muted-foreground mb-4">{message}</p>
                            </div>

                            <div className="w-full space-y-3">
                                <Button 
                                    className="w-full h-11"
                                    onClick={() => router.push('/register')}
                                >
                                    Request New Verification Email
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={() => router.push('/login')}
                                >
                                    Back to Login
                                </Button>
                            </div>
                        </m.div>
                    )}

                    {/* Help Box */}
                    <div className="mt-6 bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground text-center">
                            <strong className="text-foreground">Didn't receive the email?</strong><br />
                            Check your spam folder or request a new verification email.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Need help?{' '}
                    <Link href="/contact" className="text-primary hover:underline font-medium">
                        Contact support
                    </Link>
                </div>
            </m.div>
        </div>
    );
}
