import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Star, Clock, Calendar } from "lucide-react"

interface SkillCardProps {
    tutorName: string
    tutorImage?: string
    skillName: string
    category: string
    description: string
    rating: number
    reviewCount: number
    duration: number // in minutes
    availableDays: string[]
    onViewDetails?: () => void
    className?: string
    compact?: boolean
}

export const SkillCard = React.forwardRef<HTMLDivElement, SkillCardProps>(
    ({
        tutorName,
        tutorImage,
        skillName,
        category,
        description,
        rating,
        reviewCount,
        duration,
        availableDays,
        onViewDetails,
        className,
        compact = false,
    }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200",
                    "hover:border-primary hover:shadow-md",
                    compact ? "p-3" : "p-4",
                    className
                )}
            >
                {/* Tutor Info Header */}
                <div className="mb-3 flex items-center gap-3">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
                        {tutorImage ? (
                            <Image
                                src={tutorImage}
                                alt={tutorName}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/20 text-xs font-semibold text-primary">
                                {tutorName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-medium text-muted-foreground">
                            {tutorName}
                        </p>
                    </div>
                </div>

                {/* Skill Name & Category */}
                <div className="mb-2">
                    <h3 className={cn(
                        "font-semibold text-primary line-clamp-2 transition-colors group-hover:text-secondary",
                        compact ? "text-sm" : "text-base"
                    )}>
                        {skillName}
                    </h3>
                    <div className="mt-1">
                        <span className={cn(
                            "inline-block rounded-full bg-primary/10 text-primary font-medium",
                            compact ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
                        )}>
                            {category}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className={cn(
                    "mb-3 line-clamp-2 text-muted-foreground",
                    compact ? "text-xs leading-4" : "text-xs leading-5"
                )}>
                    {description}
                </p>

                {/* Rating & Review Count */}
                <div className="mb-3 flex items-center gap-1">
                    <div className="flex items-center gap-0.5">
                        <Star className="h-3.5 w-3.5 fill-secondary text-secondary" />
                        <span className="text-xs font-semibold text-foreground">
                            {rating.toFixed(1)}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
                    </span>
                </div>

                {/* Duration & Availability */}
                <div className="mb-4 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span>{duration} mins per session</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Calendar className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="line-clamp-1">{availableDays.join(', ')}</span>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onViewDetails}
                    className={cn(
                        "w-full rounded-md bg-primary text-primary-foreground font-medium transition-all duration-200",
                        "hover:bg-secondary hover:shadow-md active:scale-98",
                        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"
                    )}
                >
                    View Details
                </button>

                {/* Hover Accent Line */}
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            </div>
        )
    }
)

SkillCard.displayName = "SkillCard"
