import type { Metadata } from 'next';
import { EditProfileClient } from './edit-profile-client';

export const metadata: Metadata = {
    title: 'Edit Profile - Update Your Information | Wibi',
    description: 'Update your profile information, bio, and contact details.',
    keywords: ['edit profile', 'update profile', 'account settings', 'personal information'],
};

export default function EditProfilePage() {
    return <EditProfileClient />;
}
