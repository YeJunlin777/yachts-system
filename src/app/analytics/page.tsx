"use client"

import { useMemo, useState } from "react"
import analyticsSeries from "@/data/analytics/series.json" assert { type: "json" }

import { ChartCard } from "@/components/analytics/chart-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import type { EChartsOption } from "echarts"
import { BarChart3, Users, ShoppingCart, TrendingUp, PieChart, LineChart, Activity } from "lucide-react"

const years = ["2024", "2025"]
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

export default function Page() {
  const [year, setYear] = useState("2025")

  const totalCustomers = analyticsSeries.customerMonthly.domestic.slice(-12).reduce((a, b) => a + b, 0)
    + analyticsSeries.customerMonthly.international.slice(-12).reduce((a, b) => a + b, 0)
  
  const totalOrders = analyticsSeries.orderMonthly.domestic.slice(-12).reduce((a, b) => a + b, 0)
    + analyticsSeries.orderMonthly.international.slice(-12).reduce((a, b) => a + b, 0)
  
  const intlRatio = Math.round(analyticsSeries.customerMonthly.international.reduce((a, b) => a + b, 0) / 
    (analyticsSeries.customerMonthly.domestic.reduce((a, b) => a + b, 0) + analyticsSeries.customerMonthly.international.reduce((a, b) => a + b, 0)) * 100)

  const customerMonthly = useMemo<EChartsOption>(() => {
    const labels = analyticsSeries.customerMonthly.labels.filter((l) => l.startsWith(year))
    const start = analyticsSeries.customerMonthly.labels.length - labels.length
    return {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: 50, right: 20, top: 20, bottom: 50 },
      xAxis: { type: "category", data: labels, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [
        { 
          name: "境内", 
          type: "line", 
          smooth: true, 
          data: analyticsSeries.customerMonthly.domestic.slice(start),
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.1 }
        },
        { 
          name: "境外", 
          type: "line", 
          smooth: true, 
          data: analyticsSeries.customerMonthly.international.slice(start),
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.1 }
        }
      ]
    }
  }, [year])

  const customerRatio = useMemo<EChartsOption>(() => {
    const d = analyticsSeries.customerMonthly.domestic.reduce((a, b) => a + b, 0)
    const i = analyticsSeries.customerMonthly.international.reduce((a, b) => a + b, 0)
    return {
      tooltip: { trigger: "item" },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      series: [{
        type: "pie",
        radius: ["45%", "70%"],
        center: ["50%", "45%"],
        label: { 
          show: true, 
          formatter: "{b}\n{d}%", 
          fontSize: 11,
          lineHeight: 16
        },
        labelLine: { length: 15, length2: 10 },
        itemStyle: {
          borderRadius: 6,
          borderColor: "transparent",
          borderWidth: 2
        },
        data: [
          { value: d, name: "境内客户" },
          { value: i, name: "境外客户" }
        ]
      }]
    }
  }, [])

  const orderMonthly = useMemo<EChartsOption>(() => {
    const labels = analyticsSeries.orderMonthly.labels.filter((l) => l.startsWith(year))
    const start = analyticsSeries.orderMonthly.labels.length - labels.length
    return {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: 50, right: 20, top: 20, bottom: 50 },
      xAxis: { type: "category", data: labels, axisLabel: { fontSize: 10 } },
      yAxis: { type: "value", axisLabel: { fontSize: 10 } },
      series: [
        { 
          name: "境内", 
          type: "bar", 
          data: analyticsSeries.orderMonthly.domestic.slice(start),
          itemStyle: { borderRadius: [4, 4, 0, 0] },
          barWidth: "35%"
        },
        { 
          name: "境外", 
          type: "bar", 
          data: analyticsSeries.orderMonthly.international.slice(start),
          itemStyle: { borderRadius: [4, 4, 0, 0] },
          barWidth: "35%"
        }
      ]
    }
  }, [year])

  const orderRatio = useMemo<EChartsOption>(() => {
    const data = months.map((m, i) => ({
      name: `${year}-${m}`,
      d: analyticsSeries.orderMonthly.domestic[i],
      i: analyticsSeries.orderMonthly.international[i]
    }))
    return {
      tooltip: { trigger: "axis" },
      legend: { bottom: 0, textStyle: { fontSize: 11 } },
      grid: { left: 60, right: 20, top: 20, bottom: 50 },
      xAxis: { type: "value", axisLabel: { fontSize: 10 } },
      yAxis: { type: "category", data: data.map((d) => d.name), axisLabel: { fontSize: 10 } },
      series: [
        { 
          name: "境内", 
          type: "bar", 
          stack: "t", 
          data: data.map((d) => d.d),
          itemStyle: { borderRadius: [0, 0, 0, 0] }
        },
        { 
          name: "境外", 
          type: "bar", 
          stack: "t", 
          data: data.map((d) => d.i),
          itemStyle: { borderRadius: [0, 4, 4, 0] }
        }
      ]
    }
  }, [year])

  const customerForecast: EChartsOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "category", data: months.map((m) => `${year}-${m}`), axisLabel: { fontSize: 10 } },
    yAxis: { type: "value", axisLabel: { fontSize: 10 } },
    series: [{ 
      type: "line", 
      smooth: true, 
      areaStyle: { opacity: 0.2 },
      lineStyle: { width: 3 },
      data: analyticsSeries.forecast.customer,
      markLine: {
        silent: true,
        lineStyle: { type: "dashed", opacity: 0.5 },
        data: [{ type: "average", name: "平均值" }]
      }
    }]
  }

  const orderForecast: EChartsOption = {
    tooltip: { trigger: "axis" },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: { type: "category", data: months.map((m) => `${year}-${m}`), axisLabel: { fontSize: 10 } },
    yAxis: { type: "value", axisLabel: { fontSize: 10 } },
    series: [{ 
      type: "line", 
      smooth: true, 
      areaStyle: { opacity: 0.2 },
      lineStyle: { width: 3 },
      data: analyticsSeries.forecast.order,
      markLine: {
        silent: true,
        lineStyle: { type: "dashed", opacity: 0.5 },
        data: [{ type: "average", name: "平均值" }]
      }
    }]
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={BarChart3}
        title="数据预测分析"
        description="客户与订单占比及年度趋势预测，助力精准决策"
        actions={
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-28 bg-card border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => <SelectItem key={y} value={y}>{y}年</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard 
          title="近一年客户量" 
          value={totalCustomers.toLocaleString()} 
          icon={Users}
          trend={{ value: 15.2, label: "同比增长" }}
        />
        <StatCard 
          title="近一年订单量" 
          value={totalOrders.toLocaleString()} 
          icon={ShoppingCart}
          variant="highlight"
          trend={{ value: 12.8, label: "同比增长" }}
        />
        <StatCard 
          title="境外客户占比" 
          value={`${intlRatio}%`} 
          icon={TrendingUp}
          variant="gold"
          trend={{ value: 3.5, label: "较去年" }}
        />
      </div>

      
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">客户占比分析</h2>
            <p className="text-xs text-muted-foreground">近两年客户数据统计与分布</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <ChartCard 
            title="每月客户人数趋势" 
            subtitle="境内与境外客户对比"
            option={customerMonthly} 
          />
          <ChartCard 
            title="客户来源占比" 
            subtitle="境内/境外客户分布"
            option={customerRatio} 
          />
        </div>
      </div>

      
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[hsl(var(--yacht-gold))]/10 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-[hsl(var(--yacht-gold))]" />
          </div>
          <div>
            <h2 className="text-base font-semibold">订单占比分析</h2>
            <p className="text-xs text-muted-foreground">近两年订单数据统计与分布</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <ChartCard 
            title="每月订单数量" 
            subtitle="境内与境外订单对比"
            option={orderMonthly} 
          />
          <ChartCard 
            title="订单份额分布" 
            subtitle="按月份统计订单占比"
            option={orderRatio} 
          />
        </div>
      </div>

      
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-[hsl(var(--yacht-ocean))]/10 flex items-center justify-center">
            <Activity className="h-5 w-5 text-[hsl(var(--yacht-ocean))]" />
          </div>
          <div>
            <h2 className="text-base font-semibold">趋势预测</h2>
            <p className="text-xs text-muted-foreground">{year}年度客户与订单趋势预测</p>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <ChartCard 
            title={`${year}年客户趋势预测`}
            subtitle="基于历史数据的智能预测"
            option={customerForecast} 
          />
          <ChartCard 
            title={`${year}年订单趋势预测`}
            subtitle="基于历史数据的智能预测"
            option={orderForecast} 
          />
        </div>
      </div>
    </div>
  )
}
