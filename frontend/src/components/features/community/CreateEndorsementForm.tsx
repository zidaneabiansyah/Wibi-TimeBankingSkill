'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { toast } from 'sonner';

interface CreateEndorsementFormProps {
    userId: number;
    skillId: number;
    onSuccess?: () => void;
}

export function CreateEndorsementForm({ userId, skillId, onSuccess }: CreateEndorsementFormProps) {
    const { addEndorsement } = useCommunityStore();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const endorsement = await communityService.createEndorsement(userId, skillId, message);
            addEndorsement(endorsement);
            setMessage('');
            toast.success('Endorsement created successfully!');
            onSuccess?.();
        } catch (err) {
            toast.error('Failed to create endorsement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a message to your endorsement..."
                    rows={4}
                    className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Endorsing...' : 'Endorse Skill'}
            </Button>
        </form>
    );
}
