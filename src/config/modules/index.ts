import {
  ChartNoAxesCombined,
  ClipboardList,
  Globe2,
  Home,
  LineChart,
  ScrollText,
  ShieldCheck,
  UserRoundCog,
  UsersRound
} from 'lucide-react'

import type { ModuleConfig } from '../types'

export const moduleConfigs: ModuleConfig[] = [
  {
    key: 'home',
    route: '/',
    menuLabel: '首页',
    icon: Home,
    description: '系统概览与快捷入口',
    category: 'core',
    dataSource: '',
    permissions: ['admin', 'operator', 'sales', 'analyst', 'auditor']
  },
  {
    key: 'user',
    route: '/auth',
    menuLabel: '用户管理',
    icon: UserRoundCog,
    description: '注册、登录、密码与会话管理',
    category: 'core',
    dataSource: '@/data/system/users.json',
    permissions: ['admin', 'operator'],
    options: {
      flows: ['register', 'login', 'reset-password', 'logout']
    }
  },
  {
    key: 'customer-domestic',
    route: '/customers/domestic',
    menuLabel: '境内客户管理',
    icon: UsersRound,
    description: '境内客户档案、游客名单及审核记录',
    category: 'operations',
    dataSource: '@/data/customers/domestic.json',
    permissions: ['sales', 'operator'],
    options: {
      filters: ['country', 'gender', 'orderDate', 'auditor']
    }
  },
  {
    key: 'customer-international',
    route: '/customers/international',
    menuLabel: '境外客户管理',
    icon: Globe2,
    description: '境外客户、省市信息与服务偏好',
    category: 'operations',
    dataSource: '@/data/customers/international.json',
    permissions: ['sales', 'operator'],
    options: {
      filters: ['province', 'city', 'serviceName']
    }
  },
  {
    key: 'order-domestic',
    route: '/orders/domestic',
    menuLabel: '境内订单管理',
    icon: ClipboardList,
    description: '境内订单全流程与支付节点',
    category: 'operations',
    dataSource: '@/data/orders/domestic.json',
    permissions: ['auditor', 'operator']
  },
  {
    key: 'order-international',
    route: '/orders/international',
    menuLabel: '境外订单管理',
    icon: ChartNoAxesCombined,
    description: '境外订单、省市组合及合规审核',
    category: 'operations',
    dataSource: '@/data/orders/international.json',
    permissions: ['auditor', 'operator']
  },
  {
    key: 'analytics',
    route: '/analytics',
    menuLabel: '数据预测分析',
    icon: LineChart,
    description: '客户与订单占比及年度趋势预测',
    category: 'analysis',
    dataSource: '@/data/analytics/series.json',
    permissions: ['analyst', 'operator'],
    options: {
      charts: ['customerMonthlyRatio', 'customerDomesticVsIntl', 'orderMonthlyRatio', 'orderDomesticVsIntl', 'customerForecast', 'orderForecast']
    }
  },
  {
    key: 'logs',
    route: '/logs',
    menuLabel: '日志管理',
    icon: ScrollText,
    description: '系统操作日志、导出与审计',
    category: 'system',
    dataSource: '@/data/system/logs.json',
    permissions: ['auditor', 'admin'],
    options: {
      filters: ['module', 'result', 'operator']
    }
  },
  {
    key: 'compliance',
    route: '/compliance',
    menuLabel: '合规稽核',
    icon: ShieldCheck,
    description: '自定义子系统示例，后续可通过配置开启',
    category: 'system',
    dataSource: '@/data/system/compliance.json',
    permissions: ['auditor'],
    options: {
      placeholder: true
    }
  }
]
