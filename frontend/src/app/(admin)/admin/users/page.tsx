import type { Metadata } from 'next';
import UsersClient from './users-client';

export const metadata: Metadata = {
    title: 'User Management - Admin Panel | Wibi',
    description: 'Manage and monitor all platform users. View user details, suspend or activate accounts.',
    keywords: ['admin', 'users', 'user management', 'accounts'],
};

export default function UsersPage() {
    return <UsersClient />;
}
