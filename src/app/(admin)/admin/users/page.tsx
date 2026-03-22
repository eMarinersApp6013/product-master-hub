'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  MoreVertical,
  Ban,
  AlertTriangle,
  Crown,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Trash2,
  Mail,
  Shield,
  Download,
} from 'lucide-react'

const allUsers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@example.com', plan: 'Pro', status: 'active', joined: 'Jan 4, 2026', aiUsage: 8420, products: 312, location: 'Mumbai' },
  { id: 2, name: 'Rahul Gupta', email: 'rahul@example.com', plan: 'Starter', status: 'active', joined: 'Jan 9, 2026', aiUsage: 2140, products: 87, location: 'Delhi' },
  { id: 3, name: 'Anita Patel', email: 'anita@example.com', plan: 'Free', status: 'active', joined: 'Jan 14, 2026', aiUsage: 180, products: 11, location: 'Ahmedabad' },
  { id: 4, name: 'Vikram Singh', email: 'vikram@example.com', plan: 'Enterprise', status: 'active', joined: 'Dec 22, 2025', aiUsage: 21800, products: 1240, location: 'Bangalore' },
  { id: 5, name: 'Deepika Rao', email: 'deepika@example.com', plan: 'Free', status: 'warned', joined: 'Jan 3, 2026', aiUsage: 92, products: 4, location: 'Chennai' },
  { id: 6, name: 'Karan Mehta', email: 'karan@example.com', plan: 'Pro', status: 'active', joined: 'Dec 18, 2025', aiUsage: 9100, products: 421, location: 'Pune' },
  { id: 7, name: 'Sunita Verma', email: 'sunita@example.com', plan: 'Starter', status: 'banned', joined: 'Nov 30, 2025', aiUsage: 0, products: 0, location: 'Jaipur' },
  { id: 8, name: 'Arjun Nair', email: 'arjun@example.com', plan: 'Enterprise', status: 'active', joined: 'Dec 5, 2025', aiUsage: 31200, products: 2100, location: 'Kochi' },
  { id: 9, name: 'Meena Iyer', email: 'meena@example.com', plan: 'Pro', status: 'active', joined: 'Jan 1, 2026', aiUsage: 6800, products: 198, location: 'Hyderabad' },
  { id: 10, name: 'Sanjay Joshi', email: 'sanjay@example.com', plan: 'Free', status: 'active', joined: 'Jan 18, 2026', aiUsage: 340, products: 22, location: 'Nagpur' },
  { id: 11, name: 'Pooja Desai', email: 'pooja@example.com', plan: 'Starter', status: 'active', joined: 'Jan 12, 2026', aiUsage: 1820, products: 63, location: 'Surat' },
  { id: 12, name: 'Amit Kumar', email: 'amit@example.com', plan: 'Free', status: 'warned', joined: 'Dec 28, 2025', aiUsage: 0, products: 8, location: 'Lucknow' },
]

const planStyles: Record<string, string> = {
  Free: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  Starter: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Pro: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Enterprise: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

const statusStyles: Record<string, string> = {
  active: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  warned: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  banned: 'text-red-400 bg-red-500/10 border-red-500/20',
}

type SortKey = 'name' | 'plan' | 'status' | 'joined' | 'aiUsage' | 'products'

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortKey, setSortKey] = useState<SortKey>('joined')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [users, setUsers] = useState(allUsers)

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
      let av: string | number = a[sortKey as keyof typeof a] as string | number
      let bv: string | number = b[sortKey as keyof typeof b] as string | number
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const doAction = (id: number, action: 'ban' | 'warn' | 'unban' | 'upgrade') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u
        if (action === 'ban') return { ...u, status: 'banned' }
        if (action === 'warn') return { ...u, status: 'warned' }
        if (action === 'unban') return { ...u, status: 'active' }
        if (action === 'upgrade') return { ...u, plan: 'Pro' }
        return u
      })
    )
    setOpenMenu(null)
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className={`w-2.5 h-2.5 -mb-0.5 ${sortKey === k && sortDir === 'asc' ? 'text-indigo-400' : 'text-slate-600'}`} />
      <ChevronDown className={`w-2.5 h-2.5 ${sortKey === k && sortDir === 'desc' ? 'text-indigo-400' : 'text-slate-600'}`} />
    </span>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Users</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">{users.length} total users</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 text-sm font-dm transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'All', count: users.length, color: 'indigo' },
          { label: 'Active', count: users.filter(u => u.status === 'active').length, color: 'emerald' },
          { label: 'Warned', count: users.filter(u => u.status === 'warned').length, color: 'amber' },
          { label: 'Banned', count: users.filter(u => u.status === 'banned').length, color: 'red' },
        ].map(({ label, count, color }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(statusFilter === label ? 'All' : label)}
            className={`px-3 py-1.5 rounded-full text-xs font-dm border transition-all ${
              statusFilter === label
                ? `text-${color}-400 bg-${color}-500/15 border-${color}-500/30`
                : 'text-slate-400 bg-white/5 border-white/10 hover:border-white/20'
            }`}
          >
            {label} <span className="ml-1 opacity-70">{count}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
          >
            {['All', 'Free', 'Starter', 'Pro', 'Enterprise'].map((p) => (
              <option key={p} value={p} className="bg-[#1E293B]">{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { label: 'User', key: 'name' },
                  { label: 'Plan', key: 'plan' },
                  { label: 'Status', key: 'status' },
                  { label: 'AI Usage', key: 'aiUsage' },
                  { label: 'Products', key: 'products' },
                  { label: 'Joined', key: 'joined' },
                ].map(({ label, key }) => (
                  <th
                    key={key}
                    onClick={() => toggleSort(key as SortKey)}
                    className="px-4 py-3 text-left text-xs font-dm text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-300 transition-colors select-none"
                  >
                    <span className="flex items-center">
                      {label}
                      <SortIcon k={key as SortKey} />
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-dm text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
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
                    <span className={`text-xs font-dm font-medium px-2 py-0.5 rounded border ${planStyles[u.plan]}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-dm font-medium px-2 py-0.5 rounded border capitalize ${statusStyles[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-300">
                    {u.aiUsage.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-300">{u.products}</td>
                  <td className="px-4 py-3.5 text-sm font-dm text-slate-500">{u.joined}</td>
                  <td className="px-4 py-3.5 text-right relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                      className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === u.id && (
                      <div className="absolute right-4 top-full mt-1 z-50 w-44 rounded-xl bg-[#1E293B] border border-white/10 shadow-xl overflow-hidden">
                        <button
                          onClick={() => doAction(u.id, 'warn')}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-amber-400 hover:bg-white/5 transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" /> Warn User
                        </button>
                        {u.status === 'banned' ? (
                          <button
                            onClick={() => doAction(u.id, 'unban')}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-emerald-400 hover:bg-white/5 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Unban User
                          </button>
                        ) : (
                          <button
                            onClick={() => doAction(u.id, 'ban')}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-red-400 hover:bg-white/5 transition-colors"
                          >
                            <Ban className="w-3.5 h-3.5" /> Ban User
                          </button>
                        )}
                        <button
                          onClick={() => doAction(u.id, 'upgrade')}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-indigo-400 hover:bg-white/5 transition-colors"
                        >
                          <Crown className="w-3.5 h-3.5" /> Upgrade to Pro
                        </button>
                        <div className="border-t border-white/5" />
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-400 hover:bg-white/5 transition-colors">
                          <Mail className="w-3.5 h-3.5" /> Send Email
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-400 hover:bg-white/5 transition-colors">
                          <Shield className="w-3.5 h-3.5" /> View Details
                        </button>
                        <div className="border-t border-white/5" />
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-red-500 hover:bg-white/5 transition-colors">
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
            <p className="text-slate-500 font-dm">No users match your filters.</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-dm">Showing {filtered.length} of {users.length} users</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded-md text-xs font-dm transition-colors ${p === 1 ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:bg-white/5'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
