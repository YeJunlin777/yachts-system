import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  trend?: { value: number; label?: string }
  className?: string
  variant?: "default" | "highlight" | "gold"
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  className,
  variant = "default"
}: StatCardProps) {
  return (
    <div className={cn(
      "luxury-card stat-card-premium p-5 group",
      variant === "highlight" && "border-primary/30",
      variant === "gold" && "border-[hsl(var(--yacht-gold))]/30",
      className
    )}>
      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className={cn(
            "text-2xl font-bold tracking-tight",
            variant === "gold" && "text-[hsl(var(--yacht-gold))]"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1.5 pt-1">
              <span className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded",
                trend.value >= 0 
                  ? "text-green-600 dark:text-green-400 bg-green-500/10" 
                  : "text-red-600 dark:text-red-400 bg-red-500/10"
              )}>
                {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              {trend.label && (
                <span className="text-xs text-muted-foreground">{trend.label}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-300 icon-glow",
            variant === "default" && "bg-primary/10 group-hover:bg-primary/15",
            variant === "highlight" && "bg-primary/15 group-hover:bg-primary/20",
            variant === "gold" && "bg-[hsl(var(--yacht-gold))]/10 group-hover:bg-[hsl(var(--yacht-gold))]/15"
          )}>
            <Icon className={cn(
              "h-6 w-6 transition-transform duration-300 group-hover:scale-110",
              variant === "default" && "text-primary",
              variant === "highlight" && "text-primary",
              variant === "gold" && "text-[hsl(var(--yacht-gold))]"
            )} />
          </div>
        )}
      </div>
      
      
      <div className={cn(
        "absolute bottom-0 left-4 right-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        variant === "default" && "bg-gradient-to-r from-transparent via-primary/30 to-transparent",
        variant === "highlight" && "bg-gradient-to-r from-transparent via-primary/50 to-transparent",
        variant === "gold" && "bg-gradient-to-r from-transparent via-[hsl(var(--yacht-gold))]/50 to-transparent"
      )} />
    </div>
  )
}
