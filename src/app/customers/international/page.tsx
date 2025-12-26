"use client"

import initialData from "@/data/customers/international.json" assert { type: "json" }
import { useMemo, useState } from "react"

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
import type { InternationalCustomerRecord } from "@/types/customers"
import { formatCurrency } from "@/lib/data-utils"
import { Download, Globe2, Wallet, Users, FileText, User, Calendar, CreditCard, MapPin, Plus, Pencil, Trash2 } from "lucide-react"

const provinces = Array.from(new Set(initialData.map((d) => d.province)))

const defaultFormData = {
  customerName: "",
  gender: "男",
  province: "",
  city: "",
  serviceName: "",
  amount: "",
  touristCount: "",
  touristNames: ""
}

export default function InternationalCustomersPage() {
  const [data, setData] = useState<InternationalCustomerRecord[]>(initialData as InternationalCustomerRecord[])
  const [keyword, setKeyword] = useState("")
  const [province, setProvince] = useState<string>()
  const [city, setCity] = useState<string>()
  const [selected, setSelected] = useState<InternationalCustomerRecord | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(defaultFormData)

  const cities = useMemo(() => {
    if (!province) return Array.from(new Set(data.map((d) => d.city)))
    return Array.from(new Set(data.filter((d) => d.province === province).map((d) => d.city)))
  }, [province])

  const filtered = useMemo(() => {
    return data.filter((d) => {
      if (keyword && !d.customerName.toLowerCase().includes(keyword.toLowerCase()) && !d.orderNo.toLowerCase().includes(keyword.toLowerCase())) return false
      if (province && d.province !== province) return false
      if (city && d.city !== city) return false
      return true
    }).sort((a, b) => new Date(b.orderTime).getTime() - new Date(a.orderTime).getTime())
  }, [keyword, province, city])

  const columns: ColumnDef<InternationalCustomerRecord>[] = [
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
        <code className="text-xs bg-[hsl(var(--yacht-ocean))]/10 text-[hsl(var(--yacht-ocean))] px-2 py-1 rounded-md font-mono">
          {r.orderNo}
        </code>
      )
    },
    { 
      key: "customerName", 
      label: "客户姓名", 
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[hsl(var(--yacht-ocean))]/20 to-primary/20 flex items-center justify-center text-xs font-semibold text-[hsl(var(--yacht-ocean))]">
            {r.customerName[0]}
          </div>
          <span className="font-medium">{r.customerName}</span>
        </div>
      )
    },
    { 
      id: "location", 
      label: "地区", 
      render: (r) => (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{r.province}</span>
          <span className="text-muted-foreground/50">·</span>
          <span>{r.city}</span>
        </div>
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
  const avg = filtered.length ? (filtered.reduce((s, d) => s + d.touristCount, 0) / filtered.length).toFixed(1) : "0"

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

  const openEditDialog = (record: InternationalCustomerRecord) => {
    setEditingId(record.id)
    setFormData({
      customerName: record.customerName,
      gender: record.gender,
      province: record.province,
      city: record.city,
      serviceName: record.serviceName,
      amount: String(record.amount),
      touristCount: String(record.touristCount),
      touristNames: record.touristNames.join("、")
    })
    setDialogOpen(true)
    setSelected(null)
  }

  const handleSubmit = () => {
    if (!formData.customerName || !formData.serviceName || !formData.amount || !formData.touristCount || !formData.province || !formData.city) {
      return
    }
    const now = new Date().toISOString()
    if (editingId) {
      setData(data.map(d => d.id === editingId ? {
        ...d,
        customerName: formData.customerName,
        gender: formData.gender,
        province: formData.province,
        city: formData.city,
        serviceName: formData.serviceName,
        amount: Number(formData.amount),
        touristCount: Number(formData.touristCount),
        touristNames: formData.touristNames.split(/[,，、]/).map(n => n.trim()).filter(Boolean),
        updatedAt: now
      } : d))
    } else {
      const newCustomer: InternationalCustomerRecord = {
        id: Math.max(...data.map(d => d.id)) + 1,
        orderNo: generateOrderNo(),
        customerName: formData.customerName,
        province: formData.province,
        city: formData.city,
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
        icon={Globe2}
        title="境外客户管理"
        description="境外客户、省市信息与服务偏好"
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
        <StatCard title="订单数" value={filtered.length} icon={Globe2} />
        <StatCard title="合计金额" value={formatCurrency(total)} icon={Wallet} variant="gold" />
        <StatCard title="平均出行人数" value={`${avg} 人/单`} icon={Users} variant="highlight" />
      </div>

      <FilterCard onReset={() => { setKeyword(""); setProvince(undefined); setCity(undefined) }}>
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
          <Label className="text-xs text-muted-foreground font-medium">省份/州</Label>
          <Select value={province} onValueChange={(v) => { setProvince(v === "all" ? undefined : v); setCity(undefined) }}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部省份" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部省份</SelectItem>
              {provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground font-medium">城市</Label>
          <Select value={city} onValueChange={(v) => setCity(v === "all" ? undefined : v)}>
            <SelectTrigger className="bg-background/50 border-border/50">
              <SelectValue placeholder="全部城市" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部城市</SelectItem>
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>省份/州 *</Label>
                <Input
                  placeholder="请输入省份"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>城市 *</Label>
                <Input
                  placeholder="请输入城市"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
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
              
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-[hsl(var(--yacht-ocean))]/5 to-primary/5 border border-border/50">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--yacht-ocean))]/20 to-primary/20 flex items-center justify-center text-2xl font-bold text-[hsl(var(--yacht-ocean))] shadow-lg">
                  {selected.customerName[0]}
                </div>
                <div>
                  <p className="text-lg font-semibold">{selected.customerName}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selected.province}</span>
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    <span>{selected.city}</span>
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
                  <DetailRow icon={User} label="性别" value={selected.gender} />
                  <DetailRow icon={User} label="服务名称" value={selected.serviceName} />
                  <DetailRow icon={CreditCard} label="订单金额" value={formatCurrency(selected.amount)} highlight />
                  <DetailRow icon={Users} label="游客人数" value={`${selected.touristCount} 人`} />
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
