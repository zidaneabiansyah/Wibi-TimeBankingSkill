'use client';

import Link from 'next/link';
import { Award, X } from 'lucide-react';
import type { Endorsement } from '@/types';
import { Button } from '@/components/ui/button';

interface EndorsementCardProps {
    endorsement: Endorsement;
    onDelete?: (endorsementId: number) => void;
    canDelete?: boolean;
}

export function EndorsementCard({
    endorsement,
    onDelete,
    canDelete = false,
}: EndorsementCardProps) {
    return (
        <div className="relative bg-[#0A0A0A] rounded-[24px] border border-white/5 p-6 transition-all hover:bg-white/5 hover:border-white/10 h-full flex flex-col justify-between font-['Plus_Jakarta_Sans'] group shadow-sm">
            {/* Delete button (only visible on hover) */}
            {canDelete && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete?.(endorsement.id)}
                    className="absolute top-4 right-4 text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all p-2 h-auto rounded-full"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            <div className="flex flex-col h-full">
                {/* Header (Top Label and Name) */}
                <div className="flex justify-between items-start mb-6 pr-12">
                    <div className="flex flex-col">
                        <div className="inline-block px-3 py-1 bg-white/5 text-stone-300 rounded-full text-[11px] font-bold uppercase tracking-wider w-fit mb-3 border border-white/5">
                            Donasi
                        </div>
                        <Link href={`/profile/${endorsement.endorser?.id}`}>
                            <div className="font-bold text-[16px] text-white hover:text-primary transition-colors leading-tight">
                                {endorsement.endorser?.full_name || 'Anonymous'}
                            </div>
                        </Link>
                        {endorsement.endorser?.email && (
                            <div className="text-[13px] font-medium text-stone-500 truncate max-w-[200px] mt-0.5">
                                {endorsement.endorser.email.length > 25 
                                    ? endorsement.endorser.email.substring(0, 22) + '...' 
                                    : endorsement.endorser.email}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content (Simulated Amount) */}
                <div className="mb-6">
                    <div className="text-[28px] font-bold text-primary leading-tight tracking-tight">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR',
                            minimumFractionDigits: 0
                        }).format(((endorsement.id % 10) + 1) * 25000)}
                    </div>
                </div>

                {/* Message and Date (Bottom Section) */}
                <div className="mt-auto flex flex-col gap-4">
                    {endorsement.message ? (
                        <div className="relative">
                            <div className="absolute left-0 top-1 bottom-1 w-[3px] bg-primary/40 rounded-full" />
                            <div className="text-[14px] font-medium text-stone-300 italic pl-4 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/5">
                                "{endorsement.message}"
                            </div>
                        </div>
                    ) : (
                        <div className="text-[14px] font-medium text-stone-500 italic">
                            Tanpa pesan donasi.
                        </div>
                    )}
                    
                    <div className="text-[12px] font-semibold text-stone-500 mt-2 border-t border-white/5 pt-4">
                        {new Date(endorsement.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).replace(',', ' pukul')}
                    </div>
                </div>
            </div>
        </div>
    );
}
