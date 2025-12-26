"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import type { User } from "@/lib/auth"

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  isLoading: boolean
  login: (account: string, password: string) => { success: boolean; message: string; user?: User }
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }
  return context
}
