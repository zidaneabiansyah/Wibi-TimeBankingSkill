'use client';

import { useEffect, useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { availabilityService } from '@/lib/services';
import type { AvailabilitySlot } from '@/types';
import { Calendar, Clock } from 'lucide-react';

interface TeacherAvailabilityProps {
    userId: number;
    compact?: boolean;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TeacherAvailability({ userId, compact = false }: TeacherAvailabilityProps) {
    const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const data = await availabilityService.getUserAvailability(userId);
                setAvailability(data.availability);
            } catch (error) {
                console.error("Failed to fetch teacher availability", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchAvailability();
        }
    }, [userId]);

    if (isLoading) {
        return <div className="h-6 w-24 animate-pulse bg-muted rounded"></div>;
    }

    if (availability.length === 0) {
        return (
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs italic">
                <Calendar className="h-3 w-3" />
                No schedule set
            </div>
        );
    }

    // Group by day
    const groupedAvailability: Record<number, AvailabilitySlot[]> = {};
    availability.forEach(slot => {
        if (!groupedAvailability[slot.day_of_week]) {
            groupedAvailability[slot.day_of_week] = [];
        }
        groupedAvailability[slot.day_of_week].push(slot);
    });

    if (compact) {
        return (
            <TooltipProvider>
                <div className="flex gap-1" aria-label="Weekly availability">
                    {DAYS.map((day, index) => {
                        const daySlots = groupedAvailability[index] || [];
                        const hasAvailability = daySlots.length > 0;
                        
                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <div 
                                        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                            hasAvailability 
                                                ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20' 
                                                : 'bg-muted/30 text-muted-foreground/30 border border-transparent'
                                        }`}
                                    >
                                        {day[0]}
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="space-y-1 p-1">
                                        <p className="font-semibold text-xs border-b border-border/50 pb-1 mb-1">{DAYS[index]} Availability</p>
                                        {hasAvailability ? (
                                            daySlots.map((slot, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                    <Clock className="h-3 w-3 text-primary/70" />
                                                    {slot.start_time} - {slot.end_time}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[10px] italic text-muted-foreground">No slots available</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </TooltipProvider>
        );
    }

    return (
        <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Teaching Schedule
            </h4>
            <div className="flex flex-wrap gap-1.5">
                {DAYS.map((day, index) => {
                    const hasAvailability = !!groupedAvailability[index];
                    return hasAvailability ? (
                        <Badge key={index} variant="secondary" className="text-[10px] py-0 h-5">
                            {day}
                        </Badge>
                    ) : null;
                })}
            </div>
        </div>
    );
}
