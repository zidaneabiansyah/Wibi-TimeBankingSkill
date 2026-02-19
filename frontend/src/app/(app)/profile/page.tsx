import type { Metadata } from 'next';
import { ProfileClient } from './profile-client';

export const metadata: Metadata = {
  title: 'My Profile - View Your Information | Wibi',
  description: 'View and manage your profile. See your skills, reviews, statistics, and account information.',
  keywords: ['profile', 'my account', 'user profile', 'account settings', 'personal info'],
};

export default function ProfilePage() {
  return <ProfileClient />;
}
