import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8", className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="relative">
            
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-[hsl(var(--yacht-gold))]/10 flex items-center justify-center border border-primary/20 icon-glow">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            
            <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[hsl(var(--yacht-gold))] shadow-lg animate-breathe" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight title-decoration">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-3 mt-4 sm:mt-0">{actions}</div>
      )}
    </div>
  )
}
