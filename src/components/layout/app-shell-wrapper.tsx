"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuthContext } from "@/components/providers/auth-provider"
import { AppShell } from "./app-shell"

const publicRoutes = ["/login"]

export function AppShellWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoggedIn, isLoading } = useAuthContext()
  
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  useEffect(() => {
    if (isLoading) return
    
    
    if (!isLoggedIn && !isPublicRoute) {
      router.replace("/login")
    }
  }, [isLoggedIn, isLoading, isPublicRoute, router])

  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  
  if (isPublicRoute) {
    return <>{children}</>
  }

  
  if (!isLoggedIn) {
    return null
  }

  
  return <AppShell>{children}</AppShell>
}
