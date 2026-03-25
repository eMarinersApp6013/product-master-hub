import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line,
} from 'recharts'
import { Sparkles, Globe2, ImageIcon, BookOpen, AlertTriangle, TrendingUp, Users, Clock } from 'lucide-react'
import StatCard from '../components/StatCard'
import { WEEKLY_AI } from '../lib/data'

const FEATURE_STATS = [
  { name: 'AI Listings', icon: Sparkles,  color: '#6366F1', requests: 69000, share: 43.8, avg: 53.5, change: '+12%', errors: 48  },
  { name: 'Scraper',     icon: Globe2,    color: '#10B981', requests: 37100, share: 23.6, avg: 28.8, change: '+8%',  errors: 312 },
  { name: 'Images',      icon: ImageIcon, color: '#F59E0B', requests: 30900, share: 19.6, avg: 24.0, change: '+5%',  errors: 89  },
  { name: 'PDF Catalog', icon: BookOpen,  color: '#EC4899', requests: 19500, share: 12.4, avg: 15.1, change: '+18%', errors: 22  },
]

const ERROR_LOG = [
  { feature: 'Scraper',     msg: 'Timeout on flipkart.com after 30s',   count: 184, last: '12 min ago' },
  { feature: 'Scraper',     msg: 'CAPTCHA detected — retries exhausted', count: 128, last: '1 hr ago'   },
  { feature: 'Images',      msg: 'File size exceeded 10 MB limit',       count: 89,  last: '2 hr ago'   },
  { feature: 'AI Listings', msg: 'Rate limit hit (429)',                 count: 48,  last: '3 hr ago'   },
  { feature: 'PDF',         msg: 'Template render timeout >15 s',        count: 22,  last: '5 hr ago'   },
]

const TOP_USERS = [
  { name: 'Arjun Nair',   plan: 'Enterprise', requests: 31200, color: '#F59E0B' },
  { name: 'Vikram Singh', plan: 'Enterprise', requests: 21800, color: '#F59E0B' },
  { name: 'Karan Mehta',  plan: 'Pro',        requests: 9100,  color: '#10B981' },
  { name: 'Priya Sharma', plan: 'Pro',        requests: 8420,  color: '#10B981' },
  { name: 'Meena Iyer',   plan: 'Pro',        requests: 6800,  color: '#10B981' },
]

const RANGES = ['7D', '30D', '90D'] as const

export default function Analytics() {
  const [range, setRange] = useState<typeof RANGES[number]>('7D')

  const weekTotal = WEEKLY_AI.reduce((s, d) => s + d.listings + d.scraper + d.images + d.pdf, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">AI Usage Analytics</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Platform-wide AI consumption metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-dm transition-colors ${range === r ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 bg-white/5 hover:text-slate-300'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Requests (7d)" value={weekTotal.toLocaleString('en-IN')} change="+9.4%" up icon={Sparkles}       color="#6366F1" bg="rgba(99,102,241,0.12)"  />
        <StatCard label="Active AI Users"     value="1,284"   change="+18.4%" up icon={Users}         color="#10B981" bg="rgba(16,185,129,0.12)" />
        <StatCard label="Avg Response Time"   value="1.24 s"  change="-0.08s" up icon={Clock}         color="#F59E0B" bg="rgba(245,158,11,0.12)"  />
        <StatCard label="Error Rate"          value="0.31%"   change="-0.12%" up icon={AlertTriangle} color="#EC4899" bg="rgba(236,72,153,0.12)"  />
      </div>

      {/* Stacked bar chart */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Daily Requests by Feature</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={WEEKLY_AI} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="day" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12 }}
              labelStyle={{ color: '#94A3B8' }}
            />
            <Legend wrapperStyle={{ fontFamily: 'DM Sans', fontSize: 12, color: '#64748B', paddingTop: 8 }} />
            <Bar dataKey="listings" name="AI Listings" stackId="a" fill="#6366F1" radius={[0,0,0,0]} />
            <Bar dataKey="scraper"  name="Scraper"     stackId="a" fill="#10B981" />
            <Bar dataKey="images"   name="Images"      stackId="a" fill="#F59E0B" />
            <Bar dataKey="pdf"      name="PDF Catalog" stackId="a" fill="#EC4899" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Feature breakdown + top users */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">Feature Breakdown (7d)</h2>
          <div className="space-y-4">
            {FEATURE_STATS.map((f) => {
              const Icon = f.icon
              const isPos = f.change.startsWith('+')
              return (
                <div key={f.name} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${f.color}18` }}>
                    <Icon className="w-4 h-4" style={{ color: f.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-dm text-slate-300">{f.name}</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-dm ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>{f.change}</span>
                        <span className="text-xs font-dm text-slate-500">{f.requests.toLocaleString('en-IN')} req</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${f.share}%`, backgroundColor: f.color, opacity: 0.8 }} />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-slate-600 font-dm">{f.share}% of total</span>
                      <span className="text-[10px] text-slate-600 font-dm">{f.avg} avg/user · {f.errors} errors</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">Top Power Users</h2>
            <TrendingUp className="w-4 h-4 text-rose-400" />
          </div>
          <div className="space-y-3">
            {TOP_USERS.map((u, i) => (
              <div key={u.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${u.color}20` }}>
                  <span className="text-[10px] font-syne font-bold" style={{ color: u.color }}>{i+1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-200 truncate">{u.name}</p>
                  <span className="text-[10px] font-dm" style={{ color: u.color }}>{u.plan}</span>
                </div>
                <span className="text-sm font-syne font-bold text-white">{u.requests.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error log */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-semibold text-white">Error Log (7d)</h2>
          <span className="text-xs font-dm text-slate-500">Total: <span className="text-red-400 font-medium">476</span></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Feature','Error Message','Count','Last Seen'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ERROR_LOG.map((e, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-dm px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{e.feature}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-300 max-w-xs truncate">{e.msg}</td>
                  <td className="px-4 py-3 text-sm font-syne font-bold text-red-400">{e.count}</td>
                  <td className="px-4 py-3 text-xs font-dm text-slate-500">{e.last}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
