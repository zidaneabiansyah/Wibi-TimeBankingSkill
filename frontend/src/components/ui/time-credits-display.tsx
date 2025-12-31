import * as React from "react"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

interface TimeCreditsDisplayProps {
    balance: number
    label?: string
    size?: "sm" | "md" | "lg"
    variant?: "default" | "accent" | "success"
    showIcon?: boolean
    animated?: boolean
    className?: string
}

export const TimeCreditsDisplay = React.forwardRef<
    HTMLDivElement,
    TimeCreditsDisplayProps
>(({
    balance,
    label = "Time Balance",
    size = "md",
    variant = "default",
    showIcon = true,
    animated = false,
    className,
}, ref) => {
    const sizeClasses = {
        sm: {
            container: "px-3 py-2 rounded-md",
            number: "text-xl",
            label: "text-xs",
            icon: "h-4 w-4",
        },
        md: {
            container: "px-4 py-3 rounded-lg",
            number: "text-2xl",
            label: "text-sm",
            icon: "h-5 w-5",
        },
        lg: {
            container: "px-6 py-4 rounded-lg",
            number: "text-4xl",
            label: "text-base",
            icon: "h-6 w-6",
        },
    }

    const variantClasses = {
        default: "bg-card border border-border hover:border-primary",
        accent: "bg-primary/10 border border-primary/20 hover:border-primary",
        success: "bg-success/10 border border-success/20 hover:border-success",
    }

    const textClasses = {
        default: "text-foreground",
        accent: "text-primary",
        success: "text-success",
    }

    const current = sizeClasses[size]

    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-col items-center justify-center transition-all duration-200",
                current.container,
                variantClasses[variant],
                "gap-1",
                className
            )}
        >
            <div className="flex items-center gap-2">
                {showIcon && (
                    <Zap className={cn(
                        current.icon,
                        textClasses[variant],
                        animated && "animate-pulse"
                    )} />
                )}
                <div className={cn(
                    "font-bold",
                    current.number,
                    textClasses[variant],
                    animated && "animate-pulse-slow"
                )}>
                    {balance.toFixed(1)}
                </div>
            </div>
            <p className={cn(
                "text-muted-foreground text-center",
                current.label
            )}>
                {label}
            </p>
        </div>
    )
})

TimeCreditsDisplay.displayName = "TimeCreditsDisplay"
