import * as React from "react"
import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export const CategoryBadge = React.forwardRef<HTMLDivElement, CategoryBadgeProps>(
  ({ category, className, size = "md" }, ref) => {
    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs",
      md: "px-2.5 py-1 text-sm",
      lg: "px-3 py-1.5 text-base",
    }

    const categoryColors: Record<string, { bg: string; text: string }> = {
      academic: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
      },
      technical: {
        bg: "bg-primary/10",
        text: "text-primary",
      },
      creative: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
      },
      language: {
        bg: "bg-green-500/10",
        text: "text-green-400",
      },
      sports: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
      },
      business: {
        bg: "bg-secondary/10",
        text: "text-secondary",
      },
      default: {
        bg: "bg-muted",
        text: "text-muted-foreground",
      },
    }

    const colors = categoryColors[category.toLowerCase()] || categoryColors.default

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-colors",
          colors.bg,
          colors.text,
          sizeClasses[size],
          className
        )}
      >
        {category}
      </div>
    )
  }
)

CategoryBadge.displayName = "CategoryBadge"
