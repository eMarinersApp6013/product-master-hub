import {
  Sparkles,
  Zap,
  Globe2,
  BookOpen,
  ImageIcon,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
} from 'lucide-react'

const weeklyData = [
  { day: 'Mon', total: 18400, listings: 8200, scraper: 4100, images: 3800, pdf: 2300 },
  { day: 'Tue', total: 22100, listings: 9800, scraper: 5200, images: 4400, pdf: 2700 },
  { day: 'Wed', total: 19800, listings: 8900, scraper: 4600, images: 3900, pdf: 2400 },
  { day: 'Thu', total: 24300, listings: 10800, scraper: 5900, images: 4700, pdf: 2900 },
  { day: 'Fri', total: 21600, listings: 9600, scraper: 5100, images: 4200, pdf: 2700 },
  { day: 'Sat', total: 26400, listings: 11700, scraper: 6300, images: 5100, pdf: 3300 },
  { day: 'Sun', total: 24871, listings: 11000, scraper: 5900, images: 4800, pdf: 3171 },
]

const featureStats = [
  { name: 'AI Listing Generator', icon: Sparkles, color: '#6366F1', requests: 69000, share: 43.8, avgPerUser: 53.5, change: '+12%', errors: 48 },
  { name: 'Product Scraper', icon: Globe2, color: '#10B981', requests: 37100, share: 23.6, avgPerUser: 28.8, change: '+8%', errors: 312 },
  { name: 'Image Optimizer', icon: ImageIcon, color: '#F59E0B', requests: 30900, share: 19.6, avgPerUser: 24.0, change: '+5%', errors: 89 },
  { name: 'PDF Catalog Gen', icon: BookOpen, color: '#EC4899', requests: 19500, share: 12.4, avgPerUser: 15.1, change: '+18%', errors: 22 },
  { name: 'Quick Actions', icon: Zap, color: '#8B5CF6', requests: 3871, share: 2.5, avgPerUser: 3.0, change: '-3%', errors: 5 },
]

const topUsers = [
  { name: 'Arjun Nair', plan: 'Enterprise', requests: 31200, plan_color: '#F59E0B' },
  { name: 'Vikram Singh', plan: 'Enterprise', requests: 21800, plan_color: '#F59E0B' },
  { name: 'Karan Mehta', plan: 'Pro', requests: 9100, plan_color: '#10B981' },
  { name: 'Priya Sharma', plan: 'Pro', requests: 8420, plan_color: '#10B981' },
  { name: 'Meena Iyer', plan: 'Pro', requests: 6800, plan_color: '#10B981' },
]

const errorLog = [
  { feature: 'Scraper', msg: 'Timeout on flipkart.com after 30s', count: 184, last: '12 min ago' },
  { feature: 'Scraper', msg: 'CAPTCHA detected — retries exhausted', count: 128, last: '1 hr ago' },
  { feature: 'Images', msg: 'File size exceeded 10MB limit', count: 89, last: '2 hr ago' },
  { feature: 'AI Listings', msg: 'OpenAI rate limit hit (429)', count: 48, last: '3 hr ago' },
  { feature: 'PDF', msg: 'Template render timeout >15s', count: 22, last: '5 hr ago' },
]

export default function AnalyticsPage() {
  const maxTotal = Math.max(...weeklyData.map(d => d.total))
  const weekTotal = weeklyData.reduce((s, d) => s + d.total, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">AI Usage Analytics</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Platform-wide AI consumption metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          {['7D', '30D', '90D'].map((r, i) => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-lg text-xs font-dm transition-colors ${i === 0 ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-500 hover:text-slate-300 bg-white/5'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests (7d)', value: weekTotal.toLocaleString('en-IN'), change: '+9.4%', up: true, icon: Sparkles, color: '#6366F1' },
          { label: 'Active AI Users', value: '1,284', change: '+18.4%', up: true, icon: Users, color: '#10B981' },
          { label: 'Avg Response Time', value: '1.24s', change: '-0.08s', up: true, icon: Clock, color: '#F59E0B' },
          { label: 'Error Rate', value: '0.31%', change: '-0.12%', up: true, icon: AlertTriangle, color: '#EC4899' },
        ].map((k) => {
          const Icon = k.icon
          return (
            <div key={k.label} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${k.color}18` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: k.color }} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-dm ${k.up ? 'text-emerald-400' : 'text-red-400'}`}>
                  {k.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {k.change}
                </span>
              </div>
              <p className="font-syne font-bold text-xl text-white">{k.value}</p>
              <p className="text-xs text-slate-500 font-dm mt-1">{k.label}</p>
            </div>
          )
        })}
      </div>

      {/* Stacked bar chart */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-syne font-semibold text-white">Daily Requests by Feature</h2>
          <div className="flex items-center flex-wrap gap-3">
            {[
              { label: 'AI Listings', color: '#6366F1' },
              { label: 'Scraper', color: '#10B981' },
              { label: 'Images', color: '#F59E0B' },
              { label: 'PDF', color: '#EC4899' },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-slate-400 font-dm">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {weeklyData.map((d) => {
            const total = d.total
            const segments = [
              { val: d.listings, color: '#6366F1' },
              { val: d.scraper, color: '#10B981' },
              { val: d.images, color: '#F59E0B' },
              { val: d.pdf, color: '#EC4899' },
            ]
            const heightPct = (total / maxTotal) * 100
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col-reverse rounded-t-md overflow-hidden" style={{ height: `${Math.round(heightPct * 1.4)}px` }}>
                  {segments.map((s, i) => (
                    <div
                      key={i}
                      className="w-full"
                      style={{
                        height: `${(s.val / total) * 100}%`,
                        backgroundColor: s.color,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-500 font-dm">{d.day}</p>
                  <p className="text-[10px] text-slate-600 font-dm">{(d.total / 1000).toFixed(1)}k</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Feature breakdown */}
        <div className="xl:col-span-2 glass-card rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">Feature Breakdown (7d)</h2>
          <div className="space-y-4">
            {featureStats.map((f) => {
              const Icon = f.icon
              const isPos = f.change.startsWith('+')
              return (
                <div key={f.name} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${f.color}18` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: f.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
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
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-slate-600 font-dm">{f.share}% of total</span>
                      <span className="text-[10px] text-slate-600 font-dm">{f.avgPerUser} avg/user · {f.errors} errors</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top users */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">Top Power Users</h2>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="space-y-3">
            {topUsers.map((u, i) => (
              <div key={u.name} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${u.plan_color}20` }}>
                  <span className="text-[10px] font-syne font-bold" style={{ color: u.plan_color }}>{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-200 truncate">{u.name}</p>
                  <span className="text-[10px] font-dm" style={{ color: u.plan_color }}>{u.plan}</span>
                </div>
                <span className="text-sm font-syne font-bold text-white">{u.requests.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Error log */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-semibold text-white">Error Log (7d)</h2>
          <span className="text-xs font-dm text-slate-500">
            Total errors: <span className="text-red-400 font-medium">476</span>
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Feature', 'Error Message', 'Count', 'Last Seen'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errorLog.map((e, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-xs font-dm px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">{e.feature}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-300 max-w-xs truncate">{e.msg}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-syne font-bold text-red-400">{e.count}</span>
                  </td>
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
