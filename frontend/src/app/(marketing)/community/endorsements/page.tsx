'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Award, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EndorsementCard } from '@/components/features/community';
import { communityService } from '@/lib/services/community.service';
import { useCommunityStore } from '@/stores/community.store';
import { useAuthStore } from '@/stores/auth.store';
import type { Endorsement } from '@/types';
import { toast } from 'sonner';

export default function EndorsementsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { endorsements, setEndorsements, loading, setLoading, error, setError } = useCommunityStore();
    const [topSkills, setTopSkills] = useState<any[]>([]);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 10;

    useEffect(() => {
        // Only fetch endorsements if authenticated
        if (isAuthenticated) {
            fetchEndorsements();
        }
        // Always fetch top skills (public data)
        fetchTopSkills();
    }, [offset, isAuthenticated]);

    const fetchEndorsements = async () => {
        try {
            setLoading(true);
            // Fetch current user's endorsements
            const data = await communityService.getUserEndorsements(1, limit, offset);
            setEndorsements(data.endorsements);
            setTotal(data.total);
        } catch (err) {
            setError('Failed to load endorsements');
            toast.error('Failed to load endorsements');
        } finally {
            setLoading(false);
        }
    };

    const fetchTopSkills = async () => {
        try {
            const skills = await communityService.getTopEndorsedSkills(5);
            setTopSkills(skills);
        } catch (err) {
            console.error('Failed to fetch top skills:', err);
        }
    };

    const handleDelete = async (endorsementId: number) => {
        if (!confirm('Are you sure you want to delete this endorsement?')) return;

        try {
            await communityService.deleteEndorsement(endorsementId);
            setEndorsements(endorsements.filter((e) => e.id !== endorsementId));
            toast.success('Endorsement deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete endorsement');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="py-12 md:py-16 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/15 border border-primary/20">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                                Skill Endorsements
                            </h1>
                        </div>
                        <p className="text-base text-muted-foreground max-w-2xl">
                            Get recognized for your skills by your peers. Build your professional reputation in our community.
                        </p>
                    </div>
                </div>

                {/* Top Endorsed Skills */}
                {topSkills.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6">Top Endorsed Skills</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {topSkills.map((skill, index) => (
                                <div
                                    key={skill.id || `skill-idx-${index}`}
                                    className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-lg transition-shadow"
                                >
                                    <div className="text-2xl font-bold text-primary mb-2">#{index + 1}</div>
                                    <p className="font-semibold mb-2">{skill.name}</p>
                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                        <Award className="h-4 w-4" />
                                        <span>{skill.endorsement_count || 0} endorsements</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Endorsements List */}
                {!isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                            <Award className="h-8 w-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Login to View Endorsements</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Sign in to see your endorsements and get recognized for your skills by the community.
                        </p>
                        <Button
                            onClick={() => router.push('/login')}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login Now
                        </Button>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-amber-600 mb-4" />
                        <p className="text-muted-foreground">Loading endorsements...</p>
                    </div>
                ) : endorsements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                            <Award className="h-8 w-8 text-amber-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">No Endorsements Yet</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Start building your professional reputation by adding skills and getting endorsed by peers.
                        </p>
                        <Button variant="outline" onClick={fetchEndorsements}>
                            Refresh
                        </Button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold mb-6 mt-8">Your Endorsements ({total})</h2>
                        <div className="space-y-4 mb-8">
                            {endorsements.map((endorsement) => (
                                <div key={endorsement.id} className="relative">
                                    <EndorsementCard
                                        endorsement={endorsement}
                                        onDelete={handleDelete}
                                        canDelete={true}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {total > limit && (
                            <div className="flex items-center justify-center gap-4 py-8 border-t border-border">
                                <Button
                                    variant="outline"
                                    disabled={offset === 0}
                                    onClick={() => setOffset(Math.max(0, offset - limit))}
                                >
                                    ← Previous
                                </Button>
                                <span className="text-sm text-muted-foreground px-4">
                                    {offset + 1} - {Math.min(offset + limit, total)} of {total}
                                </span>
                                <Button
                                    variant="outline"
                                    disabled={offset + limit >= total}
                                    onClick={() => setOffset(offset + limit)}
                                >
                                    Next →
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
