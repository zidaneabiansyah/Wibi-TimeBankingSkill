import * as React from "react"
import { cn } from "@/lib/utils"

interface AchievementBadgeProps {
    icon: React.ReactNode
    title: string
    description?: string
    unlocked?: boolean
    onClick?: () => void
    className?: string
    size?: "sm" | "md" | "lg"
}

export const AchievementBadge = React.forwardRef<
    HTMLDivElement,
    AchievementBadgeProps
>(({
    icon,
    title,
    description,
    unlocked = true,
    onClick,
    className,
    size = "md",
}, ref) => {
    const sizeClasses = {
        sm: {
            container: "p-2 gap-1",
            icon: "h-6 w-6",
            title: "text-xs",
            description: "text-xs",
        },
        md: {
            container: "p-3 gap-2",
            icon: "h-8 w-8",
            title: "text-sm",
            description: "text-xs",
        },
        lg: {
            container: "p-4 gap-3",
            icon: "h-12 w-12",
            title: "text-base",
            description: "text-sm",
        },
    }

    const current = sizeClasses[size]

    return (
        <div
            ref={ref}
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-200",
                unlocked
                    ? "border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 hover:shadow-md cursor-pointer"
                    : "border-border bg-muted/30 opacity-50 cursor-not-allowed",
                onClick && "hover:scale-105",
                current.container,
                className
            )}
        >
            <div className={cn(
                current.icon,
                "flex items-center justify-center text-lg",
                unlocked && "animate-pulse-slow"
            )}>
                {icon}
            </div>
            <div className="text-center">
                <p className={cn(
                    "font-semibold text-foreground",
                    current.title
                )}>
                    {title}
                </p>
                {description && (
                    <p className={cn(
                        "text-muted-foreground text-center",
                        current.description
                    )}>
                        {description}
                    </p>
                )}
            </div>

            {/* Glow effect when unlocked */}
            {unlocked && (
                <div className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-200"
                    style={{
                        boxShadow: '0 0 20px rgba(255, 140, 66, 0.2)',
                    }}
                />
            )}
        </div>
    )
})

AchievementBadge.displayName = "AchievementBadge"
