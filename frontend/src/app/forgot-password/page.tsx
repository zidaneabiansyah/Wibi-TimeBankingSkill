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
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';
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
            toast.success('Check your email for password reset instructions');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
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

                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h1 className="text-xl font-semibold mb-2">Forgot your password?</h1>
                                <p className="text-sm text-muted-foreground">
                                    Enter your email and we'll send you a reset link
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-6 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <p className="text-sm text-muted-foreground">
                                    The reset link will expire in <strong className="text-foreground">1 hour</strong> for security.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register('email')}
                                            disabled={isLoading}
                                            className="pl-10 h-11"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-xs text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full h-11"
                                    type="submit"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Reset Link'
                                    )}
                                </Button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                Remember your password?{' '}
                                <Link href="/login" className="text-primary hover:underline font-medium">
                                    Login here
                                </Link>
                            </div>
                        </>
                    ) : (
                        <m.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {/* Success Header */}
                            <div className="flex flex-col items-center text-center gap-4 mb-6">
                                <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-4">
                                    <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Email Sent!</h2>
                                    <p className="text-sm text-muted-foreground">
                                        We've sent a password reset link to<br />
                                        <span className="font-semibold text-foreground">{submittedEmail}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-2">
                                <h3 className="font-semibold text-sm">Next steps:</h3>
                                <ol className="space-y-1 text-sm text-muted-foreground">
                                    <li>1. Check your inbox for the reset email</li>
                                    <li>2. Click the password reset link</li>
                                    <li>3. Create a new password</li>
                                </ol>
                            </div>

                            {/* Tip */}
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-6">
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    💡 Check spam folder if you don't see the email.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Button className="w-full h-11" onClick={() => router.push('/login')}>
                                    Return to Login
                                </Button>
                                <Button variant="outline" className="w-full h-11" onClick={() => setSubmitted(false)}>
                                    Try Another Email
                                </Button>
                            </div>
                        </m.div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Need help?{' '}
                    <a href="mailto:support@wibi.com" className="text-primary hover:underline font-medium">
                        Contact support
                    </a>
                </div>
            </m.div>
        </div>
    );
}
