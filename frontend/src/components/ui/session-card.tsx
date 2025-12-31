import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar, Clock, User, Video, CheckCircle } from "lucide-react"

interface SessionCardProps {
    date: string
    time: string
    tutorName: string
    tutorImage?: string
    skillName: string
    skillCategory?: string
    duration: number // in minutes
    status?: "upcoming" | "completed" | "cancelled"
    onAction?: () => void
    actionLabel?: string
    compact?: boolean
    className?: string
}

export const SessionCard = React.forwardRef<HTMLDivElement, SessionCardProps>(
    ({
        date,
        time,
        tutorName,
        tutorImage,
        skillName,
        skillCategory,
        duration,
        status = "upcoming",
        onAction,
        actionLabel = "Join Session",
        compact = false,
        className,
    }, ref) => {
        const statusColors = {
            upcoming: {
                bg: "bg-primary/5",
                border: "border-primary/20 hover:border-primary",
                text: "text-primary",
            },
            completed: {
                bg: "bg-success/5",
                border: "border-success/20",
                text: "text-success",
            },
            cancelled: {
                bg: "bg-destructive/5",
                border: "border-destructive/20",
                text: "text-destructive",
            },
        }

        const current = statusColors[status]

        return (
            <div
                ref={ref}
                className={cn(
                    "group relative overflow-hidden rounded-lg border transition-all duration-200",
                    current.border,
                    current.bg,
                    compact ? "p-3" : "p-4",
                    className
                )}
            >
                {/* Header with date & time */}
                <div className={cn(
                    "mb-3 flex items-center gap-2",
                    compact ? "gap-1" : ""
                )}>
                    <Calendar className={cn(
                        "flex-shrink-0 text-muted-foreground",
                        compact ? "h-3.5 w-3.5" : "h-4 w-4"
                    )} />
                    <span className={cn(
                        "font-medium text-foreground",
                        compact ? "text-xs" : "text-sm"
                    )}>
                        {date}
                    </span>
                    <span className={cn(
                        "text-muted-foreground",
                        compact ? "text-xs" : "text-sm"
                    )}>
                        • {time}
                    </span>
                </div>

                {/* Skill & Duration */}
                <div className="mb-3">
                    <h3 className={cn(
                        "font-semibold text-foreground",
                        compact ? "text-sm" : "text-base"
                    )}>
                        {status === "completed" ? "Completed" : skillCategory ? "Learn" : ""} {skillName}
                    </h3>
                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                        <Clock className={cn(
                            "flex-shrink-0",
                            compact ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span className={compact ? "text-xs" : "text-sm"}>
                            {duration} minutes
                        </span>
                    </div>
                </div>

                {/* Tutor Info */}
                <div className="mb-4 flex items-center gap-2">
                    <div className={cn(
                        "flex-shrink-0 rounded-full bg-muted flex items-center justify-center font-semibold",
                        compact ? "h-7 w-7 text-xs" : "h-8 w-8 text-sm"
                    )}>
                        {tutorImage ? (
                            tutorImage
                        ) : (
                            tutorName.charAt(0).toUpperCase()
                        )}
                    </div>
                    <span className={cn(
                        "text-foreground truncate",
                        compact ? "text-xs" : "text-sm"
                    )}>
                        with {tutorName}
                    </span>
                </div>

                {/* Status Indicator */}
                <div className="mb-3 flex items-center gap-2">
                    {status === "completed" && (
                        <>
                            <CheckCircle className={cn(
                                "text-success",
                                compact ? "h-4 w-4" : "h-4 w-4"
                            )} />
                            <span className={cn(
                                "text-success font-medium",
                                compact ? "text-xs" : "text-sm"
                            )}>
                                Completed
                            </span>
                        </>
                    )}
                    {status === "upcoming" && (
                        <span className={cn(
                            "text-primary font-medium",
                            compact ? "text-xs" : "text-sm"
                        )}>
                            Upcoming
                        </span>
                    )}
                    {status === "cancelled" && (
                        <span className={cn(
                            "text-destructive font-medium",
                            compact ? "text-xs" : "text-sm"
                        )}>
                            Cancelled
                        </span>
                    )}
                </div>

                {/* Action Button */}
                {status === "upcoming" && onAction && (
                    <button
                        onClick={onAction}
                        className={cn(
                            "w-full rounded-md bg-primary text-primary-foreground font-medium transition-all duration-200",
                            "hover:bg-secondary hover:shadow-md active:scale-98",
                            "flex items-center justify-center gap-2",
                            compact ? "px-3 py-1.5 text-xs gap-1" : "px-4 py-2 text-sm"
                        )}
                    >
                        <Video className={compact ? "h-3 w-3" : "h-4 w-4"} />
                        {actionLabel}
                    </button>
                )}

                {/* Status indicator line */}
                <div className={cn(
                    "absolute inset-x-0 top-0 h-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                    status === "upcoming" && "bg-gradient-to-r from-primary to-secondary",
                    status === "completed" && "bg-gradient-to-r from-success to-success/50",
                    status === "cancelled" && "bg-gradient-to-r from-destructive to-destructive/50",
                )} />
            </div>
        )
    }
)

SessionCard.displayName = "SessionCard"
