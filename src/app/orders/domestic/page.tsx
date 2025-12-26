"use client"

import rawData from "@/data/orders/domestic.json" assert { type: "json" }
import { useMemo, useState } from "react"

import { CustomerTable, type ColumnDef } from "@/components/customers/customer-table"
import { OrderStatusPill } from "@/components/orders/order-status-pill"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { FilterCard } from "@/components/ui/filter-card"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/data-utils"
import type { DomesticOrderRecord, OrderStatus } from "@/types/orders"
import { Download, ClipboardList, Wallet, Clock, FileText, User, Calendar, CreditCard, Users, CheckCircle, XCircle, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react"

const dataset = rawData as DomesticOrderRecord[]
const statuses: OrderStatus[] = ["待审核", "已审核", "退款中"]

const defaultFormData = {
  customerName: "",
  gender: "男",
  country: "中国",
  serviceName: "",
  amount: "",
  touristCount: "",
  touristNames: ""
}

export default function DomesticOrdersPage() {
  const [records, setRecords] = useState(() => dataset.map((d) => ({ ...d })))
  const [keyword, setKeyword] = useState("")
  const [status, setStatus] = useState<OrderStatus>()
  const [selected, setSelected] = useState<DomesticOrderRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(defaultFormData)
  const { toast } = useToast()

  const filtered = useMemo(() => {
    return records.filter((d) => {
      if (keyword && !d.customerName.includes(keyword) && !d.orderNo.includes(keyword)) return false
      if (status && d.status !== status) return false
      return true
    }).sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())
  }, [records, keyword, status])

  const columns: ColumnDef<DomesticOrderRecord>[] = [
    { 
      key: "id", 
      label: "ID", 
      width: "80px",
      render: (r) => (
        <span className="text-xs text-muted-foreground">{r.id}</span>
      )
    },
    { 
      key: "orderNo", 
      label: "订单编号", 
      render: (r) => (
        <code className="text-xs bg-primary/5 text-primary px-2 py-1 rounded-md font-mono">
          {r.orderNo}
        </code>
      )
    },
    { 
      key: "customerName", 
      label: "客户姓名", 
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-[hsl(var(--yacht-gold))]/20 flex items-center justify-center text-xs font-semibold text-primary">
            {r.customerName[0]}
          </div>
          <span className="font-medium">{r.customerName}</span>
        </div>
      )
    },
    { 
      key: "country", 
      label: "国别", 
      render: (r) => (
        <Badge variant="secondary" className="badge-premium">
          {r.country}
        </Badge>
      )
    },
    { key: "gender", label: "性别", width: "80px", align: "center" },
    { key: "serviceName", label: "服务名称" },
    { 
      key: "amount", 
      label: "金额", 
      align: "right", 
      render: (r) => (
        <span className="font-semibold text-[hsl(var(--yacht-gold))]">
          {formatCurrency(r.amount)}
        </span>
      )
    },
    { 
      key: "orderTime", 
      label: "下单时间", 
      render: (r) => (
        <span className="text-muted-foreground text-xs">
          {new Date(r.orderTime).toLocaleString("zh-CN", { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false 
          })}
        </span>
      )
    },
    { id: "status", label: "状态", align: "center", render: (r) => <OrderStatusPill status={r.status} /> },
    { id: "action", label: "", width: "80px", render: (r) => (
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={(e) => { e.stopPropagation(); setSelected(r) }}
        className="text-primary hover:text-primary hover:bg-primary/10"
      >
        详情
      </Button>
    )}
  ]

  const total = filtered.reduce((s, d) => s + d.amount, 0)
  const pending = filtered.filter((d) => d.status === "待审核").length

  const generateOrderNo = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0")
    return `YT-${year}${month}-${random}`
  }

  const openAddDialog = () => {
    setEditingId(null)
    setFormData(defaultFormData)
    setDialogOpen(true)
  }

  const openEditDialog = (record: DomesticOrderRecord) => {
    setEditingId(record.id)
    setFormData({
      customerName: record.customerName,
      gender: record.gender,
      country: record.country,
      serviceName: record.serviceName,
      amount: String(record.amount),
      touristCount: String(record.touristCount),
      touristNames: record.touristNames.join("、")
    })
    setDialogOpen(true)
    setSelected(null)
  }

  const handleSubmit = () => {
    if (!formData.customerName || !formData.serviceName || !formData.amount || !formData.touristCount) {
      return
    }
    const now = new Date().toISOString()
    if (editingId) {
      setRecords(records.map(d => d.id === editingId ? {
        ...d,
        customerName: formData.customerName,
        gender: formData.gender,
        country: formData.country,
        serviceName: formData.serviceName,
        amount: Number(formData.amount),
        touristCount: Number(formData.touristCount),
        touristNames: formData.touristNames.split(/[,，、]/).map(n => n.trim()).filter(Boolean),
        updatedAt: now
      } : d))
      toast({ title: "订单修改成功" })
    } else {
      const newOrder: DomesticOrderRecord = {
        id: Math.max(...records.map(d => d.id)) + 1,
        orderNo: generateOrderNo(),
        customerName: formData.customerName,
        country: formData.country,
        gender: formData.gender,
        serviceName: formData.serviceName,
        amount: Number(formData.amount),
        orderTime: now,
        touristCount: Number(formData.touristCount),
        touristNames: formData.touristNames.split(/[,，、]/).map(n => n.trim()).filter(Boolean),
        paymentTime: "",
        auditor: "",
        auditTime: "",
        status: "待审核",
        updatedAt: now
      }
      setRecords([newOrder, ...records])
      toast({ title: "订单创建成功" })
    }
    setFormData(defaultFormData)
    setDialogOpen(false)
    setEditingId(null)
  }

  const updateStatus = (id: number, s: OrderStatus) => {
    setRecords((prev) => prev.map((d) => d.id === id ? { ...d, status: s } : d))
    setSelected((prev) => prev?.id === id ? { ...prev, status: s } : prev)
    toast({ title: `订单状态已更新为「${s}」` })
  }

  const handleDelete = () => {
    if (selected) {
      setRecords(records.filter(d => d.id !== selected.id))
      setSelected(null)
      setDeleteDialogOpen(false)
      toast({ title: "订单已删除" })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={ClipboardList}
        title="境内订单管理"
        description="境内订单全流程与支付节点"
        actions={
          <div className="flex gap-2">
            <Button size="sm" className="btn-premium bg-primary hover:bg-primary/90" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-1.5" />
              新增订单
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1.5" />
              导出数据
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="订单数" value={filtered.length} icon={ClipboardList} />
        <StatCard title="合计金额" value={formatCurrency(total)} icon={Wallet} variant="gold" />
        <StatCard title="待审核" value={`${pending} 单`} icon={Clock} variant="highlight" />
      </div>

      <FilterCard onReset={() => { setKeyword(""); setStatus(undefined) }}>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">关键词搜索</Label>
          <Input 
            placeholder="姓名/订单号" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">订单状态</Label>
          <Select value={status} onValueChange={(v) => setStatus(v === "all" ? undefined : v as OrderStatus)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </FilterCard>

      <CustomerTable data={filtered} columns={columns} onRowClick={setSelected} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "编辑订单" : "新增订单"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>客户姓名 *</Label>
                <Input
                  placeholder="请输入客户姓名"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>性别</Label>
                <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="男">男</SelectItem>
                    <SelectItem value="女">女</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>服务名称 *</Label>
              <Input
                placeholder="请输入服务名称"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>订单金额 *</Label>
                <Input
                  type="number"
                  placeholder="请输入金额"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>游客人数 *</Label>
                <Input
                  type="number"
                  placeholder="请输入人数"
                  value={formData.touristCount}
                  onChange={(e) => setFormData({ ...formData, touristCount: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>游客姓名</Label>
              <Input
                placeholder="多个姓名用逗号分隔"
                value={formData.touristNames}
                onChange={(e) => setFormData({ ...formData, touristNames: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingId ? "保存修改" : "确认添加"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="sm:max-w-md glass-strong border-l border-border/50 flex flex-col">
          <SheetHeader>
            <SheetTitle className="text-lg">订单详情</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-6 flex-1 overflow-y-auto pb-6">
              
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-primary/5 to-[hsl(var(--yacht-gold))]/5 border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary/20 to-[hsl(var(--yacht-gold))]/20 flex items-center justify-center text-xl font-bold text-primary shadow-lg">
                    {selected.customerName[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{selected.customerName}</p>
                    <p className="text-sm text-muted-foreground">{selected.country} · {selected.gender}</p>
                  </div>
                </div>
                <OrderStatusPill status={selected.status} />
              </div>

              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  订单信息
                </div>
                <div className="space-y-3">
                  <DetailRow icon={FileText} label="订单编号" value={selected.orderNo} mono />
                  <DetailRow icon={User} label="服务名称" value={selected.serviceName} />
                  <DetailRow icon={CreditCard} label="订单金额" value={formatCurrency(selected.amount)} highlight />
                  <DetailRow icon={Users} label="游客信息" value={`${selected.touristCount}人：${selected.touristNames.join("、")}`} />
                </div>
              </div>

              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  时间记录
                </div>
                <div className="space-y-3">
                  <DetailRow label="下单时间" value={new Date(selected.orderTime).toLocaleString("zh-CN")} />
                  <DetailRow label="支付时间" value={new Date(selected.paymentTime).toLocaleString("zh-CN")} />
                  <DetailRow label="审核人" value={selected.auditor} />
                  <DetailRow label="审核时间" value={new Date(selected.auditTime).toLocaleString("zh-CN")} />
                  <DetailRow label="修改时间" value={new Date(selected.updatedAt).toLocaleString("zh-CN")} />
                </div>
              </div>

              
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-3">订单操作</p>
                <div className="flex gap-2 mb-3">
                  <Button 
                    size="sm" 
                    disabled={selected.status === "已审核"} 
                    onClick={() => updateStatus(selected.id, "已审核")}
                    className="flex-1 btn-premium"
                  >
                    <CheckCircle className="h-4 w-4 mr-1.5" />
                    通过审核
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={selected.status === "待审核"} 
                    onClick={() => updateStatus(selected.id, "待审核")}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-1.5" />
                    退回
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={selected.status === "退款中"} 
                    onClick={() => updateStatus(selected.id, "退款中")}
                    className="flex-1"
                  >
                    <RefreshCw className="h-4 w-4 mr-1.5" />
                    退款
                  </Button>
                </div>
                <Button variant="outline" className="w-full" onClick={() => openEditDialog(selected)}>
                  <Pencil className="h-4 w-4 mr-1.5" />
                  编辑订单信息
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 mt-2" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  删除订单
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            确定要删除订单「{selected?.orderNo}」吗？此操作无法撤销。
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDelete}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ 
  icon: Icon, 
  label, 
  value, 
  highlight,
  mono
}: { 
  icon?: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <dt className="text-sm text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </dt>
      <dd className={`text-sm text-right max-w-[60%] ${
        highlight ? "font-semibold text-[hsl(var(--yacht-gold))]" : "font-medium"
      } ${mono ? "font-mono text-xs bg-muted/50 px-2 py-0.5 rounded" : ""}`}>
        {value}
      </dd>
    </div>
  )
}
