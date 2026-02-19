import type { Metadata } from 'next';
import LoginClient from './login-client';

export const metadata: Metadata = {
    title: 'Login - Sign in to Your Account | Wibi',
    description: 'Sign in to Wibi Time Banking. Exchange skills, connect with peers, and grow together using time as your currency.',
    keywords: ['login', 'sign in', 'time banking', 'skill exchange', 'student community'],
    openGraph: {
        title: 'Login - Wibi Time Banking',
        description: 'Sign in to exchange skills and build community',
        type: 'website',
    },
};

export default function LoginPage() {
    return <LoginClient />;
}
