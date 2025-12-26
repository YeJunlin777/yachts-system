"use client"

import initialData from "@/data/customers/domestic.json" assert { type: "json" }
import { useMemo, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { CustomerTable, ColumnDef } from "@/components/customers/customer-table"
import { PageHeader } from "@/components/ui/page-header"
import { StatCard } from "@/components/ui/stat-card"
import { FilterCard } from "@/components/ui/filter-card"
import type { DomesticCustomerRecord } from "@/types/customers"
import { formatCurrency } from "@/lib/data-utils"
import { Download, UsersRound, Wallet, FileText, User, Calendar, CreditCard, Plus, Pencil, Trash2 } from "lucide-react"

const defaultFormData = {
  customerName: "",
  gender: "男",
  country: "中国",
  serviceName: "",
  amount: "",
  touristCount: "",
  touristNames: ""
}

export default function DomesticCustomersPage() {
  const [data, setData] = useState<DomesticCustomerRecord[]>(initialData as DomesticCustomerRecord[])
  const [keyword, setKeyword] = useState("")
  const [gender, setGender] = useState<string>()
  const [selected, setSelected] = useState<DomesticCustomerRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(defaultFormData)

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (keyword && !d.customerName.includes(keyword) && !d.orderNo.includes(keyword) && !d.serviceName.includes(keyword)) return false
      if (gender && d.gender !== gender) return false
      return true
    }).sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())
  }, [keyword, gender])

  const columns: ColumnDef<DomesticCustomerRecord>[] = [
    { 
      key: "id", 
      label: "ID", 
      width: "60px",
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
    { 
      id: "action", 
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

  const total = filtered.reduce((s, d) => s + d.amount, 0)
  const tourists = filtered.reduce((s, d) => s + d.touristCount, 0)

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

  const openEditDialog = (record: DomesticCustomerRecord) => {
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
      setData(data.map(d => d.id === editingId ? {
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
    } else {
      const newCustomer: DomesticCustomerRecord = {
        id: Math.max(...data.map(d => d.id)) + 1,
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
        updatedAt: now
      }
      setData([newCustomer, ...data])
    }
    setFormData(defaultFormData)
    setDialogOpen(false)
    setEditingId(null)
  }

  const handleDelete = () => {
    if (selected) {
      setData(data.filter(d => d.id !== selected.id))
      setSelected(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={UsersRound}
        title="境内客户管理"
        description="境内客户档案、游客名单及审核记录"
        actions={
          <div className="flex gap-2">
            <Button size="sm" className="btn-premium bg-primary hover:bg-primary/90" onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-1.5" />
              新增客户
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1.5" />
              导出数据
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="订单数" value={filtered.length} icon={FileText} />
        <StatCard title="合计金额" value={formatCurrency(total)} icon={Wallet} variant="gold" />
        <StatCard title="游客人数" value={`${tourists} 人`} icon={UsersRound} variant="highlight" />
      </div>

      <FilterCard onReset={() => { setKeyword(""); setGender(undefined) }}>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">关键词搜索</Label>
          <Input 
            placeholder="姓名/订单号/服务" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)}
            className="bg-background/50 border-border/50 focus:border-primary/50"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">性别筛选</Label>
          <Select value={gender} onValueChange={(v) => setGender(v === "all" ? undefined : v)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部性别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部性别</SelectItem>
              <SelectItem value="男">男</SelectItem>
              <SelectItem value="女">女</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FilterCard>

      <CustomerTable data={filtered} columns={columns} onRowClick={setSelected} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "编辑客户" : "新增客户"}</DialogTitle>
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
            <SheetTitle className="text-lg">客户详情</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-6 flex-1 overflow-y-auto pb-6">
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-[hsl(var(--yacht-gold))]/5 border border-border/50">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-[hsl(var(--yacht-gold))]/20 flex items-center justify-center text-2xl font-bold text-primary shadow-lg">
                  {selected.customerName[0]}
                </div>
                <div>
                  <p className="text-lg font-semibold">{selected.customerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>{selected.country}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{selected.gender}</span>
                  </p>
                </div>
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
                  <DetailRow icon={UsersRound} label="游客人数" value={`${selected.touristCount} 人`} />
                  <DetailRow icon={User} label="游客姓名" value={selected.touristNames.join("、")} />
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

              <div className="pt-4 border-t border-border/50 space-y-2">
                <Button className="w-full" onClick={() => openEditDialog(selected)}>
                  <Pencil className="h-4 w-4 mr-1.5" />
                  编辑客户信息
                </Button>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  删除客户
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
            确定要删除客户「{selected?.customerName}」吗？此操作无法撤销。
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
