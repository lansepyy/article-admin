import {
  LayoutDashboard,
  ListTodo,
  HelpCircle,
  Settings,
  Newspaper,
  ClipboardClock,
  AlarmClockCheck,
  BookCheck,
  KeyRound,
} from 'lucide-react'
import { type SidebarData } from '../types'
import { useAuthStore } from '@/stores/auth-store.ts'
const { auth } = useAuthStore.getState()
export const sidebarData: SidebarData = {
  user: {
    name: auth.username,
  },
  navGroups: [
    {
      title: '通用',
      items: [
        {
          title: '内省',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: '闭关',
          icon: ListTodo,
          items: [
            {
              url: '/tasks',
              title: '闭关管理',
              icon: BookCheck,
            },
            {
              url: '/tasks/log',
              title: '闭关记录',
              icon: AlarmClockCheck,
            },
          ],
        },
        {
          title: '杀敌历程',
          url: '/download-log',
          icon: ClipboardClock,
        },
        {
          title: '修真界',
          url: '/articles',
          icon: Newspaper,
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          title: '装备检查',
          url: '/settings',
          icon: Settings,
        },
        {
          title: '门派令牌',
          url: '/tokens',
          icon: KeyRound,
        },
        {
          title: '问天',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
