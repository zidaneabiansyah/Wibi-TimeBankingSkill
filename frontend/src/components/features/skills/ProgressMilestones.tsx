'use client';

import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Milestone } from '@/types';

interface ProgressMilestonesProps {
    milestones: Milestone[];
    currentProgress: number;
}

export function ProgressMilestones({ milestones, currentProgress }: ProgressMilestonesProps) {
    if (!milestones || milestones.length === 0) return null;

    // Sort milestones by threshold
    const sortedMilestones = [...milestones].sort((a, b) => a.progress_threshold - b.progress_threshold);

    return (
        <div className="relative py-8 px-2">
            {/* Progress Line Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 rounded-full" />

            {/* Active Progress Line */}
            <div 
                className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000"
                style={{ width: `${currentProgress}%` }}
            />

            {/* Milestones */}
            <div className="relative flex justify-between w-full">
                {sortedMilestones.map((milestone) => {
                    const isAchieved = milestone.is_achieved || currentProgress >= milestone.progress_threshold;
                    const isNext = !isAchieved && currentProgress < milestone.progress_threshold && 
                        sortedMilestones.find(m => m.progress_threshold > currentProgress)?.id === milestone.id;

                    return (
                        <div 
                            key={milestone.id}
                            className="flex flex-col items-center absolute -translate-x-1/2"
                            style={{ left: `${milestone.progress_threshold}%` }}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div 
                                            className={`
                                                w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 cursor-pointer
                                                ${isAchieved 
                                                    ? 'bg-primary border-primary scale-125' 
                                                    : isNext 
                                                        ? 'bg-background border-primary border-dashed animate-pulse' 
                                                        : 'bg-background border-slate-300 dark:border-slate-600'
                                                }
                                            `}
                                        >
                                            {isAchieved && <CheckCircle2 className="w-full h-full text-white p-0.5" />}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-center">
                                            <p className="font-semibold text-xs">{milestone.title}</p>
                                            <p className="text-[10px] text-muted-foreground">{milestone.description}</p>
                                            <p className="text-[10px] font-mono mt-1">{milestone.progress_threshold}% Requirement</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            {/* Mobile Label (optional, might be too crowded) */}
                            {/* <span className="text-[10px] mt-2 hidden sm:block max-w-[60px] text-center truncate">
                                {milestone.title}
                            </span> */}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
