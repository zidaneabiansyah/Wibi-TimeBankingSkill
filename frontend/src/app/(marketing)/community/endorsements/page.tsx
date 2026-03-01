'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Award, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
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
        <div className="min-h-screen bg-background pt-20 md:pt-28">
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-20">
                {/* Header */}
                {/* Hero: Two Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Card 1: Total Saldo / Donasi */}
                    <div className="bg-[#0A0A0A] rounded-[24px] p-8 md:p-10 border border-white/5 shadow-sm relative overflow-hidden transition-all hover:border-white/10 group">
                        <div className="relative z-10">
                            <h2 className="text-[40px] md:text-[52px] font-bold text-white leading-none mb-4 font-['Plus_Jakarta_Sans'] tracking-tight flex flex-col">
                                <span className="text-[24px] text-stone-400 mb-1 font-semibold">Total Saldo</span>
                                {new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(total * 50000)}
                            </h2>
                            <p className="text-stone-400 font-medium text-[15px] md:text-[16px] leading-relaxed max-w-[85%] font-['Plus_Jakarta_Sans'] mt-4">
                                Angka di atas adalah total saldo simulasi dari donasi yang kami terima.
                                Tiap donasi adalah bukti apresiasi dari user Wibi, kami berterimakasih atas donasi yang telah diberikan.
                            </p>
                        </div>
                        <Award className="absolute -right-8 -bottom-8 w-48 h-48 sm:w-64 sm:h-64 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                    </div>

                    {/* Card 2: CTA */}
                    <div className="bg-primary/5 rounded-[24px] p-8 md:p-10 border border-primary/20 relative overflow-hidden flex flex-col justify-between transition-all hover:bg-primary/10 group">
                        <div className="relative z-10 flex flex-col h-full">
                            <div>
                                <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
                                    Beri Donasi
                                </h2>
                                <p className="text-stone-300 font-medium text-[15px] md:text-[16px] leading-relaxed max-w-[85%] font-['Plus_Jakarta_Sans'] mb-8">
                                    Apresiasi Wibi dengan donasi dari mu, itu akan sangat membantu kami dalam pengembangan Wibi.
                                </p>
                            </div>
                            
                            <Button 
                                onClick={() => router.push('/community/forum')}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-primary/20 text-[15px] transition-all w-fit mt-auto"
                            >
                                Mulai Donasi
                            </Button>
                        </div>
                        <Award className="absolute -right-4 -top-4 w-40 h-40 sm:w-56 sm:h-56 text-primary/10 rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-700" strokeWidth={1} />
                    </div>
                </div>

                {/* FAQ Link simulation */}
                <div className="mb-14 text-stone-400 text-[14px] font-medium font-['Plus_Jakarta_Sans']">
                    Cek <Link href="/about" className="text-primary hover:text-primary/80 transition-colors">FAQ</Link> kami untuk pertanyaan seputar dukungan dan donasi.
                </div>

                {/* Top Donators (Simulated from existing unique endorsers) */}
                {endorsements && endorsements.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-[24px] font-bold text-white mb-6 font-['Plus_Jakarta_Sans'] tracking-tight">
                            Top 3 Donators:
                        </h2>
                        {/* Grabbing 3 distinct users for podium look */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {Array.from(new Map(endorsements.map(e => [e.endorser_id, e])).values())
                                .slice(0, 3)
                                .map((endorsement, index) => (
                                <div
                                    key={`top-donator-${endorsement.endorser_id}`}
                                    className="bg-[#0A0A0A] rounded-[20px] border border-white/5 p-6 transition-all hover:bg-white/5 hover:border-white/10 flex flex-col justify-between"
                                >
                                    <div className="mb-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="inline-block px-3 py-1 bg-white/5 text-stone-300 rounded-full text-[12px] font-bold uppercase tracking-widest mb-3">
                                                Peringkat {index + 1}
                                            </div>
                                            {endorsement.endorser?.avatar ? (
                                                <img 
                                                    src={endorsement.endorser.avatar} 
                                                    alt={endorsement.endorser.full_name} 
                                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[14px] border border-primary/20">
                                                    {endorsement.endorser?.full_name?.[0] || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-[20px] text-white font-['Plus_Jakarta_Sans'] leading-tight truncate">
                                            {endorsement.endorser?.full_name || 'Anonymous'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary pt-4 border-t border-white/5">
                                        <Award className="w-5 h-5" strokeWidth={2} />
                                        <span className="text-[18px] sm:text-[20px] font-bold leading-none font-['Plus_Jakarta_Sans']">
                                            {new Intl.NumberFormat('id-ID', {
                                                style: 'currency',
                                                currency: 'IDR',
                                                minimumFractionDigits: 0
                                            }).format(((3 - index) * 150000))}
                                        </span>
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
                        <h3 className="text-xl font-semibold text-foreground mb-2">Belum Ada Donasi</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-6">
                            Mulai tingkatkan reputasi kamu dengan mendistribusikan profil dan menerima donasi.
                        </p>
                        <Button variant="outline" onClick={fetchEndorsements} className="border-white/10 text-white hover:bg-white/5">
                            Refresh Data
                        </Button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-[28px] font-bold mb-6 mt-8 text-white font-['Plus_Jakarta_Sans'] tracking-tight">Riwayat Donasi:</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
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

                        {/* Pagination (See More) */}
                        {endorsements.length < total && (
                            <div className="pt-8 flex justify-center pb-10">
                                <button
                                    onClick={() => setOffset(offset + limit)}
                                    className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-[14px] font-semibold transition-colors border border-white/5"
                                >
                                    See more
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
