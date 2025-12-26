"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { login, register } from "@/lib/auth"
import { Anchor, Waves, LogIn, UserPlus, Eye, EyeOff, Lock, User, Mail, KeyRound, RefreshCw, X } from "lucide-react"
import { appConfig } from "@/config/app.config"
import { Toaster } from "@/components/ui/toaster"

const loginSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  password: z.string().min(1, "请输入密码")
})

const registerSchema = z.object({
  customerName: z.string().min(2, "姓名至少2个字符"),
  email: z.string().email("邮箱格式不正确"),
  password: z.string().min(6, "密码至少6位"),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"]
})

const resetSchema = z.object({
  account: z.string().min(1, "请输入账号"),
  email: z.string().email("邮箱格式不正确"),
  newPassword: z.string().min(6, "密码至少6位"),
  confirmPassword: z.string()
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "两次密码不一致",
  path: ["confirmPassword"]
})

type Tab = "login" | "register"

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  
  const loginForm = useForm({ 
    resolver: zodResolver(loginSchema), 
    defaultValues: { account: "", password: "" } 
  })
  
  const registerForm = useForm({ 
    resolver: zodResolver(registerSchema), 
    defaultValues: { customerName: "", email: "", password: "", confirmPassword: "" } 
  })

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { account: "", email: "", newPassword: "", confirmPassword: "" }
  })

  async function handleLogin(values: z.infer<typeof loginSchema>) {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = login(values.account, values.password)
    
    if (result.success) {
      toast({ title: "登录成功", description: `欢迎回来，${result.user?.displayName}` })
      router.push("/")
    } else {
      toast({ title: "登录失败", description: result.message, variant: "destructive" })
    }
    
    setIsSubmitting(false)
  }

  async function handleRegister(values: z.infer<typeof registerSchema>) {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const result = register({
      customerName: values.customerName,
      email: values.email,
      password: values.password
    })
    
    if (result.success) {
      toast({ title: "注册成功", description: result.message })
      registerForm.reset()
      setTab("login")
    } else {
      toast({ title: "注册失败", description: result.message, variant: "destructive" })
    }
    
    setIsSubmitting(false)
  }

  async function handleReset(values: z.infer<typeof resetSchema>) {
    setIsResetting(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    toast({ 
      title: "重置申请已提交", 
      description: `验证邮件已发送至 ${values.email}，请查收邮件确认重置密码` 
    })
    
    resetForm.reset()
    setResetOpen(false)
    setIsResetting(false)
  }

  return (
    <div className="min-h-screen main-content-bg ocean-pattern flex items-center justify-center p-6">
      
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-tr from-[hsl(var(--yacht-gold))]/5 to-transparent rounded-full blur-3xl animate-breathe" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary via-primary to-[hsl(var(--yacht-ocean))] text-white shadow-xl icon-glow mb-4">
            <Anchor className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{appConfig.brandName}</h1>
        </div>

        
        <div className="luxury-card p-6 sm:p-8">
          
          <div className="flex gap-2 mb-6 p-1 bg-muted/30 rounded-xl border border-border/50">
            <button
              type="button"
              onClick={() => setTab("login")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                tab === "login" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <LogIn className="h-4 w-4" />
              登录
            </button>
            <button
              type="button"
              onClick={() => setTab("register")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                tab === "register" 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <UserPlus className="h-4 w-4" />
              注册
            </button>
          </div>

          
          {tab === "login" && (
            <form className="space-y-4" onSubmit={loginForm.handleSubmit(handleLogin)}>
              <Field label="账号" error={loginForm.formState.errors.account?.message}>
                <Input 
                  placeholder="请输入账号" 
                  {...loginForm.register("account")}
                  className="bg-muted/30 border-border/50 h-11"
                />
              </Field>
              <Field label="密码" error={loginForm.formState.errors.password?.message}>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    {...loginForm.register("password")}
                    className="bg-muted/30 border-border/50 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>
              <Button type="submit" className="w-full h-11 btn-premium" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    登录中...
                  </span>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    登录
                  </>
                )}
              </Button>
              
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setResetOpen(true)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  忘记密码？
                </button>
              </div>
            </form>
          )}

          
          {tab === "register" && (
            <form className="space-y-4" onSubmit={registerForm.handleSubmit(handleRegister)}>
              <Field label="姓名" error={registerForm.formState.errors.customerName?.message}>
                <Input 
                  placeholder="请输入姓名"
                  {...registerForm.register("customerName")}
                  className="bg-muted/30 border-border/50 h-11"
                />
              </Field>
              <Field label="邮箱" error={registerForm.formState.errors.email?.message}>
                <Input 
                  type="email"
                  placeholder="请输入邮箱"
                  {...registerForm.register("email")}
                  className="bg-muted/30 border-border/50 h-11"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="密码" error={registerForm.formState.errors.password?.message}>
                  <Input 
                    type="password"
                    placeholder="设置密码"
                    {...registerForm.register("password")}
                    className="bg-muted/30 border-border/50 h-11"
                  />
                </Field>
                <Field label="确认密码" error={registerForm.formState.errors.confirmPassword?.message}>
                  <Input 
                    type="password"
                    placeholder="再次输入"
                    {...registerForm.register("confirmPassword")}
                    className="bg-muted/30 border-border/50 h-11"
                  />
                </Field>
              </div>
              <Button type="submit" className="w-full h-11 btn-premium" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </span>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    提交注册
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>

      
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-md glass-strong border-border/50">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-bold">重置密码</DialogTitle>
          </DialogHeader>
          
          
          <div className="flex justify-center py-4">
            <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Lock className="h-8 w-8 text-amber-500" />
            </div>
          </div>

          <form onSubmit={resetForm.handleSubmit(handleReset)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="text-red-500">*</span> 账号
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="请输入账号"
                  {...resetForm.register("account")}
                  className="bg-muted/30 border-border/50 h-11 pl-10"
                />
              </div>
              {resetForm.formState.errors.account && (
                <p className="text-xs text-destructive">{resetForm.formState.errors.account.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="text-red-500">*</span> 注册邮箱
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email"
                  placeholder="请输入注册时使用的邮箱"
                  {...resetForm.register("email")}
                  className="bg-muted/30 border-border/50 h-11 pl-10"
                />
              </div>
              {resetForm.formState.errors.email && (
                <p className="text-xs text-destructive">{resetForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="text-red-500">*</span> 新密码
              </Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="请输入新密码（至少6位）"
                  {...resetForm.register("newPassword")}
                  className="bg-muted/30 border-border/50 h-11 pl-10"
                />
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="text-red-500">*</span> 确认密码
              </Label>
              <div className="relative">
                <RefreshCw className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  placeholder="请再次输入新密码"
                  {...resetForm.register("confirmPassword")}
                  className="bg-muted/30 border-border/50 h-11 pl-10"
                />
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-border/50">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-11"
                onClick={() => {
                  resetForm.reset()
                  setResetOpen(false)
                }}
              >
                取消
              </Button>
              <Button 
                type="submit" 
                className="flex-1 h-11 bg-primary hover:bg-primary/90"
                disabled={isResetting}
              >
                {isResetting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </span>
                ) : "确定重置"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Toaster />
    </div>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}