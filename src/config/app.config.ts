import type { AppConfig } from './types'

export const appConfig: AppConfig = {
  projectName: '游艇旅游客户大数据预测分析管理系统',
  brandName: '游艇旅游客户大数据预测分析管理系统',
  theme: {
    primaryColor: '#0F172A',
    accentColor: '#0EA5E9',
    logoPath: '/brand/logo-wordmark.svg',
    backgroundAssets: ['/brand/bg-grid.svg', '/brand/bg-glow.svg']
  },
  texts: {
    heroTitle: '游艇旅游客户大数据预测分析管理系统',
    heroSubtitle:
      '实时洞察境内外游客行为、订单趋势与预测模型，助力决策团队快速响应市场变化。',
    footerNote: '© 2025 游艇旅游客户大数据预测分析管理系统 · All rights reserved'
  },
  enabledSubsystems: [
    'home',
    'user',
    'customer-domestic',
    'customer-international',
    'order-domestic',
    'order-international',
    'analytics',
    'logs'
  ]
}
