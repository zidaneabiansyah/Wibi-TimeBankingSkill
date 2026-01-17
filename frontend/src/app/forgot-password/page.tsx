'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Mail, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { authService } from '@/lib/services/auth.service';
import { m } from 'framer-motion';

const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const email = watch('email');

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setIsLoading(true);
            await authService.forgotPassword(data.email);
            setSubmittedEmail(data.email);
            setSubmitted(true);
            toast.success('Reset link sent!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
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
                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password?</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email and we'll send you a reset link
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-primary/5 rounded-2xl p-5 mb-8 flex gap-4 border border-primary/10">
                                <AlertCircle className="w-6 h-6 text-primary shrink-0" />
                                <p className="text-sm text-primary/80 leading-relaxed">
                                    A password reset link will be sent to your inbox. The link will expire in <strong className="text-primary font-bold">1 hour</strong> for security.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-muted-foreground font-normal">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40 pointer-events-none" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register('email')}
                                            disabled={isLoading}
                                            className="pl-12 h-12 bg-white/5 border-white/5 focus:ring-primary focus:border-primary rounded-xl text-lg transition-all"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
                                    type="submit"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>
                            </form>

                            {/* Footer */}
                            <div className="mt-10 text-center text-sm border-t pt-8 border-white/5">
                                <p className="text-muted-foreground">
                                    Remember your password?{' '}
                                    <Link href="/login" className="text-primary hover:underline font-bold ml-1 transition-all">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <m.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {/* Success State */}
                            <div className="flex flex-col items-center text-center gap-6 py-6">
                                <div className="bg-success/10 w-20 h-20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-12 h-12 text-success" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground mb-3">Email Sent!</h2>
                                    <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                        We've sent a password reset link to<br />
                                        <span className="font-bold text-foreground">{submittedEmail}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-4 mt-8">
                                <Button 
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-base font-semibold transition-all" 
                                    onClick={() => router.push('/login')}
                                >
                                    Return to Login
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full h-12 border-white/10 text-muted-foreground rounded-xl hover:bg-white/5 hover:text-foreground transition-all font-medium" 
                                    onClick={() => setSubmitted(false)}
                                >
                                    Try Another Email
                                </Button>
                            </div>

                            <p className="mt-8 text-center text-xs text-muted-foreground/40">
                                Check spam folder if you don't see the email within a few minutes.
                            </p>
                        </m.div>
                    )}
                </div>
            </m.div>
        </div>
    );
}
