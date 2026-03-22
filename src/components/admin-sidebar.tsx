'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  HeadphonesIcon,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/plans', label: 'Plans', icon: CreditCard },
  { href: '/admin/analytics', label: 'AI Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
  { href: '/admin/tickets', label: 'Support Tickets', icon: HeadphonesIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-[#0F172A] border-r border-white/5 transition-all duration-300 relative shrink-0',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30 shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <span className="font-syne font-bold text-white text-base leading-none block">
              Admin Panel
            </span>
            <span className="text-[10px] text-rose-400 font-dm">ProductVault</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-gradient-to-r from-rose-500/20 to-rose-500/5 border-l-2 border-rose-500 text-rose-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-colors',
                  isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              {!collapsed && (
                <span className="font-dm truncate">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Admin badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="text-[11px] font-dm text-rose-300 truncate">marinersapp@gmail.com</span>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-white/5 flex items-center justify-between gap-3">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 font-dm transition-colors',
            collapsed && 'justify-center w-full'
          )}
          title={collapsed ? 'Back to App' : undefined}
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Back to App</span>}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </aside>
  )
}
