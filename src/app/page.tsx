"use client"

import { appConfig } from "@/config/app.config"
import { moduleConfigs } from "@/config/modules"
import Link from "next/link"
import { ArrowRight, TrendingUp, Users, Ship, Globe, Anchor, Waves, Sparkles } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { cn } from "@/lib/utils"

const stats = [
  { title: "本月客户", value: "646", icon: Users, trend: { value: 12.5, label: "较上月" }, variant: "default" as const },
  { title: "活跃订单", value: "586", icon: Ship, trend: { value: 8.2, label: "较上月" }, variant: "highlight" as const },
  { title: "境外占比", value: "46%", icon: Globe, trend: { value: 3.1, label: "较上月" }, variant: "default" as const },
  { title: "预测准确率", value: "94.6%", icon: TrendingUp, trend: { value: 1.2, label: "较上季" }, variant: "gold" as const },
]

export default function HomePage() {
  const enabledModules = moduleConfigs.filter((module) =>
    appConfig.enabledSubsystems.includes(module.key)
  )

  return (
    <div className="space-y-8">
      
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-[hsl(var(--yacht-gold))]/5 border border-border/50 p-8 lg:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[hsl(var(--yacht-gold))]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-6 right-6 opacity-10">
          <Anchor className="h-32 w-32 text-primary" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-[hsl(var(--yacht-ocean))] flex items-center justify-center text-white shadow-lg">
              <Waves className="h-5 w-5" />
            </div>
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">
            {appConfig.texts.heroTitle}
          </h1>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {appConfig.texts.heroSubtitle}
          </p>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <Link 
              href="/analytics"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:shadow-xl transition-all btn-premium"
            >
              <Sparkles className="h-4 w-4" />
              查看数据分析
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link 
              href="/customers/domestic"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium hover:bg-muted/50 transition-all"
            >
              <Users className="h-4 w-4" />
              客户管理
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={stat.title} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 rounded-lg bg-[hsl(var(--yacht-gold))]/10 flex items-center justify-center">
            <Ship className="h-4 w-4 text-[hsl(var(--yacht-gold))]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">功能模块</h2>
            <p className="text-xs text-muted-foreground">快速访问系统各项功能</p>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {enabledModules.map((module, index) => (
            <Link
              key={module.key}
              href={module.route}
              className={cn("group luxury-card gold-glow p-5 animate-fade-up")}
              style={{ animationDelay: `${(index + 4) * 80}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-semibold group-hover:text-primary transition-colors">{module.menuLabel}</span>
                  <p className="text-sm text-muted-foreground line-clamp-2">{module.description}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center shrink-0 group-hover:from-primary/10 group-hover:to-[hsl(var(--yacht-gold))]/10 transition-all duration-300 border border-border/50">
                  <module.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                <span>点击进入</span>
                <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
