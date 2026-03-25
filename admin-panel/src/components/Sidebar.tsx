import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, CreditCard, BarChart3, Settings,
  Headphones, Package, Bell, FileBarChart, ShieldCheck,
  ChevronLeft, ChevronRight, Zap,
} from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { to: '/dashboard',     label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/users',         label: 'Users',            icon: Users           },
  { to: '/plans',         label: 'Plans',            icon: CreditCard      },
  { to: '/analytics',     label: 'AI Analytics',     icon: BarChart3       },
  { to: '/settings',      label: 'System Settings',  icon: Settings        },
  { to: '/tickets',       label: 'Support Tickets',  icon: Headphones      },
  { to: '/products',      label: 'Products',         icon: Package         },
  { to: '/notifications', label: 'Notifications',    icon: Bell            },
  { to: '/reports',       label: 'Reports',          icon: FileBarChart    },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={clsx(
        'flex flex-col h-screen bg-navy-800 border-r border-white/5 transition-all duration-300 shrink-0',
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
            <p className="font-syne font-bold text-white text-base leading-none">Admin Panel</p>
            <p className="text-[10px] text-rose-400 font-dm">ProductVault</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'nav-active text-rose-300'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={clsx(
                    'w-[18px] h-[18px] shrink-0',
                    isActive ? 'text-rose-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {!collapsed && <span className="font-dm truncate">{label}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
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

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/5 flex items-center justify-between gap-2">
        <a
          href="/"
          className={clsx(
            'flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 font-dm transition-colors',
            collapsed && 'justify-center w-full'
          )}
          title={collapsed ? 'Back to App' : undefined}
        >
          <Zap className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && <span>Back to App</span>}
        </a>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors shrink-0"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>
    </aside>
  )
}
