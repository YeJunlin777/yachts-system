"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts"
import type { EChartsOption } from "echarts"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  subtitle?: string
  option: EChartsOption
  height?: number
  className?: string
}

function getChartColors() {
  if (typeof window === "undefined") return ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"]
  const style = getComputedStyle(document.documentElement)
  return [
    `hsl(${style.getPropertyValue("--chart-1").trim()})`,
    `hsl(${style.getPropertyValue("--chart-2").trim()})`,
    `hsl(${style.getPropertyValue("--chart-3").trim()})`,
    `hsl(${style.getPropertyValue("--chart-4").trim()})`,
    `hsl(${style.getPropertyValue("--chart-5").trim()})`
  ]
}

function getTextColor() {
  if (typeof window === "undefined") return "#64748b"
  const style = getComputedStyle(document.documentElement)
  return `hsl(${style.getPropertyValue("--muted-foreground").trim()})`
}

export function ChartCard({ title, subtitle, option, height = 280, className }: ChartCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const chart = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!ref.current) return
    
    chart.current = echarts.init(ref.current)
    
    const textColor = getTextColor()
    const chartColors = getChartColors()
    
    
    const enhancedOption: EChartsOption = {
      ...option,
      backgroundColor: "transparent",
      color: chartColors,
      textStyle: {
        fontFamily: "Inter, system-ui, sans-serif"
      },
      
      tooltip: {
        ...option.tooltip as object,
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        textStyle: {
          color: "#fff",
          fontSize: 12
        },
        extraCssText: "backdrop-filter: blur(8px); border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);"
      },
      
      legend: option.legend ? {
        ...option.legend as object,
        textStyle: {
          color: textColor,
          fontSize: 11
        }
      } : undefined,
      
      xAxis: option.xAxis ? {
        ...option.xAxis as object,
        axisLine: {
          lineStyle: { color: "rgba(148, 163, 184, 0.2)" }
        },
        axisLabel: {
          ...(option.xAxis as { axisLabel?: object })?.axisLabel,
          color: textColor
        },
        splitLine: {
          lineStyle: { color: "rgba(148, 163, 184, 0.1)" }
        }
      } : undefined,
      yAxis: option.yAxis ? {
        ...option.yAxis as object,
        axisLine: {
          lineStyle: { color: "rgba(148, 163, 184, 0.2)" }
        },
        axisLabel: {
          ...(option.yAxis as { axisLabel?: object })?.axisLabel,
          color: textColor
        },
        splitLine: {
          lineStyle: { color: "rgba(148, 163, 184, 0.08)" }
        }
      } : undefined
    }
    
    chart.current.setOption(enhancedOption)
    
    const resize = () => chart.current?.resize()
    window.addEventListener("resize", resize)
    
    
    const observer = new MutationObserver(() => {
      if (chart.current) {
        chart.current.setOption({
          color: getChartColors(),
          textStyle: { color: getTextColor() }
        })
      }
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => {
      window.removeEventListener("resize", resize)
      observer.disconnect()
      chart.current?.dispose()
    }
  }, [option])

  return (
    <div className={cn("luxury-card group overflow-hidden", className)}>
      
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-breathe" />
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--yacht-gold))] animate-breathe" style={{ animationDelay: "0.5s" }} />
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--yacht-ocean))] animate-breathe" style={{ animationDelay: "1s" }} />
          </div>
        </div>
      </div>
      
      
      <div className="divider-gradient mx-5" />
      
      
      <div className="px-3 pb-4 pt-2">
        <div ref={ref} style={{ height }} />
      </div>
      
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}
