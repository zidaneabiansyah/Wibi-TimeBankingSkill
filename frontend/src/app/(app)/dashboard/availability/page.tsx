import type { Metadata } from 'next';
import { AvailabilityClient } from './availability-client';

export const metadata: Metadata = {
    title: 'My Availability - Set Your Schedule | Wibi',
    description: 'Manage your teaching availability. Set your schedule, time slots, and let students know when you are available.',
    keywords: ['availability', 'schedule', 'time slots', 'teaching hours', 'calendar'],
};

export default function AvailabilityPage() {
    return <AvailabilityClient />;
}
