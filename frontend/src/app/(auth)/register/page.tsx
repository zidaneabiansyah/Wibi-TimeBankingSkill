import type { Metadata } from 'next';
import RegisterClient from './register-client';

export const metadata: Metadata = {
  title: 'Register - Create Your Account | Wibi',
  description: 'Join Wibi Time Banking community. Create an account to start exchanging skills with peers and grow together.',
  keywords: ['register', 'sign up', 'create account', 'time banking', 'skill exchange', 'student community'],
  openGraph: {
    title: 'Register - Wibi Time Banking',
    description: 'Join the community and start exchanging skills today',
    type: 'website',
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
