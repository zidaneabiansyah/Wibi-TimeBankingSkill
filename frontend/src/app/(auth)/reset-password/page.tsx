import type { Metadata } from 'next';
import ResetPasswordClient from './reset-password-client';

export const metadata: Metadata = {
    title: 'Reset Password - Create New Password | Wibi',
    description: 'Create a new password for your Wibi account. Enter your new password to regain access.',
    keywords: ['reset password', 'new password', 'change password', 'password recovery'],
};

export default function ResetPasswordPage() {
    return <ResetPasswordClient />;
}
