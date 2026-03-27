'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Package,
  Tag,
  ImageIcon,
  Sparkles,
  Globe2,
  BookOpen,
  Layers,
  ArrowLeftRight,
  Calculator,
  Store,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: Tag },
  { href: '/images', label: 'Images', icon: ImageIcon },
  { href: '/ai-studio', label: 'AI Studio', icon: Sparkles },
  { href: '/scraper', label: 'Scraper', icon: Globe2 },
  { href: '/pdf-catalog', label: 'PDF Catalog', icon: BookOpen },
  { href: '/combos', label: 'Combos', icon: Layers },
  { href: '/import-export', label: 'Import / Export', icon: ArrowLeftRight },
  { href: '/profit-calculator', label: 'Profit Calc', icon: Calculator },
  { href: '/store-pages', label: 'Store Pages', icon: Store },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const platforms = [
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Etsy', color: '#F56400' },
  { name: 'Meesho', color: '#9B32B4' },
]

export function Sidebar() {
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
        <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-syne font-bold text-white text-lg leading-none">
            ProductVault
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'nav-active text-indigo-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  'w-[18px] h-[18px] shrink-0 transition-colors',
                  isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'
                )}
              />
              {!collapsed && (
                <span className="font-dm truncate">{item.label}</span>
              )}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Platform badges */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-2 font-dm">
            Connected Platforms
          </p>
          <div className="flex flex-wrap gap-1.5">
            {platforms.map((p) => (
              <span
                key={p.name}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full font-dm"
                style={{
                  backgroundColor: `${p.color}18`,
                  color: p.color,
                  border: `1px solid ${p.color}30`,
                }}
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* User + Collapse */}
      <div className="px-3 py-4 border-t border-white/5 flex items-center gap-3">
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: 'w-8 h-8',
            },
          }}
        />
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400 font-dm truncate">My Account</p>
          </div>
        )}
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
