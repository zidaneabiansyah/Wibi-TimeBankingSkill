'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.service';

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
                // Call the backend to verify email with token
                const response = await authService.verifyEmailCode('', token);
                setStatus('success');
                setMessage('Email verified successfully! You can now login.');

                // Redirect to login after 3 seconds
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } catch (error: any) {
                setStatus('error');
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to verify email. The link may have expired. Please request a new verification email.'
                );
            }
        };

        verifyEmail();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8 text-center">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h1>
                        <p className="text-gray-600">Verifying your email address...</p>
                    </div>

                    {/* Status Content */}
                    {status === 'loading' && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="animate-spin">
                                <Loader2 className="w-12 h-12 text-orange-500" />
                            </div>
                            <p className="text-gray-600">Please wait while we verify your email...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="bg-green-100 rounded-full p-4">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Verified!</h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                                <p className="text-sm text-gray-500">Redirecting to login in 3 seconds...</p>
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="bg-red-100 rounded-full p-4">
                                <AlertCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
                                <p className="text-gray-600 mb-6">{message}</p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-8 space-y-3">
                        {status === 'error' && (
                            <>
                                <Link
                                    href="/register"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Request New Verification Email
                                </Link>
                                <Link
                                    href="/login"
                                    className="block w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition duration-200"
                                >
                                    Back to Login
                                </Link>
                            </>
                        )}

                        {status === 'success' && (
                            <Link
                                href="/login"
                                className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                            >
                                Go to Login
                            </Link>
                        )}
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Didn't receive the email?</strong> Check your spam folder or request a new verification email from the registration page.
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Need help? <Link href="/contact" className="text-orange-500 hover:underline">Contact support</Link></p>
                </div>
            </div>
        </div>
    );
}
