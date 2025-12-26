
import usersData from "@/data/system/users.json"

export interface User {
  id: string
  account: string
  email: string
  role: string
  displayName: string
}

export interface NewUser {
  account: string
  displayName: string
  email: string
  role: string
  password: string
}

export interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

const AUTH_KEY = "yacht_auth"
const USERS_KEY = "yacht_users"

export function getAllUsers() {
  if (typeof window === "undefined") {
    return usersData
  }
  
  const stored = localStorage.getItem(USERS_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return usersData
    }
  }
  return usersData
}

function saveUsers(users: typeof usersData) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
  window.dispatchEvent(new Event("users-change"))
}

export function updateUser(userId: string, data: {
  displayName?: string
  email?: string
  role?: string
  password?: string
}): { success: boolean; message: string } {
  const users = getAllUsers()
  const userIndex = users.findIndex((u: typeof usersData[0]) => u.id === userId)
  
  if (userIndex === -1) {
    return { success: false, message: "用户不存在" }
  }
  
  
  if (data.email) {
    const emailExists = users.find((u: typeof usersData[0]) => u.email === data.email && u.id !== userId)
    if (emailExists) {
      return { success: false, message: "该邮箱已被其他用户使用" }
    }
  }
  
  const updatedUser = {
    ...users[userIndex],
    ...(data.displayName && { displayName: data.displayName }),
    ...(data.email && { email: data.email }),
    ...(data.role && { role: data.role }),
    ...(data.password && { defaultPassword: data.password })
  }
  
  const updatedUsers = [...users]
  updatedUsers[userIndex] = updatedUser
  saveUsers(updatedUsers)
  
  return { success: true, message: `用户 ${updatedUser.displayName} 信息已更新` }
}

export function deleteUser(userId: string): { success: boolean; message: string } {
  const users = getAllUsers()
  const user = users.find((u: typeof usersData[0]) => u.id === userId)
  
  if (!user) {
    return { success: false, message: "用户不存在" }
  }
  
  
  const currentUser = getCurrentUser()
  if (currentUser?.id === userId) {
    return { success: false, message: "不能删除当前登录的用户" }
  }
  
  const updatedUsers = users.filter((u: typeof usersData[0]) => u.id !== userId)
  saveUsers(updatedUsers)
  
  return { success: true, message: `用户 ${user.displayName} 已删除` }
}

export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isLoggedIn: false, user: null }
  }
  
  const stored = localStorage.getItem(AUTH_KEY)
  if (!stored) {
    return { isLoggedIn: false, user: null }
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return { isLoggedIn: false, user: null }
  }
}

export function login(account: string, password: string): { success: boolean; message: string; user?: User } {
  const users = getAllUsers()
  const user = users.find((u: typeof usersData[0]) => u.account === account)
  
  if (!user) {
    return { success: false, message: "账号不存在" }
  }
  
  if (password !== user.defaultPassword) {
    return { success: false, message: "密码错误" }
  }
  
  const authUser: User = {
    id: user.id,
    account: user.account,
    email: user.email,
    role: user.role,
    displayName: user.displayName
  }
  
  const authState: AuthState = {
    isLoggedIn: true,
    user: authUser
  }
  
  localStorage.setItem(AUTH_KEY, JSON.stringify(authState))
  
  
  window.dispatchEvent(new Event("auth-change"))
  
  return { success: true, message: "登录成功", user: authUser }
}

export function register(data: { 
  customerName: string
  email: string 
  password: string 
}): { success: boolean; message: string } {
  const users = getAllUsers()
  
  const exists = users.find((u: typeof usersData[0]) => u.email === data.email)
  if (exists) {
    return { success: false, message: "该邮箱已被注册" }
  }
  
  
  return { success: true, message: "注册申请已提交，请等待管理员审核" }
}

export function addUser(data: NewUser): { success: boolean; message: string } {
  const users = getAllUsers()
  
  
  const accountExists = users.find((u: typeof usersData[0]) => u.account === data.account)
  if (accountExists) {
    return { success: false, message: "该账号已存在" }
  }
  
  
  const emailExists = users.find((u: typeof usersData[0]) => u.email === data.email)
  if (emailExists) {
    return { success: false, message: "该邮箱已被使用" }
  }
  
  
  const newId = `USR-${Date.now()}`
  const newUser = {
    id: newId,
    account: data.account,
    displayName: data.displayName,
    email: data.email,
    role: data.role,
    defaultPassword: data.password,
    lastLogin: new Date().toISOString()
  }
  
  
  const updatedUsers = [...users, newUser]
  saveUsers(updatedUsers)
  
  return { success: true, message: `用户 ${data.displayName} 创建成功` }
}

export function changePassword(data: {
  account: string
  oldPassword: string
  newPassword: string
}): { success: boolean; message: string } {
  const users = getAllUsers()
  const userIndex = users.findIndex((u: typeof usersData[0]) => u.account === data.account)
  
  if (userIndex === -1) {
    return { success: false, message: "账号不存在" }
  }
  
  const user = users[userIndex]
  
  if (data.oldPassword !== user.defaultPassword) {
    return { success: false, message: "旧密码错误" }
  }
  
  
  const updatedUsers = [...users]
  updatedUsers[userIndex] = {
    ...user,
    defaultPassword: data.newPassword
  }
  saveUsers(updatedUsers)
  
  return { success: true, message: "密码修改成功，请使用新密码登录" }
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY)
  window.dispatchEvent(new Event("auth-change"))
}

export function isAuthenticated(): boolean {
  return getAuthState().isLoggedIn
}

export function getCurrentUser(): User | null {
  return getAuthState().user
}
