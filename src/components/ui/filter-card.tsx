import { ReactNode } from "react"
import { Button } from "./button"
import { RotateCcw, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterCardProps {
  children: ReactNode
  onReset?: () => void
  className?: string
}

export function FilterCard({ children, onReset, className }: FilterCardProps) {
  return (
    <div className={cn("luxury-card p-5", className)}>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium">筛选条件</span>
        </div>
        {onReset && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="text-muted-foreground hover:text-foreground gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            重置
          </Button>
        )}
      </div>
      
      
      <div className="divider-gradient mb-4" />
      
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </div>
  )
}
