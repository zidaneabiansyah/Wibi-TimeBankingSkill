'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
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

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    useEffect(() => {
        if (code.every(digit => digit !== '') && email && status !== 'loading' && status !== 'success') {
            handleVerify();
        }
    }, [code, email, status]);

    const handleCodeChange = (index: number, value: string) => {
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
            }, 3000);
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
            setTimeout(() => inputRefs.current[0]?.focus(), 100);
            toast.success('Verification code resent!');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to resend code');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
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
                <div className="bg-card rounded-3xl shadow-xl border border-white/5 p-8 sm:p-10">
                    {status === 'success' ? (
                        <m.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-success" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground mb-3">Email Verified!</h1>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {message}
                            </p>
                            <Button 
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all"
                                onClick={() => router.push('/login')}
                            >
                                Go to Login
                            </Button>
                        </m.div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-10">
                                <h1 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h1>
                                <p className="text-sm text-muted-foreground max-w-70 mx-auto leading-relaxed">
                                    Please enter the 6-digit code sent to<br />
                                    <span className="font-bold text-foreground">{email || 'your email'}</span>
                                </p>
                            </div>

                            {/* Email input if not provided */}
                            {!emailFromUrl && (
                                <div className="mb-8">
                                    <Label className="text-muted-foreground font-normal mb-2 block">Email Address</Label>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-12 px-5 rounded-xl border border-border bg-white/5 text-center text-lg focus:ring-primary focus:border-primary outline-none transition-all text-foreground placeholder:text-muted-foreground/30"
                                    />
                                </div>
                            )}

                            {/* Code Input */}
                            <div className="flex justify-between gap-2 sm:gap-4 mb-8" onPaste={handlePaste}>
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
                                        className="w-12 h-16 sm:w-14 sm:h-20 text-center text-3xl font-bold rounded-2xl border-2 
                                            bg-white/5 border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none
                                            disabled:opacity-50 transition-all duration-300 text-foreground"
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {status === 'error' && (
                                <m.div 
                                    className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-center gap-3 text-sm text-destructive"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <AlertCircle className="w-5 h-5 shrink-0" />
                                    {message}
                                </m.div>
                            )}

                            {/* Verify Button */}
                            <Button
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
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

                            {/* Resend Section */}
                            <div className="mt-10 pt-8 border-t border-white/5 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive a code?{' '}
                                    {resendCooldown > 0 ? (
                                        <span className="font-bold text-foreground">Resend in {resendCooldown}s</span>
                                    ) : (
                                        <button
                                            onClick={handleResend}
                                            className="text-primary hover:underline font-bold transition-all"
                                            disabled={!email}
                                        >
                                            Resend Code
                                        </button>
                                    )}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Help */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Need help? <Link href="/contact" className="hover:text-foreground underline underline-offset-2">Contact support</Link>
                    </p>
                </div>
            </m.div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
