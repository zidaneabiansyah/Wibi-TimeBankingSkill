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
import { ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import { authService } from '@/lib/services/auth.service';

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
  };    return (
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
                    {!submitted ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-orange-100 rounded-full p-3">
                                        <Mail className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
                                <p className="text-gray-600">
                                    Enter your email and we'll send you a link to reset your password
                                </p>
                            </div>

                            {/* Info Box */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800">
                                    The reset link will expire in <strong>1 hour</strong> for security reasons.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your registered email"
                                        {...register('email')}
                                        disabled={isLoading}
                                        className="bg-muted/50"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    className="w-full bg-orange-500 hover:bg-orange-600 text-white h-10"
                                    type="submit"
                                    disabled={isLoading || !email}
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </Button>
                            </form>

                            {/* Footer */}
                            <div className="mt-6 text-center text-sm">
                                <p className="text-gray-600">
                                    Remember your password?{' '}
                                    <Link href="/login" className="text-orange-500 hover:underline font-medium">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success Message */}
                            <div className="text-center mb-8">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <Mail className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email sent!</h1>
                                <p className="text-gray-600">
                                    We've sent a password reset link to <br />
                                    <span className="font-semibold text-gray-900">{submittedEmail}</span>
                                </p>
                            </div>

                            {/* Instructions */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 space-y-3">
                                <h3 className="font-semibold text-gray-900">Next steps:</h3>
                                <ol className="space-y-2 text-sm text-gray-700">
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-orange-500 min-w-6">1.</span>
                                        Check your inbox for the reset email
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-orange-500 min-w-6">2.</span>
                                        Click the password reset link in the email
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-orange-500 min-w-6">3.</span>
                                        Create a new password
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="font-semibold text-orange-500 min-w-6">4.</span>
                                        Login with your new password
                                    </li>
                                </ol>
                            </div>

                            {/* Tips */}
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-amber-800">
                                    <strong>💡 Tip:</strong> Check your spam or junk folder if you don't see the email.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 text-center"
                                >
                                    Return to Login
                                </Link>

                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setSubmitted(false)}
                                >
                                    Try Another Email
                                </Button>
                            </div>

                            {/* Support */}
                            <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
                                <p>
                                    Didn't receive the email?{' '}
                                    <a href="mailto:support@wibi.com" className="text-orange-500 hover:underline font-semibold">
                                        Contact support
                                    </a>
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
