'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { authService } from '@/lib/services/auth.service';

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

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [tokenChecking, setTokenChecking] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const newPassword = watch('newPassword');

    // Calculate password strength
    useEffect(() => {
        if (!newPassword) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (newPassword.length >= 6) strength++;
        if (newPassword.length >= 8) strength++;
        if (/[A-Z]/.test(newPassword)) strength++;
        if (/[a-z]/.test(newPassword)) strength++;
        if (/[0-9]/.test(newPassword)) strength++;
        if (/[!@#$%^&*]/.test(newPassword)) strength++;

        setPasswordStrength(Math.min(strength, 5));
    }, [newPassword]);

    // Check token validity on mount
    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            setTokenChecking(false);
            return;
        }
        // Token validation happens after submission
        setTokenValid(true);
        setTokenChecking(false);
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;

        try {
            setIsLoading(true);
            await authService.resetPassword(token, data.newPassword, data.confirmPassword);
            setResetSuccess(true);
            toast.success('Password reset successfully! Redirecting to login...');

            setTimeout(() => {
                router.push('/login');
            }, 2000);
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

    if (tokenChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
                    <p className="text-gray-600">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    if (!tokenValid && !resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-red-100 rounded-full p-3">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid or Expired Link</h1>
                    <p className="text-gray-600 mb-6">
                        The password reset link is invalid or has expired. Please request a new one.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/forgot-password"
                            className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Request New Reset Link
                        </Link>
                        <Link
                            href="/login"
                            className="block w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 rounded-full p-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successfully!</h1>
                    <p className="text-gray-600 mb-6">
                        Your password has been reset. You can now login with your new password.
                    </p>
                    <p className="text-sm text-gray-500">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <div className="mb-8">
                    <Link
                        href="/login"
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Login
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Password</h1>
                        <p className="text-gray-600">
                            Enter your new password and confirm it
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                {...register('newPassword')}
                                disabled={isLoading}
                                className="bg-muted/50"
                            />
                            {errors.newPassword && (
                                <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                            )}

                            {/* Password Strength Indicator */}
                            {newPassword && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex gap-1 h-2">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-full transition-colors ${i < passwordStrength
                                                        ? passwordStrength <= 2
                                                            ? 'bg-red-500'
                                                            : passwordStrength <= 3
                                                                ? 'bg-yellow-500'
                                                                : 'bg-green-500'
                                                        : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {passwordStrength <= 2 && 'Weak password'}
                                        {passwordStrength === 3 && 'Fair password'}
                                        {passwordStrength >= 4 && 'Strong password'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                {...register('confirmPassword')}
                                disabled={isLoading}
                                className="bg-muted/50"
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs space-y-1">
                            <p className="font-semibold text-blue-900">Password must contain:</p>
                            <ul className="space-y-1 text-blue-800">
                                <li className={newPassword?.length >= 6 ? 'line-through opacity-50' : ''}>
                                    ✓ At least 6 characters
                                </li>
                                <li className={/[A-Z]/.test(newPassword) ? 'line-through opacity-50' : ''}>
                                    ✓ One uppercase letter
                                </li>
                                <li className={/[a-z]/.test(newPassword) ? 'line-through opacity-50' : ''}>
                                    ✓ One lowercase letter
                                </li>
                                <li className={/[0-9]/.test(newPassword) ? 'line-through opacity-50' : ''}>
                                    ✓ One number
                                </li>
                            </ul>
                        </div>

                        <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10"
                            type="submit"
                            disabled={isLoading || Object.keys(errors).length > 0}
                        >
                            {isLoading ? 'Resetting Password...' : 'Reset Password'}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                        <p>
                            Changed your mind?{' '}
                            <Link href="/login" className="text-orange-500 hover:underline font-medium">
                                Go back to login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
