import users from "@/data/system/users.json" assert { type: "json" }

export interface MockUser {
  id: string
  account: string
  email: string
  role: string
  displayName: string
  defaultPassword: string
  lastLogin: string
  status: 'active' | 'locked'
}

export function getMockUsers(): MockUser[] {
  return users as MockUser[]
}
