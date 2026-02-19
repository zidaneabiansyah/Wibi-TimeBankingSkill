import type { Metadata } from 'next';
import RegisterSuccessClient from './register-success-client';

export const metadata: Metadata = {
    title: 'Registration Successful - Check Your Email | Wibi',
    description: 'Your Wibi account has been created! Check your email to verify your account and get started.',
    keywords: ['registration success', 'account created', 'email verification', 'welcome'],
};

export default function RegisterSuccessPage() {
    return <RegisterSuccessClient />;
}
