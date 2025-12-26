import { cn } from "@/lib/utils"
import type { OrderStatus } from "@/types/orders"
import { Clock, CheckCircle, RefreshCw } from "lucide-react"

const config: Record<OrderStatus, { 
  bg: string
  text: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  "待审核": {
    bg: "bg-amber-500/10 border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    icon: Clock
  },
  "已审核": {
    bg: "bg-green-500/10 border-green-500/20",
    text: "text-green-600 dark:text-green-400",
    icon: CheckCircle
  },
  "退款中": {
    bg: "bg-red-500/10 border-red-500/20",
    text: "text-red-600 dark:text-red-400",
    icon: RefreshCw
  }
}

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  const { bg, text, icon: Icon } = config[status]
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      bg,
      text
    )}>
      <Icon className="h-3 w-3" />
      {status}
    </span>
  )
}
