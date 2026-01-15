import { Outlet } from '@tanstack/react-router';
import {
  Monitor,
  Bell,
  Download,
  Folder,
  UserPen,
  Settings2,
} from 'lucide-react'
import { ConfigDrawer } from '@/components/config-drawer';
import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { TopNav } from '@/features/settings/components/top-nav.tsx';


const sidebarNavItems = [
  {
    title: '账户',
    href: '/settings',
    icon: <UserPen size={18} />,
  },
  {
    title: '目录',
    href: '/settings/folder',
    icon: <Folder size={18} />,
  },
  {
    title: '下载器',
    href: '/settings/downloader',
    icon: <Download size={18} />,
  },
  {
    title: '通知',
    href: '/settings/notifications',
    icon: <Bell size={18} />,
  },
  {
    title: '外观',
    href: '/settings/display',
    icon: <Monitor size={18} />,
  },
]

export function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
        </div>
      </Header>

      <Main fixed>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">服务器配置</h1>
          </div>
          <p className="text-muted-foreground">
            配置和管理您的下载器、媒体服务器等服务连接
          </p>
        </div>
        <TopNav items={sidebarNavItems} />
        <Outlet/>
      </Main>
    </>
  )
}
