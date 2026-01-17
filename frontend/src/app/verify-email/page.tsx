'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { m } from 'framer-motion';
import api from '@/lib/api';

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';
    
    const [email, setEmail] = useState(emailFromUrl);
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [status, setStatus] = useState<'input' | 'loading' | 'success' | 'error'>('input');
    const [message, setMessage] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Auto-submit when all 6 digits are entered
    useEffect(() => {
        if (code.every(digit => digit !== '') && email) {
            handleVerify();
        }
    }, [code]);

    const handleCodeChange = (index: number, value: string) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length === 6) {
            const newCode = pastedData.split('');
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6 || !email) return;

        try {
            setStatus('loading');
            await api.post('/auth/verify-email', { email, code: fullCode });
            setStatus('success');
            setMessage('Email verified successfully! You can now login.');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (error: any) {
            setStatus('error');
            setMessage(
                error?.response?.data?.message ||
                error?.message ||
                'Invalid or expired verification code.'
            );
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0 || !email) return;

        try {
            await api.post('/auth/resend-verification', { email });
            setResendCooldown(60);
            setCode(['', '', '', '', '', '']);
            setStatus('input');
            setMessage('');
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            setMessage(error?.response?.data?.message || 'Failed to resend code');
        }
    };

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
                        Back to sign-in
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

                    {status === 'success' ? (
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
                                <p className="text-sm text-muted-foreground">{message}</p>
                            </div>
                            <Button 
                                className="w-full h-11 mt-2"
                                onClick={() => router.push('/login')}
                            >
                                Go to Login
                            </Button>
                        </m.div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-xl font-semibold mb-2">Verify your email</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter the code sent to{' '}
                                    <span className="font-medium text-foreground">{email || 'your email'}</span>
                                </p>
                            </div>

                            {/* Email input if not provided */}
                            {!emailFromUrl && (
                                <div className="mb-6">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 px-4 rounded-lg border bg-background text-center"
                                    />
                                </div>
                            )}

                            {/* Code Input */}
                            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={status === 'loading'}
                                        className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 
                                            bg-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20
                                            disabled:opacity-50 transition-all"
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {status === 'error' && (
                                <m.div 
                                    className="mb-4 p-3 bg-destructive/10 rounded-lg flex items-center gap-2 text-sm text-destructive"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {message}
                                </m.div>
                            )}

                            {/* Verify Button */}
                            <Button
                                className="w-full h-11"
                                onClick={handleVerify}
                                disabled={status === 'loading' || code.some(d => !d) || !email}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify Email'
                                )}
                            </Button>

                            {/* Resend */}
                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                Didn't receive a code?{' '}
                                {resendCooldown > 0 ? (
                                    <span>Resend ({resendCooldown})</span>
                                ) : (
                                    <button
                                        onClick={handleResend}
                                        className="text-primary hover:underline font-medium"
                                        disabled={!email}
                                    >
                                        Resend
                                    </button>
                                )}
                            </div>
                        </>
                    )}
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

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
