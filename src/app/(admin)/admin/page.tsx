import {
  Users,
  IndianRupee,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Crown,
  UserCheck,
  UserX,
  Zap,
} from 'lucide-react'

const stats = [
  {
    label: 'Total Users',
    value: '1,284',
    change: '+18.4%',
    trend: 'up',
    icon: Users,
    color: '#6366F1',
    bg: 'rgba(99,102,241,0.1)',
    sub: '142 new this month',
  },
  {
    label: 'Monthly Recurring Revenue',
    value: '₹3,84,200',
    change: '+11.2%',
    trend: 'up',
    icon: IndianRupee,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    sub: '↑ ₹42k from last month',
  },
  {
    label: 'AI Requests Today',
    value: '24,871',
    change: '+6.7%',
    trend: 'up',
    icon: Sparkles,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.1)',
    sub: 'Avg 19.4 / user',
  },
  {
    label: 'Churn Rate',
    value: '2.1%',
    change: '-0.4%',
    trend: 'up',
    icon: TrendingUp,
    color: '#EC4899',
    bg: 'rgba(236,72,153,0.1)',
    sub: '27 cancelled this month',
  },
]

const planBreakdown = [
  { name: 'Free', users: 612, color: '#64748B', pct: 47.7 },
  { name: 'Starter', users: 341, color: '#6366F1', pct: 26.6 },
  { name: 'Pro', users: 218, color: '#10B981', pct: 17.0 },
  { name: 'Enterprise', users: 113, color: '#F59E0B', pct: 8.8 },
]

const recentUsers = [
  { name: 'Priya Sharma', email: 'priya@example.com', plan: 'Pro', joined: '2 min ago', status: 'active' },
  { name: 'Rahul Gupta', email: 'rahul@example.com', plan: 'Starter', joined: '18 min ago', status: 'active' },
  { name: 'Anita Patel', email: 'anita@example.com', plan: 'Free', joined: '1 hr ago', status: 'active' },
  { name: 'Vikram Singh', email: 'vikram@example.com', plan: 'Enterprise', joined: '3 hr ago', status: 'active' },
  { name: 'Deepika Rao', email: 'deepika@example.com', plan: 'Free', joined: '5 hr ago', status: 'warned' },
]

const systemAlerts = [
  { type: 'warning', msg: 'AI quota at 87% for 3 Pro users', time: '10 min ago' },
  { type: 'error', msg: 'Scraper service timeout — 2 failed jobs', time: '42 min ago' },
  { type: 'success', msg: 'Database backup completed successfully', time: '2 hr ago' },
  { type: 'info', msg: 'New support ticket from vikram@example.com', time: '3 hr ago' },
]

const planColors: Record<string, string> = {
  Free: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  Starter: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  Pro: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Enterprise: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
}

export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Admin Overview</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Platform health &amp; key metrics at a glance.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-xs text-rose-300 font-dm">Admin Mode</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium font-dm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </span>
              </div>
              <p className="font-syne font-bold text-2xl text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm font-dm mt-1">{stat.label}</p>
              <p className="text-slate-600 text-xs font-dm mt-1">{stat.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plan Breakdown */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-5">User Plan Breakdown</h2>
          <div className="space-y-4">
            {planBreakdown.map((p) => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-sm font-dm text-slate-300">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 font-dm">{p.users} users</span>
                    <span className="text-xs font-dm font-medium" style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.pct}%`, backgroundColor: p.color, opacity: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Revenue split */}
          <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500 font-dm">Paying Users</p>
              <p className="text-lg font-syne font-bold text-white mt-1">672</p>
              <p className="text-xs text-emerald-400 font-dm">52.3% conversion</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5">
              <p className="text-xs text-slate-500 font-dm">Avg Revenue / User</p>
              <p className="text-lg font-syne font-bold text-white mt-1">₹572</p>
              <p className="text-xs text-indigo-400 font-dm">per month</p>
            </div>
          </div>
        </div>

        {/* Recent Signups */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">Recent Signups</h2>
            <a href="/admin/users" className="text-xs text-indigo-400 hover:text-indigo-300 font-dm transition-colors">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-syne font-bold text-white">{u.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-200 truncate">{u.name}</p>
                  <p className="text-xs font-dm text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border font-dm ${planColors[u.plan]}`}>
                    {u.plan}
                  </span>
                  <span className="text-[10px] text-slate-600 font-dm">{u.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">System Alerts</h2>
            <span className="text-xs font-dm px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
              1 critical
            </span>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="mt-0.5 shrink-0">
                  {a.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {a.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {a.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {a.type === 'info' && <Activity className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-300">{a.msg}</p>
                  <p className="text-xs font-dm text-slate-600 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: UserCheck, label: 'Active', val: '1,201', color: 'text-emerald-400' },
              { icon: UserX, label: 'Banned', val: '12', color: 'text-red-400' },
              { icon: Clock, label: 'Pending', val: '71', color: 'text-amber-400' },
            ].map(({ icon: Icon, label, val, color }) => (
              <div key={label} className="p-2 rounded-lg bg-white/5">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-1`} />
                <p className={`text-sm font-syne font-bold ${color}`}>{val}</p>
                <p className="text-[10px] text-slate-600 font-dm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Usage + Revenue row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* AI Usage bar chart */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">AI Usage — Last 7 Days</h2>
            <a href="/admin/analytics" className="text-xs text-indigo-400 hover:text-indigo-300 font-dm transition-colors">
              Full report →
            </a>
          </div>
          <div className="flex items-end gap-2 h-28">
            {[18400, 22100, 19800, 24300, 21600, 26400, 24871].map((v, i) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              const max = 26400
              const height = Math.round((v / max) * 100)
              const isToday = i === 6
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center" style={{ height: '88px' }}>
                    <div
                      className={`w-full rounded-t-md transition-all ${isToday ? 'bg-indigo-500' : 'bg-white/10'}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-dm ${isToday ? 'text-indigo-400' : 'text-slate-600'}`}>
                    {days[i]}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-500 font-dm">Total this week</p>
              <p className="text-lg font-syne font-bold text-white">157,471</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-dm">Peak day</p>
              <p className="text-lg font-syne font-bold text-indigo-400">26,400</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-dm">Top feature</p>
              <p className="text-sm font-syne font-semibold text-amber-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />AI Listings
              </p>
            </div>
          </div>
        </div>

        {/* MRR breakdown */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">MRR Breakdown</h2>
            <a href="/admin/plans" className="text-xs text-indigo-400 hover:text-indigo-300 font-dm transition-colors">
              Manage plans →
            </a>
          </div>
          <div className="space-y-3">
            {[
              { plan: 'Enterprise', users: 113, price: 1999, color: '#F59E0B', icon: Crown },
              { plan: 'Pro', users: 218, price: 799, color: '#10B981', icon: Sparkles },
              { plan: 'Starter', users: 341, price: 299, color: '#6366F1', icon: Zap },
            ].map(({ plan, users, price, color, icon: Icon }) => {
              const mrr = users * price
              return (
                <div key={plan} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-dm font-medium" style={{ color }}>{plan}</span>
                      <span className="text-sm font-syne font-bold text-white">₹{mrr.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-dm">{users} users × ₹{price}/mo</span>
                      <span className="text-xs text-slate-600 font-dm">{Math.round((mrr / 384200) * 100)}% of MRR</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-sm text-slate-400 font-dm">Total MRR</span>
            <span className="text-xl font-syne font-bold text-emerald-400">₹3,84,200</span>
          </div>
        </div>
      </div>
    </div>
  )
}
