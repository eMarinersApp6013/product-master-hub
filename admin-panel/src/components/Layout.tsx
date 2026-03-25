import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/users':         'Users',
  '/plans':         'Plans',
  '/analytics':     'AI Analytics',
  '/settings':      'System Settings',
  '/tickets':       'Support Tickets',
  '/products':      'Products',
  '/notifications': 'Notifications',
  '/reports':       'Reports',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] ?? 'Admin'

  return (
    <div className="flex h-screen bg-navy-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 bg-navy-900/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-syne font-semibold text-white">{title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-dm text-slate-500">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <span className="text-xs font-syne font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
