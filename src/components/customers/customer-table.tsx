"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ColumnDef<T> {
  key?: keyof T
  id?: string
  label: string
  width?: string
  align?: "left" | "center" | "right"
  render?: (row: T) => ReactNode
}

interface CustomerTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
  pageSize?: number
}

export function CustomerTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
  pageSize = 10
}: CustomerTableProps<T>) {
  const [page, setPage] = useState(1)
  
  const totalPages = Math.ceil(data.length / pageSize)
  const start = (page - 1) * pageSize
  const currentData = data.slice(start, start + pageSize)

  if (data.length === 0) {
    return (
      <div className="luxury-card">
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Database className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-medium">暂无数据</p>
          <p className="text-xs text-muted-foreground mt-1">请调整筛选条件后重试</p>
        </div>
      </div>
    )
  }

  return (
    <div className="luxury-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30">
              {columns.map((col, i) => (
                <th
                  key={col.id ?? String(col.key) ?? i}
                  className={cn(
                    "px-4 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "table-row-luxury border-b border-border/30 last:border-0 transition-all duration-200",
                  onRowClick && "cursor-pointer",
                  rowIndex % 2 === 1 && "bg-muted/10"
                )}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.id ?? String(col.key) ?? i}
                    className={cn(
                      "px-4 py-4",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right"
                    )}
                  >
                    {col.render ? col.render(row) : col.key ? String(row[col.key] ?? "-") : "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-border/50 bg-gradient-to-r from-muted/20 via-transparent to-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              共 <span className="font-semibold text-foreground">{data.length}</span> 条记录
            </span>
            <span className="text-muted-foreground/50">|</span>
            <span className="text-sm text-muted-foreground">
              第 <span className="font-medium text-primary">{page}</span> / {totalPages} 页
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (page <= 3) {
                  pageNum = i + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "h-8 w-8 rounded-lg text-xs font-medium transition-all",
                      page === pageNum 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-border/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
