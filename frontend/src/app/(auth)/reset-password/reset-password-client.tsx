'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Check } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.service';
import { m } from 'framer-motion';

const resetPasswordSchema = z.object({
    newPassword: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain uppercase letter')
        .regex(/[a-z]/, 'Password must contain lowercase letter')
        .regex(/[0-9]/, 'Password must contain number'),
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange'
    });

    const newPassword = watch('newPassword') || '';

    // Calculate password strength (0 to 5)
    useEffect(() => {
        if (!newPassword) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (newPassword.length >= 6) strength++;
        if (/[A-Z]/.test(newPassword)) strength++;
        if (/[a-z]/.test(newPassword)) strength++;
        if (/[0-9]/.test(newPassword)) strength++;
        if (newPassword.length >= 10) strength++;

        setPasswordStrength(strength);
    }, [newPassword]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error('No reset token found');
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword(token, data.newPassword, data.confirmPassword);
            setResetSuccess(true);
            toast.success('Password reset successfully!');

            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Failed to reset password';
            toast.error(errorMsg);
            if (errorMsg.includes('expired') || errorMsg.includes('invalid')) {
                setTokenValid(false);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-white/5 p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-foreground mb-2">No Reset Token</h1>
                    <p className="text-muted-foreground mb-6">The password reset link is missing its token.</p>
                    <Link href="/forgot-password">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Request New Link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!tokenValid) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-white/5 p-8 text-center">
                    <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-foreground mb-2">Expired or Invalid Link</h1>
                    <p className="text-muted-foreground mb-6">This password reset link is no longer valid. Please request a new one.</p>
                    <Link href="/forgot-password">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Request New Link</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <m.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-card rounded-3xl shadow-xl border border-white/5 p-8 text-center"
                >
                    <div className="bg-success/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground mb-2">Password Reset!</h1>
                    <p className="text-muted-foreground mb-6">Your password has been changed successfully. Redirecting to login...</p>
                    <Link href="/login">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Back to Login</Button>
                    </Link>
                </m.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
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
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-foreground mb-2">Create New Password</h1>
                        <p className="text-sm text-muted-foreground">
                            Enter your new password and confirm it
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="text-muted-foreground font-normal">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••••••"
                                {...register('newPassword')}
                                disabled={isLoading}
                                className="h-12 bg-white/5 border-white/5 focus:ring-primary focus:border-primary rounded-xl text-lg transition-all"
                            />
                            
                            {/* Password Strength Indicator */}
                            <div className="pt-2">
                                <div className="flex gap-1.5 h-1.5 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full transition-all duration-300 ${
                                                i < passwordStrength
                                                    ? 'bg-success'
                                                    : 'bg-white/5'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground/50">
                                    {passwordStrength <= 1 && newPassword ? 'Weak password' : 
                                     passwordStrength <= 3 && newPassword ? 'Fair password' : 
                                     passwordStrength >= 4 ? 'Strong password' : ' '}
                                </p>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" className="text-muted-foreground font-normal">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••••••"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                                className="h-12 bg-white/5 border-white/5 focus:ring-primary focus:border-primary rounded-xl text-lg transition-all"
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-destructive font-medium mt-1">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Requirements Box */}
                        <div className="bg-primary/5 rounded-2xl p-5 space-y-3 border border-primary/10">
                            <p className="text-sm font-bold text-primary">Password must contain:</p>
                            <ul className="space-y-2">
                                <RequirementItem 
                                    text="At least 6 characters" 
                                    isMet={newPassword.length >= 6} 
                                />
                                <RequirementItem 
                                    text="One uppercase letter" 
                                    isMet={/[A-Z]/.test(newPassword)} 
                                />
                                <RequirementItem 
                                    text="One lowercase letter" 
                                    isMet={/[a-z]/.test(newPassword)} 
                                />
                                <RequirementItem 
                                    text="One number" 
                                    isMet={/[0-9]/.test(newPassword)} 
                                />
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-primary/20"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Resetting Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </Button>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-10 text-center text-sm border-t pt-8 border-white/5">
                        <p className="text-muted-foreground">
                            Changed your mind?{' '}
                            <Link href="/login" className="text-primary hover:underline font-bold ml-1 transition-all">
                                Go back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </m.div>
        </div>
    );
}

function RequirementItem({ text, isMet }: { text: string; isMet: boolean }) {
    return (
        <li className={`flex items-center gap-2 text-sm transition-all duration-300 ${
            isMet ? 'text-primary line-through opacity-100' : 'text-primary/60'
        }`}>
            <Check className={`w-3.5 h-3.5 ${isMet ? 'opacity-100' : 'opacity-40'}`} />
            {text}
        </li>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
