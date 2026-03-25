import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts'
import { IndianRupee, TrendingUp, Users, Sparkles, Download, ArrowUpRight } from 'lucide-react'
import { MONTHLY_REVENUE, WEEKLY_AI } from '../lib/data'

const CHURN_DATA = [
  { month: 'Aug', churned: 12, acquired: 48 },
  { month: 'Sep', churned: 9,  acquired: 62 },
  { month: 'Oct', churned: 15, acquired: 71 },
  { month: 'Nov', churned: 8,  acquired: 58 },
  { month: 'Dec', churned: 6,  acquired: 84 },
  { month: 'Jan', churned: 11, acquired: 96 },
  { month: 'Feb', churned: 7,  acquired: 89 },
  { month: 'Mar', churned: 9,  acquired: 103 },
]

const PLAN_MRR = [
  { month: 'Jan', free: 0, starter: 72059, pro: 138218, enterprise: 138622 },
  { month: 'Feb', free: 0, starter: 78154, pro: 152014, enterprise: 131932 },
  { month: 'Mar', free: 0, starter: 101859, pro: 174182, enterprise: 225887 },
]

const TOP_FEATURES_REVENUE = [
  { feature: 'AI Listings', contribution: 184000, users: 891 },
  { feature: 'Image Tools', contribution: 98400,  users: 612 },
  { feature: 'Scraper',     contribution: 76200,  users: 441 },
  { feature: 'PDF Catalog', contribution: 42800,  users: 318 },
  { feature: 'Store Pages', contribution: 31200,  users: 218 },
]

const TOOLTIP_STYLE = {
  contentStyle: { background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12 },
  labelStyle: { color: '#94A3B8' },
}

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Revenue Reports</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Financial overview and growth metrics.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 text-sm font-dm transition-colors">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Current MRR',   val: '₹3,84,200', change: '+11.2%', icon: IndianRupee, color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
          { label: 'ARR',           val: '₹46,10,400',change: '+11.2%', icon: TrendingUp,  color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
          { label: 'Paying Users',  val: '672',        change: '+8.4%',  icon: Users,       color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
          { label: 'ARPU',          val: '₹572/mo',   change: '+2.6%',  icon: Sparkles,    color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
        ].map(({ label, val, change, icon: Icon, color, bg }) => (
          <div key={label} className="glass rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-dm text-emerald-400">
                <ArrowUpRight className="w-3 h-3" />{change}
              </span>
            </div>
            <p className="font-syne font-bold text-2xl text-white">{val}</p>
            <p className="text-slate-500 text-sm font-dm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* MRR trend */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">MRR Growth Trend</h2>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MONTHLY_REVENUE}>
            <defs>
              <linearGradient id="mrrG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'MRR']} />
            <Area type="monotone" dataKey="mrr" stroke="#6366F1" strokeWidth={2} fill="url(#mrrG)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Acquisition vs Churn + Plan MRR split */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">User Acquisition vs Churn</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHURN_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12, color: '#64748B', paddingTop: 8 }} />
              <Bar dataKey="acquired" name="Acquired" fill="#10B981" radius={[3,3,0,0]} />
              <Bar dataKey="churned"  name="Churned"  fill="#EF4444" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">MRR by Plan (last 3 months)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PLAN_MRR}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, '']} />
              <Legend wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12, color: '#64748B', paddingTop: 8 }} />
              <Line type="monotone" dataKey="starter"    name="Starter"    stroke="#6366F1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="pro"        name="Pro"        stroke="#10B981" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="enterprise" name="Enterprise" stroke="#F59E0B" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature revenue contribution */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Revenue by Feature Used</h2>
        <div className="space-y-3">
          {TOP_FEATURES_REVENUE.map((f) => {
            const pct = Math.round((f.contribution / 432600) * 100)
            return (
              <div key={f.feature} className="flex items-center gap-4">
                <div className="w-28 shrink-0">
                  <p className="text-sm font-dm text-slate-300">{f.feature}</p>
                  <p className="text-xs text-slate-600 font-dm">{f.users} users</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden mr-3">
                      <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500" style={{ width: `${pct}%`, opacity: 0.8 }} />
                    </div>
                    <span className="text-xs font-dm text-slate-400 shrink-0">{pct}%</span>
                  </div>
                </div>
                <span className="text-sm font-syne font-bold text-white shrink-0 w-24 text-right">
                  ₹{f.contribution.toLocaleString('en-IN')}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Monthly Revenue Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Month', 'New Users', 'Churned', 'Net MRR', 'MoM Growth'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { month: 'Mar 2026', new: 103, churned: 9,  mrr: 384200, growth: '+6.1%' },
                { month: 'Feb 2026', new: 89,  churned: 7,  mrr: 362100, growth: '+3.8%' },
                { month: 'Jan 2026', new: 96,  churned: 11, mrr: 348900, growth: '+11.7%'},
                { month: 'Dec 2025', new: 84,  churned: 6,  mrr: 312500, growth: '+19.7%'},
                { month: 'Nov 2025', new: 58,  churned: 8,  mrr: 261000, growth: '+9.4%' },
                { month: 'Oct 2025', new: 71,  churned: 15, mrr: 238700, growth: '+13.0%'},
              ].map((r) => (
                <tr key={r.month} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-sm font-dm text-slate-300 font-medium">{r.month}</td>
                  <td className="px-4 py-3 text-sm font-dm text-emerald-400">+{r.new}</td>
                  <td className="px-4 py-3 text-sm font-dm text-red-400">-{r.churned}</td>
                  <td className="px-4 py-3 text-sm font-syne font-bold text-white">₹{r.mrr.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-dm text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{r.growth}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
