import {
  Users, IndianRupee, Sparkles, TrendingUp,
  CheckCircle2, AlertTriangle, Activity, Crown, Zap,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import StatCard from '../components/StatCard'
import { MONTHLY_REVENUE, PLAN_CONFIG, USERS, WEEKLY_AI } from '../lib/data'

const PLAN_COLORS = ['#64748B', '#6366F1', '#10B981', '#F59E0B']

const ALERTS = [
  { type: 'warning',  msg: 'AI quota at 87% for 3 Pro users',          time: '10 min ago' },
  { type: 'error',    msg: 'Scraper service timeout — 2 failed jobs',   time: '42 min ago' },
  { type: 'success',  msg: 'Database backup completed successfully',    time: '2 hr ago'   },
  { type: 'info',     msg: 'New support ticket from vikram@example.com',time: '3 hr ago'   },
]

const recentUsers = USERS.slice(0, 5)

const planBreakdown = Object.entries(PLAN_CONFIG).map(([name, cfg]) => ({
  name, ...cfg,
}))

const totalMRR = planBreakdown.reduce((s, p) => s + p.mrr, 0)

const weekTotal = WEEKLY_AI.reduce((s, d) => s + d.listings + d.scraper + d.images + d.pdf, 0)

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users"    value="1,284" change="+18.4%" up icon={Users}       color="#6366F1" bg="rgba(99,102,241,0.12)"  sub="142 new this month" />
        <StatCard label="Monthly MRR"    value="₹3,84,200" change="+11.2%" up icon={IndianRupee} color="#10B981" bg="rgba(16,185,129,0.12)" sub="↑ ₹42k from last month" />
        <StatCard label="AI Requests (7d)" value={weekTotal.toLocaleString('en-IN')} change="+9.4%" up icon={Sparkles} color="#F59E0B" bg="rgba(245,158,11,0.12)" sub="Avg 19.4 / user / day" />
        <StatCard label="Churn Rate"     value="2.1%" change="-0.4%" up icon={TrendingUp}   color="#EC4899" bg="rgba(236,72,153,0.12)" sub="27 cancelled this month" />
      </div>

      {/* MRR chart + pie */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">MRR Trend (8 months)</h2>
            <span className="text-xs font-dm text-emerald-400">+108% growth</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={MONTHLY_REVENUE}>
              <defs>
                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, fontFamily: 'DM Sans', fontSize: 12 }}
                formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'MRR']}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Area type="monotone" dataKey="mrr" stroke="#6366F1" strokeWidth={2} fill="url(#mrrGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Plan pie */}
        <div className="glass rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">User Plan Split</h2>
          <div className="flex justify-center mb-4">
            <PieChart width={160} height={160}>
              <Pie data={planBreakdown} dataKey="users" cx="50%" cy="50%" innerRadius={48} outerRadius={72} strokeWidth={0}>
                {planBreakdown.map((entry, i) => (
                  <Cell key={entry.name} fill={PLAN_COLORS[i]} opacity={0.85} />
                ))}
              </Pie>
            </PieChart>
          </div>
          <div className="space-y-2">
            {planBreakdown.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAN_COLORS[i] }} />
                  <span className="text-xs font-dm text-slate-400">{p.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-dm text-slate-500">{p.users}</span>
                  <span className="text-xs font-dm font-medium" style={{ color: PLAN_COLORS[i] }}>
                    {Math.round((p.users / 1284) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent users + alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent signups */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">Recent Signups</h2>
            <a href="/users" className="text-xs text-rose-400 hover:text-rose-300 font-dm transition-colors">View all →</a>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-xs font-syne font-bold text-white">{u.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-200 truncate">{u.name}</p>
                  <p className="text-xs font-dm text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[10px] font-dm font-medium px-1.5 py-0.5 rounded border ${
                    u.plan === 'Enterprise' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    : u.plan === 'Pro'      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : u.plan === 'Starter'  ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
                    :                         'text-slate-400 bg-slate-500/10 border-slate-500/20'
                  }`}>{u.plan}</span>
                  <span className="text-[10px] text-slate-600 font-dm">{u.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">System Alerts</h2>
            <span className="text-xs font-dm px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">1 critical</span>
          </div>
          <div className="space-y-3">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="mt-0.5 shrink-0">
                  {a.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {a.type === 'error'   && <AlertTriangle className="w-4 h-4 text-red-400" />}
                  {a.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {a.type === 'info'    && <Activity className="w-4 h-4 text-indigo-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-300">{a.msg}</p>
                  <p className="text-xs font-dm text-slate-600 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Mini quick stats */}
          <div className="mt-4 pt-3 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Users,  label: 'Active', val: '1,201', color: 'text-emerald-400' },
              { icon: AlertTriangle, label: 'Warned', val: '12', color: 'text-amber-400' },
              { icon: AlertTriangle, label: 'Banned', val: '12', color: 'text-red-400'   },
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

      {/* MRR breakdown table */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">MRR by Plan</h2>
        <div className="space-y-3">
          {[
            { name: 'Enterprise', users: 113, price: 1999, color: '#F59E0B', icon: Crown },
            { name: 'Pro',        users: 218, price: 799,  color: '#10B981', icon: Sparkles },
            { name: 'Starter',    users: 341, price: 299,  color: '#6366F1', icon: Zap },
          ].map(({ name, users, price, color, icon: Icon }) => {
            const mrr = users * price
            return (
              <div key={name} className="flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}20` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-dm font-medium" style={{ color }}>{name}</span>
                    <span className="text-sm font-syne font-bold text-white">₹{mrr.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-dm">{users} users × ₹{price}/mo</span>
                    <span className="text-xs text-slate-600 font-dm">{Math.round((mrr / totalMRR) * 100)}% of MRR</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-sm text-slate-400 font-dm">Total MRR</span>
          <span className="text-xl font-syne font-bold text-emerald-400">₹3,84,200</span>
        </div>
      </div>
    </div>
  )
}
