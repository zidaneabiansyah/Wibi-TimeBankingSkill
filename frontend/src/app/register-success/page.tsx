'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterSuccessPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get email from localStorage if available
        const savedEmail = localStorage.getItem('registrationEmail');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="flex justify-center mb-6">
                        <div className="bg-orange-100 rounded-full p-4">
                            <Mail className="w-8 h-8 text-orange-600" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                        <p className="text-gray-600">
                            We've sent a verification link to <br />
                            <span className="font-semibold text-gray-900">{email || 'your email address'}</span>
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="space-y-4 mb-8">
                        <div className="flex gap-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
                                    1
                                </div>
                                <div className="ml-3 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">Check your inbox</p>
                                    <p className="text-sm text-gray-600">Look for an email from Wibi</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
                                    2
                                </div>
                                <div className="ml-3 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">Click the verification link</p>
                                    <p className="text-sm text-gray-600">The link will expire in 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold text-sm">
                                    3
                                </div>
                                <div className="ml-3 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">You're all set!</p>
                                    <p className="text-sm text-gray-600">Then login to your account</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-blue-800">
                            <strong>Tip:</strong> If you don't see the email, check your spam or junk folder.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <Link
                            href="/login"
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                        >
                            Go to Login
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <Link
                            href="/register"
                            className="block w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition duration-200 text-center"
                        >
                            Use Different Email
                        </Link>
                    </div>

                    {/* Support Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                        <p>
                            Need help?{' '}
                            <a href="mailto:support@wibi.com" className="text-orange-500 hover:underline font-semibold">
                                Contact support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
