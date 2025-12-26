export interface ThemeAssets {
  primaryColor: string
  accentColor: string
  logoPath: string
  backgroundAssets: string[]
}

export interface TextAssets {
  heroTitle: string
  heroSubtitle: string
  footerNote: string
}

export interface AppConfig {
  projectName: string
  brandName: string
  theme: ThemeAssets
  texts: TextAssets
  enabledSubsystems: string[]
}

export type ModuleCategory = 'core' | 'operations' | 'analysis' | 'system'

import type { LucideIcon } from 'lucide-react'

export interface ModuleConfig {
  key: string
  route: string
  menuLabel: string
  icon: LucideIcon
  description: string
  category: ModuleCategory
  dataSource: string
  permissions: string[]
  options?: Record<string, unknown>
}
