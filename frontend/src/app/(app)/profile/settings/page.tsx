import type { Metadata } from 'next';
import { SettingsClient } from './settings-client';

export const metadata: Metadata = {
    title: 'Settings - Account Settings | Wibi',
    description: 'Manage your account settings, privacy, and preferences.',
    keywords: ['settings', 'account settings', 'privacy', 'preferences', 'security'],
};

export default function SettingsPage() {
    return <SettingsClient />;
}