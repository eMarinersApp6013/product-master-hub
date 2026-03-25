import { useState } from 'react'
import {
  Search, Filter, MoreVertical, Ban, AlertTriangle,
  Crown, ChevronUp, ChevronDown, UserCheck, Trash2,
  Mail, Shield, Download,
} from 'lucide-react'
import { USERS, type AppUser } from '../lib/data'

const PLAN_STYLE: Record<string, string> = {
  Free:       'text-slate-400 bg-slate-500/10 border-slate-500/20',
  Starter:    'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Pro:        'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Enterprise: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}
const STATUS_STYLE: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  warned: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  banned: 'text-red-400 bg-red-500/10 border-red-500/20',
}

type SortKey = keyof AppUser

export default function Users() {
  const [users, setUsers] = useState(USERS)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('id')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [menu, setMenu] = useState<number | null>(null)

  const filtered = users
    .filter((u) => {
      const q = search.toLowerCase()
      return (
        (u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
        (planFilter === 'All' || u.plan === planFilter) &&
        (statusFilter === 'All' || u.status === statusFilter)
      )
    })
    .sort((a, b) => {
      const av = a[sortKey] as string | number
      const bv = b[sortKey] as string | number
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  const doAction = (id: number, action: 'ban' | 'warn' | 'unban' | 'upgrade') => {
    setUsers((prev) => prev.map((u) => {
      if (u.id !== id) return u
      if (action === 'ban')     return { ...u, status: 'banned' as const }
      if (action === 'warn')    return { ...u, status: 'warned' as const }
      if (action === 'unban')   return { ...u, status: 'active' as const }
      if (action === 'upgrade') return { ...u, plan: 'Pro' as const }
      return u
    }))
    setMenu(null)
  }

  const SortIcons = ({ k }: { k: SortKey }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp   className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === k && sortDir === 'asc'  ? 'text-rose-400' : 'text-slate-600'}`} />
      <ChevronDown className={`w-2.5 h-2.5          ${sortKey === k && sortDir === 'desc' ? 'text-rose-400' : 'text-slate-600'}`} />
    </span>
  )

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Users</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">{users.length} total users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 text-sm font-dm transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'active', 'warned', 'banned'] as const).map((s) => {
          const count = s === 'All' ? users.length : users.filter(u => u.status === s).length
          const active = statusFilter === s
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-dm border capitalize transition-all ${
                active
                  ? s === 'All'    ? 'text-rose-400 bg-rose-500/15 border-rose-500/30'
                  : s === 'active' ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                  : s === 'warned' ? 'text-amber-400 bg-amber-500/15 border-amber-500/30'
                  :                  'text-red-400 bg-red-500/15 border-red-500/30'
                  : 'text-slate-400 bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              {s} <span className="opacity-70 ml-0.5">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none appearance-none cursor-pointer"
          >
            {['All', 'Free', 'Starter', 'Pro', 'Enterprise'].map((p) => (
              <option key={p} value={p} className="bg-[#1E293B]">{p === 'All' ? 'All Plans' : p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { label: 'User',     key: 'name'     },
                  { label: 'Plan',     key: 'plan'     },
                  { label: 'Status',   key: 'status'   },
                  { label: 'AI Usage', key: 'aiUsage'  },
                  { label: 'Products', key: 'products' },
                  { label: 'Joined',   key: 'joined'   },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key as SortKey)}
                    className="px-4 py-3 text-left text-xs font-dm text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 select-none transition-colors"
                  >
                    <span className="flex items-center">
                      {label}<SortIcons k={key as SortKey} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-dm text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                        <span className="text-xs font-syne font-bold text-white">{u.name[0]}</span>
                      </div>
                      <div>
                        <p className="text-sm font-dm text-slate-200">{u.name}</p>
                        <p className="text-xs font-dm text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-dm px-2 py-0.5 rounded border ${PLAN_STYLE[u.plan]}`}>{u.plan}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-dm px-2 py-0.5 rounded border capitalize ${STATUS_STYLE[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-300">{u.aiUsage.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-300">{u.products}</td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-500">{u.joined}</td>
                  <td className="px-4 py-3.5 text-right relative">
                    <button
                      onClick={() => setMenu(menu === u.id ? null : u.id)}
                      className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menu === u.id && (
                      <div className="absolute right-4 top-full mt-1 z-50 w-44 rounded-xl bg-[#1E293B] border border-white/10 shadow-xl overflow-hidden text-left">
                        <button onClick={() => doAction(u.id, 'warn')}   className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-amber-400 hover:bg-white/5">
                          <AlertTriangle className="w-3.5 h-3.5" /> Warn User
                        </button>
                        {u.status === 'banned'
                          ? <button onClick={() => doAction(u.id, 'unban')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-emerald-400 hover:bg-white/5">
                              <UserCheck className="w-3.5 h-3.5" /> Unban User
                            </button>
                          : <button onClick={() => doAction(u.id, 'ban')}   className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-red-400 hover:bg-white/5">
                              <Ban className="w-3.5 h-3.5" /> Ban User
                            </button>
                        }
                        <button onClick={() => doAction(u.id, 'upgrade')} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-indigo-400 hover:bg-white/5">
                          <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
                        </button>
                        <div className="border-t border-white/5" />
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-400 hover:bg-white/5">
                          <Mail className="w-3.5 h-3.5" /> Send Email
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-400 hover:bg-white/5">
                          <Shield className="w-3.5 h-3.5" /> View Details
                        </button>
                        <div className="border-t border-white/5" />
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-red-500 hover:bg-white/5">
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-slate-500 font-dm text-sm">No users match your filters.</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-dm">Showing {filtered.length} of {users.length}</p>
          <div className="flex items-center gap-1">
            {[1,2,3].map((p) => (
              <button key={p} className={`w-7 h-7 rounded-md text-xs font-dm transition-colors ${p === 1 ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:bg-white/5'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
