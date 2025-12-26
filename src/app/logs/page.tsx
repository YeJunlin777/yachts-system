"use client"

import rawData from "@/data/system/logs.json" assert { type: "json" }
import { useMemo, useState } from "react"

import { CustomerTable, type ColumnDef } from "@/components/customers/customer-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { FilterCard } from "@/components/ui/filter-card"
import { useToast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/data-utils"
import type { LogRecord, LogResult } from "@/types/logs"
import { Download, Copy, FileText, AlertTriangle, Layers, CheckCircle, AlertCircle, XCircle, Clock, User, Globe, Terminal } from "lucide-react"

const dataset = rawData as LogRecord[]
const modules = Array.from(new Set(dataset.map((d) => d.module)))

const resultConfig: Record<LogResult, { 
  dot: string
  bg: string
  text: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = {
  success: {
    dot: "bg-emerald-500",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "成功",
    icon: CheckCircle
  },
  warning: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    label: "预警",
    icon: AlertCircle
  },
  error: {
    dot: "bg-red-500",
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    label: "失败",
    icon: XCircle
  }
}

export default function Page() {
  const [keyword, setKeyword] = useState("")
  const [module, setModule] = useState<string>()
  const [result, setResult] = useState<LogResult>()
  const [selected, setSelected] = useState<LogRecord | null>(null)
  const { toast } = useToast()

  const filtered = useMemo(() => dataset.filter((d) => {
    if (keyword && !d.operator.includes(keyword) && !d.action.includes(keyword) && !d.id.includes(keyword)) return false
    if (module && d.module !== module) return false
    if (result && d.result !== result) return false
    return true
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [keyword, module, result])

  const columns: ColumnDef<LogRecord>[] = [
    { 
      key: "id", 
      label: "日志ID", 
      width: "130px", 
      render: (r) => (
        <code className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded font-mono">
          {r.id}
        </code>
      )
    },
    { 
      key: "action", 
      label: "操作",
      render: (r) => <span className="font-medium">{r.action}</span>
    },
    { 
      key: "module", 
      label: "模块", 
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3.5 w-3.5" />
          {r.module}
        </span>
      )
    },
    { 
      key: "operator", 
      label: "操作人",
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
            {r.operator[0]}
          </div>
          <span>{r.operator}</span>
        </div>
      )
    },
    { 
      key: "ip", 
      label: "IP", 
      render: (r) => (
        <span className="text-muted-foreground text-xs font-mono">{r.ip}</span>
      )
    },
    { 
      id: "result", 
      label: "结果", 
      render: (r) => {
        const config = resultConfig[r.result]
        const Icon = config.icon
        return (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </span>
        )
      }
    },
    { 
      id: "time", 
      label: "时间", 
      render: (r) => (
        <span className="text-muted-foreground text-xs">
          {formatDate(r.timestamp, { dateStyle: "short", timeStyle: "medium" })}
        </span>
      )
    },
    { 
      id: "action_btn", 
      label: "", 
      width: "80px", 
      render: (r) => (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); setSelected(r) }}
          className="text-primary hover:text-primary hover:bg-primary/10"
        >
          详情
        </Button>
      )
    }
  ]

  const abnormal = dataset.filter((d) => d.result !== "success").length

  const copyPayload = () => {
    if (!selected?.payload) return
    navigator.clipboard.writeText(JSON.stringify(selected.payload, null, 2))
    toast({ title: "已复制到剪贴板" })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={FileText}
        title="日志管理"
        description="系统操作日志与安全审计"
        actions={
          <Button size="sm" className="btn-premium bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-1.5" />
            导出日志
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="日志总数" value={dataset.length} icon={FileText} />
        <StatCard title="异常事件" value={abnormal} icon={AlertTriangle} variant="highlight" />
        <StatCard title="涉及模块" value={modules.length} icon={Layers} variant="gold" />
      </div>

      <FilterCard onReset={() => { setKeyword(""); setModule(undefined); setResult(undefined) }}>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">关键词搜索</Label>
          <Input 
            placeholder="操作人/操作/ID" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">模块筛选</Label>
          <Select value={module} onValueChange={(v) => setModule(v === "all" ? undefined : v)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部模块" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部模块</SelectItem>
              {modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">执行结果</Label>
          <Select value={result} onValueChange={(v) => setResult(v === "all" ? undefined : v as LogResult)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部结果" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部结果</SelectItem>
              <SelectItem value="success">成功</SelectItem>
              <SelectItem value="warning">预警</SelectItem>
              <SelectItem value="error">失败</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterCard>

      <CustomerTable data={filtered} columns={columns} onRowClick={setSelected} />

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md glass-strong border-l border-border/50">
          <SheetHeader>
            <SheetTitle className="text-lg">日志详情</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-6">
              
              <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <code className="text-xs bg-background/50 text-muted-foreground px-2 py-1 rounded font-mono">
                    {selected.id}
                  </code>
                  {(() => {
                    const config = resultConfig[selected.result]
                    const Icon = config.icon
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </span>
                    )
                  })()}
                </div>
                <p className="font-semibold text-lg">{selected.action}</p>
                <p className="text-sm text-muted-foreground mt-1">{selected.module}</p>
              </div>

              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  操作信息
                </div>
                <div className="space-y-3">
                  <DetailRow icon={User} label="操作人" value={`${selected.operator}（${selected.role}）`} />
                  <DetailRow icon={Globe} label="IP地址" value={selected.ip} mono />
                  <DetailRow icon={Clock} label="操作时间" value={formatDate(selected.timestamp, { dateStyle: "full", timeStyle: "long" })} />
                </div>
              </div>
              
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Terminal className="h-4 w-4" />
                    Payload 数据
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={copyPayload} 
                    disabled={!selected.payload}
                    className="h-7 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    复制
                  </Button>
                </div>
                <pre className="p-4 rounded-xl bg-[hsl(var(--yacht-navy))] text-[hsl(var(--yacht-foam))] text-xs overflow-auto max-h-48 font-mono border border-border/50">
                  {selected.payload ? JSON.stringify(selected.payload, null, 2) : "无数据"}
                </pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function DetailRow({ 
  icon: Icon, 
  label, 
  value, 
  mono
}: { 
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <dt className="text-sm text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className={`text-sm text-right max-w-[60%] font-medium ${mono ? "font-mono text-xs bg-muted/50 px-2 py-0.5 rounded" : ""}`}>
        {value}
      </dd>
    </div>
  )
}
