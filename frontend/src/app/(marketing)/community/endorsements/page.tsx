'use client';

import { useEffect, useState } from 'react';
import { Loader2, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { communityService } from '@/lib/services/community.service';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

interface Donation {
    id: number;
    donor_id: number | null;
    donor?: {
        full_name: string;
        username: string;
        avatar?: string;
    } | null;
    amount: number;
    message: string;
    is_anonymous: boolean;
    created_at: string;
}

const formatRupiah = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);

export default function EndorsementsPage() {
    const { isAuthenticated } = useAuthStore();
    const [donations, setDonations] = useState<Donation[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [total, setTotal] = useState(0);
    const limit = 12;

    useEffect(() => {
        fetchDonations();
    }, [offset]);

    const fetchDonations = async () => {
        try {
            setLoading(true);
            const data = await communityService.getUserEndorsements(1, limit, offset);
            const list: Donation[] = (data.endorsements as any[]) || [];
            setDonations(prev => offset === 0 ? list : [...prev, ...list]);
            setTotal(data.total ?? 0);

            // Sum total amount from all donations
            const sum = list.reduce((acc: number, d: Donation) => acc + (d.amount || 0), 0);
            setTotalAmount(prev => offset === 0 ? sum : prev + sum);
        } catch (err) {
            console.error('Failed to fetch donations:', err);
            toast.error('Gagal memuat data donasi');
        } finally {
            setLoading(false);
        }
    };

    const top3 = donations.slice(0, 3);

    return (
        <div className="min-h-screen bg-background pt-20 md:pt-28">
            <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-20 pb-20">

                {/* Hero Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Total Donasi */}
                    <div className="bg-[#0A0A0A] rounded-[24px] p-8 md:p-10 border border-white/5 shadow-sm relative overflow-hidden transition-all hover:border-white/10 group">
                        <div className="relative z-10">
                            <h2 className="text-[40px] md:text-[52px] font-bold text-white leading-none mb-4 font-['Plus_Jakarta_Sans'] tracking-tight flex flex-col">
                                <span className="text-[24px] text-stone-400 mb-1 font-semibold">Total Donasi Terkumpul</span>
                                {loading ? (
                                    <span className="text-stone-500 text-[32px]">Menghitung...</span>
                                ) : (
                                    formatRupiah(totalAmount)
                                )}
                            </h2>
                            <p className="text-stone-400 font-medium text-[15px] md:text-[16px] leading-relaxed max-w-[85%] font-['Plus_Jakarta_Sans'] mt-4">
                                Setiap donasi adalah bukti nyata dukungan dari anggota komunitas Wibi.
                                Terima kasih telah membantu kami terus berkembang! 🙏
                            </p>
                        </div>
                        <Award className="absolute -right-8 -bottom-8 w-48 h-48 sm:w-64 sm:h-64 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                    </div>

                    {/* CTA Donasi */}
                    <div className="bg-primary/5 rounded-[24px] p-8 md:p-10 border border-primary/20 relative overflow-hidden flex flex-col justify-between transition-all hover:bg-primary/10 group">
                        <div className="relative z-10 flex flex-col h-full">
                            <div>
                                <h2 className="text-[32px] md:text-[40px] font-bold text-white leading-tight mb-3 font-['Plus_Jakarta_Sans'] tracking-tight">
                                    Beri Donasi 💖
                                </h2>
                                <p className="text-stone-300 font-medium text-[15px] md:text-[16px] leading-relaxed max-w-[85%] font-['Plus_Jakarta_Sans'] mb-8">
                                    Apresiasi Wibi dengan donasi dari kamu. Setiap kontribusi sangat membantu kami
                                    dalam mengembangkan platform untuk semua pelajar Indonesia.
                                </p>
                            </div>
                            {isAuthenticated ? (
                                <Button
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 px-8 rounded-xl shadow-lg hover:shadow-primary/20 text-[15px] transition-all w-fit mt-auto"
                                >
                                    <Heart className="mr-2 h-4 w-4" />
                                    Donasi Sekarang
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => window.location.href = '/login'}
                                    variant="outline"
                                    className="border-primary/30 text-primary hover:bg-primary/10 font-semibold py-6 px-8 rounded-xl text-[15px] transition-all w-fit mt-auto"
                                >
                                    Login untuk Donasi
                                </Button>
                            )}
                        </div>
                        <Award className="absolute -right-4 -top-4 w-40 h-40 sm:w-56 sm:h-56 text-primary/10 rotate-12 pointer-events-none group-hover:rotate-45 transition-transform duration-700" strokeWidth={1} />
                    </div>
                </div>

                {/* Top 3 Donatur */}
                {top3.length > 0 && (
                    <div className="mb-14">
                        <h2 className="text-[24px] font-bold text-white mb-6 font-['Plus_Jakarta_Sans'] tracking-tight">
                            🏆 Top Donatur
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {top3.map((donation, index) => (
                                <div
                                    key={`top-${donation.id}`}
                                    className="bg-[#0A0A0A] rounded-[20px] border border-white/5 p-6 transition-all hover:bg-white/5 hover:border-white/10 flex flex-col justify-between"
                                >
                                    <div className="mb-4 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="inline-block px-3 py-1 bg-white/5 text-stone-300 rounded-full text-[12px] font-bold uppercase tracking-widest">
                                                #{index + 1}
                                            </div>
                                            {!donation.is_anonymous && donation.donor?.avatar ? (
                                                <img
                                                    src={donation.donor.avatar}
                                                    alt={donation.donor.full_name}
                                                    className="w-10 h-10 rounded-full object-cover border border-white/10"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[14px] border border-primary/20">
                                                    {donation.is_anonymous ? '?' : (donation.donor?.full_name?.[0] || 'U')}
                                                </div>
                                            )}
                                        </div>
                                        <p className="font-bold text-[20px] text-white font-['Plus_Jakarta_Sans'] leading-tight truncate">
                                            {donation.is_anonymous ? 'Donatur Anonim' : (donation.donor?.full_name || 'Unknown')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary pt-4 border-t border-white/5">
                                        <Heart className="w-4 h-4" strokeWidth={2} />
                                        <span className="text-[18px] font-bold leading-none font-['Plus_Jakarta_Sans']">
                                            {formatRupiah(donation.amount)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Riwayat Donasi */}
                <h2 className="text-[26px] font-bold mb-6 text-white font-['Plus_Jakarta_Sans'] tracking-tight">
                    Riwayat Donasi ({total})
                </h2>

                {loading && donations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Memuat donasi...</p>
                    </div>
                ) : donations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Heart className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Belum Ada Donasi</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Jadilah yang pertama mendukung Wibi! Donasi kamu akan sangat berarti bagi kami.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                            {donations.map((donation) => (
                                <div
                                    key={donation.id}
                                    className="bg-[#0A0A0A] rounded-[20px] border border-white/5 p-6 hover:border-white/10 hover:bg-white/2 transition-all"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        {!donation.is_anonymous && donation.donor?.avatar ? (
                                            <img
                                                src={donation.donor.avatar}
                                                alt={donation.donor.full_name}
                                                className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[14px] border border-primary/20 shrink-0">
                                                {donation.is_anonymous ? '?' : (donation.donor?.full_name?.[0] || 'U')}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-semibold text-white text-[15px] truncate">
                                                {donation.is_anonymous ? 'Donatur Anonim' : (donation.donor?.full_name || 'Unknown')}
                                            </p>
                                            <p className="text-stone-500 text-[12px]">
                                                {new Date(donation.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-primary mb-3">
                                        <Heart className="w-4 h-4 shrink-0" strokeWidth={2} />
                                        <span className="text-[20px] font-bold font-['Plus_Jakarta_Sans']">
                                            {formatRupiah(donation.amount)}
                                        </span>
                                    </div>

                                    {donation.message && (
                                        <p className="text-stone-400 text-[13px] leading-relaxed italic border-t border-white/5 pt-3">
                                            "{donation.message}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {donations.length < total && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setOffset(offset + limit)}
                                    disabled={loading}
                                    className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white text-[14px] font-semibold transition-colors border border-white/5 disabled:opacity-50"
                                >
                                    {loading ? 'Memuat...' : 'Lihat Lebih Banyak'}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
