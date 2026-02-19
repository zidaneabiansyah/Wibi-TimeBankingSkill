import type { Metadata } from 'next';
import ForgotPasswordClient from './forgot-password-client';

export const metadata: Metadata = {
  title: 'Forgot Password - Reset Your Password | Wibi',
  description: 'Reset your Wibi account password. Enter your email to receive a password reset link.',
  keywords: ['forgot password', 'reset password', 'password recovery', 'account recovery'],
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
