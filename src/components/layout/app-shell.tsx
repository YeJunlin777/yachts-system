"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { appConfig } from '@/config/app.config'
import { moduleConfigs } from '@/config/modules'
import { ThemeToggle } from './theme-toggle'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'
import { Menu, X, ChevronDown, Anchor, Waves, LogOut, UserCog } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuthContext } from '@/components/providers/auth-provider'
import { toast } from '@/hooks/use-toast'
import { updateUser } from '@/lib/auth'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState({ displayName: '', email: '', password: '' })
  const { user, logout } = useAuthContext()
  
  const enabledModules = moduleConfigs.filter((module) =>
    appConfig.enabledSubsystems.includes(module.key)
  )

  const handleLogout = () => {
    logout()
    toast({ title: "已退出登录", description: "期待您的再次使用" })
    router.push("/login")
  }

  const handleOpenEditDialog = () => {
    if (user) {
      setEditForm({
        displayName: user.displayName,
        email: user.email,
        password: ''
      })
      setEditDialogOpen(true)
    }
  }

  const handleSaveProfile = () => {
    if (!user) return
    
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
    
    const result = updateUser(user.id, {
      displayName: editForm.displayName,
      email: editForm.email,
      ...(editForm.password && { password: editForm.password })
    })
    
    if (result.success) {
      toast({ title: "保存成功", description: "个人信息已更新，重新登录后生效" })
      setEditDialogOpen(false)
    } else {
      toast({ title: "保存失败", description: result.message, variant: "destructive" })
    }
  }

  
  const userInitial = user?.displayName?.charAt(0) || "用"

  return (
    <div className="h-screen flex flex-col bg-background ocean-pattern overflow-hidden">
      
      <header className="h-16 header-bg shrink-0 z-40">
        <div className="flex h-full items-center gap-4 px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-primary to-[hsl(var(--yacht-ocean))] flex items-center justify-center text-primary-foreground shadow-lg icon-glow">
              <Anchor className="h-5 w-5" />
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--yacht-gold))] shadow-sm" />
            </div>
            <p className="hidden sm:block text-sm font-semibold leading-none tracking-tight group-hover:text-primary transition-colors">
              {appConfig.brandName}
            </p>
          </Link>

          <div className="flex-1" />

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs text-muted-foreground">系统正常</span>
          </div>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-muted/50">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-[hsl(var(--yacht-gold))]/20 flex items-center justify-center text-xs font-semibold text-primary border border-primary/20">
                  {userInitial}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "用户"}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.role || "普通用户"}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 glass">
              <DropdownMenuItem className="cursor-pointer" onClick={handleOpenEditDialog}>
                <UserCog className="h-4 w-4 mr-2" />
                修改信息
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" 
            onClick={() => setSidebarOpen(false)} 
          />
        )}

        
        <aside className={cn(
          "fixed inset-y-0 left-0 top-16 z-50 w-60 sidebar-bg border-r border-border/50 flex flex-col transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-border/50">
            <span className="font-medium">导航菜单</span>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
            <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              功能模块
            </p>
            {enabledModules.map((module) => {
              const isActive = pathname === module.route || pathname.startsWith(module.route + '/')
              return (
                <Link
                  key={module.key}
                  href={module.route}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md nav-item-active" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-muted group-hover:bg-primary/10"
                  )}>
                    <module.icon className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary-foreground" : "group-hover:text-primary"
                    )} />
                  </div>
                  <span className="font-medium">{module.menuLabel}</span>
                </Link>
              )
            })}
          </nav>

          
          <div className="shrink-0 p-4 border-t border-border/50">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/5 to-[hsl(var(--yacht-gold))]/5 border border-border/50 p-4">
              <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-primary/5 animate-breathe" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Anchor className="h-4 w-4 text-primary" />
                  <p className="text-xs font-semibold">大数据预测分析</p>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  智能分析 · 精准预测
                </p>
              </div>
            </div>
          </div>
        </aside>

        
        <main className="flex-1 overflow-y-auto main-content-bg">
          <div className="p-6 lg:p-8 animate-fade-up">{children}</div>
        </main>
      </div>

      
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              修改个人信息
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">账号</Label>
              <Input 
                value={user?.account || ""}
                disabled
                className="bg-muted/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">姓名</Label>
              <Input 
                value={editForm.displayName}
                onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="用户姓名"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">邮箱</Label>
              <Input 
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="用户邮箱"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground font-medium">新密码（留空则不修改）</Label>
              <Input 
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="输入新密码"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditDialogOpen(false)}>
                取消
              </Button>
              <Button className="flex-1 btn-premium" onClick={handleSaveProfile}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
