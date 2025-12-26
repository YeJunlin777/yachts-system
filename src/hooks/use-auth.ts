"use client"

import { useState, useEffect, useCallback } from "react"
import { getAuthState, login as authLogin, logout as authLogout, type User, type AuthState } from "@/lib/auth"

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({ isLoggedIn: false, user: null })
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const updateAuth = () => {
      setAuthState(getAuthState())
      setIsLoading(false)
    }
    
    updateAuth()
    
    window.addEventListener("auth-change", updateAuth)
    window.addEventListener("storage", updateAuth)
    
    return () => {
      window.removeEventListener("auth-change", updateAuth)
      window.removeEventListener("storage", updateAuth)
    }
  }, [])

  const login = useCallback((account: string, password: string) => {
    return authLogin(account, password)
  }, [])

  const logout = useCallback(() => {
    authLogout()
  }, [])

  return {
    isLoggedIn: authState.isLoggedIn,
    user: authState.user,
    isLoading,
    login,
    logout
  }
}
