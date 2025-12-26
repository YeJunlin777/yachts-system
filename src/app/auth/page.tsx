"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { PageHeader } from "@/components/ui/page-header"
import { Users, UserPlus, KeyRound, LogOut, Mail, User, Shield, Clock, Trash2, Pencil } from "lucide-react"
import { useAuthContext } from "@/components/providers/auth-provider"
import { addUser, changePassword, getAllUsers, deleteUser, updateUser } from "@/lib/auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const addUserSchema = z.object({
  account: z.string().min(3, "账号至少3个字符"),
  displayName: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("邮箱格式不正确"),
  role: z.string().min(1, "请选择角色"),
  password: z.string().min(6, "密码至少6位"),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"]
})

const resetSchema = z.object({
  account: z.string().min(3, "请输入账号"),
  oldPassword: z.string().min(6, "请输入旧密码"),
  newPassword: z.string().min(6, "新密码至少6位"),
  confirmPassword: z.string()
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"]
})

const roles = [
  { value: "admin", label: "管理员" },
  { value: "operator", label: "操作员" },
  { value: "auditor", label: "审核员" },
  { value: "analyst", label: "分析师" },
  { value: "sales", label: "销售" },
]

interface UserData {
  id: string
  account: string
  displayName: string
  email: string
  role: string
  lastLogin: string
  defaultPassword?: string
}

export default function Page() {
  const router = useRouter()
  const { logout, user: currentUser } = useAuthContext()
  const [users, setUsers] = useState<UserData[]>([])
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [editForm, setEditForm] = useState({ displayName: "", email: "", role: "", password: "" })
  
  const addUserForm = useForm({ resolver: zodResolver(addUserSchema), defaultValues: { account: "", displayName: "", email: "", role: "", password: "", confirmPassword: "" } })
  const resetForm = useForm({ resolver: zodResolver(resetSchema), defaultValues: { account: "", oldPassword: "", newPassword: "", confirmPassword: "" } })

  
  useEffect(() => {
    setUsers(getAllUsers())
    
    const handleUsersChange = () => {
      setUsers(getAllUsers())
    }
    
    window.addEventListener("users-change", handleUsersChange)
    return () => window.removeEventListener("users-change", handleUsersChange)
  }, [])

  const formattedUsers = users.map((u) => ({
    ...u,
    lastLogin: new Date(u.lastLogin).toLocaleString("zh-CN", { hour12: false })
  }))

  function handleAddUser(values: z.infer<typeof addUserSchema>) {
    const result = addUser({
      account: values.account,
      displayName: values.displayName,
      email: values.email,
      role: values.role,
      password: values.password
    })
    if (result.success) {
      toast({ title: "新增成功", description: result.message })
      addUserForm.reset()
    } else {
      toast({ title: "新增失败", description: result.message, variant: "destructive" })
    }
  }

  function handleReset(values: z.infer<typeof resetSchema>) {
    const result = changePassword({
      account: values.account,
      oldPassword: values.oldPassword,
      newPassword: values.newPassword
    })
    if (result.success) {
      toast({ title: "密码修改成功", description: result.message })
      resetForm.reset()
    } else {
      toast({ title: "修改失败", description: result.message, variant: "destructive" })
    }
  }

  function handleDeleteUser(userId: string, displayName: string) {
    if (!confirm(`确定要删除用户「${displayName}」吗？此操作不可恢复。`)) {
      return
    }
    const result = deleteUser(userId)
    if (result.success) {
      toast({ title: "删除成功", description: result.message })
    } else {
      toast({ title: "删除失败", description: result.message, variant: "destructive" })
    }
  }

  function handleEditUser(user: UserData) {
    setEditingUser(user)
    setEditForm({
      displayName: user.displayName,
      email: user.email,
      role: user.role,
      password: ""
    })
  }

  function handleSaveEdit() {
    if (!editingUser) return
    
    if (!editForm.displayName.trim()) {
      toast({ title: "保存失败", description: "姓名不能为空", variant: "destructive" })
      return
    }
    if (!editForm.email.trim()) {
      toast({ title: "保存失败", description: "邮箱不能为空", variant: "destructive" })
      return
    }
    if (editForm.password && editForm.password.length < 6) {
      toast({ title: "保存失败", description: "密码至少6位", variant: "destructive" })
      return
    }
    
    const result = updateUser(editingUser.id, {
      displayName: editForm.displayName,
      email: editForm.email,
      role: editForm.role,
      ...(editForm.password && { password: editForm.password })
    })
    
    if (result.success) {
      toast({ title: "保存成功", description: result.message })
      setEditingUser(null)
    } else {
      toast({ title: "保存失败", description: result.message, variant: "destructive" })
    }
  }

  function handleLogout() {
    logout()
    toast({ title: "已退出登录", description: "期待您的再次使用" })
    router.push("/login")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Users}
        title="用户管理"
        description="用户账号管理、新增用户、密码管理"
        actions={
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        }
      />

      
      <div className="grid gap-6 lg:grid-cols-2 items-stretch">
        
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--yacht-ocean))]/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-[hsl(var(--yacht-ocean))]" />
            </div>
            <div>
              <h3 className="font-semibold">新增用户</h3>
              <p className="text-xs text-muted-foreground">创建新的系统用户</p>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={addUserForm.handleSubmit(handleAddUser)}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="账号" error={addUserForm.formState.errors.account?.message}>
                <Input 
                  placeholder="登录账号"
                  {...addUserForm.register("account")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
              <Field label="姓名" error={addUserForm.formState.errors.displayName?.message}>
                <Input 
                  placeholder="用户姓名"
                  {...addUserForm.register("displayName")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="邮箱" error={addUserForm.formState.errors.email?.message}>
                <Input 
                  placeholder="请输入邮箱"
                  {...addUserForm.register("email")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
              <Field label="角色" error={addUserForm.formState.errors.role?.message}>
                <Select onValueChange={(v) => addUserForm.setValue("role", v)}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="密码" error={addUserForm.formState.errors.password?.message}>
                <Input 
                  type="password"
                  placeholder="设置密码"
                  {...addUserForm.register("password")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
              <Field label="确认密码" error={addUserForm.formState.errors.confirmPassword?.message}>
                <Input 
                  type="password"
                  placeholder="再次输入"
                  {...addUserForm.register("confirmPassword")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
            </div>
            <Button type="submit" className="w-full btn-premium">
              <UserPlus className="h-4 w-4 mr-2" />
              创建用户
            </Button>
          </form>
        </div>

        
        <div className="luxury-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--yacht-gold))]/10 flex items-center justify-center">
              <KeyRound className="h-5 w-5 text-[hsl(var(--yacht-gold))]" />
            </div>
            <div>
              <h3 className="font-semibold">修改密码</h3>
              <p className="text-xs text-muted-foreground">更新用户账号密码</p>
            </div>
          </div>
          
          <form className="space-y-4" onSubmit={resetForm.handleSubmit(handleReset)}>
            <Field label="账号" error={resetForm.formState.errors.account?.message}>
              <Input 
                placeholder="请输入账号"
                {...resetForm.register("account")}
                className="bg-background/50 border-border/50"
              />
            </Field>
            <Field label="旧密码" error={resetForm.formState.errors.oldPassword?.message}>
              <Input 
                type="password"
                placeholder="请输入旧密码"
                {...resetForm.register("oldPassword")}
                className="bg-background/50 border-border/50"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="新密码" error={resetForm.formState.errors.newPassword?.message}>
                <Input 
                  type="password"
                  placeholder="设置新密码"
                  {...resetForm.register("newPassword")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
              <Field label="确认密码" error={resetForm.formState.errors.confirmPassword?.message}>
                <Input 
                  type="password"
                  placeholder="再次输入"
                  {...resetForm.register("confirmPassword")}
                  className="bg-background/50 border-border/50"
                />
              </Field>
            </div>
            <Button type="submit" className="w-full" variant="outline">
              <KeyRound className="h-4 w-4 mr-2" />
              确认修改
            </Button>
          </form>
        </div>
      </div>

      
      <div className="luxury-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">系统用户</h3>
            <p className="text-xs text-muted-foreground">当前系统中的所有用户账号（共 {formattedUsers.length} 人）</p>
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formattedUsers.map((u, index) => (
            <div 
              key={u.id} 
              className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors animate-fade-up group relative"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-[hsl(var(--yacht-gold))]/20 flex items-center justify-center text-lg font-semibold text-primary shrink-0">
                  {u.displayName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{u.displayName}</span>
                    <span className="text-[10px] text-primary px-1.5 py-0.5 bg-primary/10 rounded-full font-medium">
                      {u.role}
                    </span>
                    {currentUser?.id === u.id && (
                      <span className="text-[10px] text-[hsl(var(--yacht-gold))] px-1.5 py-0.5 bg-[hsl(var(--yacht-gold))]/10 rounded-full font-medium">
                        当前
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <User className="h-3 w-3" />
                    {u.account}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Mail className="h-3 w-3" />
                    {u.email}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {u.lastLogin}
                  </p>
                </div>
              </div>
              
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditUser(u)}
                  className="h-7 w-7 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
                  title="编辑用户"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {currentUser?.id !== u.id && (
                  <button
                    onClick={() => handleDeleteUser(u.id, u.displayName)}
                    className="h-7 w-7 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors flex items-center justify-center"
                    title="删除用户"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              编辑用户
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Field label="账号">
              <Input 
                value={editingUser?.account || ""}
                disabled
                className="bg-muted/50"
              />
            </Field>
            <Field label="姓名">
              <Input 
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="用户姓名"
              />
            </Field>
            <Field label="邮箱">
              <Input 
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="用户邮箱"
              />
            </Field>
            <Field label="角色">
              <Select value={editForm.role} onValueChange={(v) => setEditForm(prev => ({ ...prev, role: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="新密码（留空则不修改）">
              <Input 
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="输入新密码"
              />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>
                取消
              </Button>
              <Button className="flex-1 btn-premium" onClick={handleSaveEdit}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ 
  label, 
  error, 
  children 
}: { 
  label: string
  error?: string
  children: React.ReactNode 
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
