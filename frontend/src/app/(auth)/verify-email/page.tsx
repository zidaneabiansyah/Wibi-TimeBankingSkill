import type { Metadata } from 'next';
import VerifyEmailClient from './verify-email-client';

export const metadata: Metadata = {
    title: 'Verify Email - Confirm Your Account | Wibi',
    description: 'Verify your email address to activate your Wibi account. Enter the verification code sent to your email.',
    keywords: ['verify email', 'email verification', 'confirm email', 'activate account'],
};

export default function VerifyEmailPage() {
    return <VerifyEmailClient />;
}
