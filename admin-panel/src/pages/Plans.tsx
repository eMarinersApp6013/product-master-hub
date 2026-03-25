import { useState } from 'react'
import { Zap, Sparkles, Crown, Users, Edit3, ToggleLeft, ToggleRight, Plus, IndianRupee, TrendingUp, Check } from 'lucide-react'
import { PLAN_CONFIG } from '../lib/data'

type PlanName = 'Free' | 'Starter' | 'Pro' | 'Enterprise'

type PlanDef = {
  id: PlanName
  color: string
  icon: typeof Zap
  active: boolean
  price: number
  features: string[]
  limits: { ai: number; products: number; platforms: number; images: number }
}

const INITIAL_PLANS: PlanDef[] = [
  {
    id: 'Free', color: '#64748B', icon: Zap, active: true, price: 0,
    features: ['25 products', '50 AI req/month', '2 platforms', 'Community support'],
    limits: { ai: 50, products: 25, platforms: 2, images: 50 },
  },
  {
    id: 'Starter', color: '#6366F1', icon: Zap, active: true, price: 299,
    features: ['200 products', '1,000 AI req/month', '4 platforms', 'Email support', 'PDF catalogs'],
    limits: { ai: 1000, products: 200, platforms: 4, images: 500 },
  },
  {
    id: 'Pro', color: '#10B981', icon: Sparkles, active: true, price: 799,
    features: ['Unlimited products', '10,000 AI req/month', 'All platforms', 'Priority support', 'Analytics', 'Store pages'],
    limits: { ai: 10000, products: -1, platforms: -1, images: -1 },
  },
  {
    id: 'Enterprise', color: '#F59E0B', icon: Crown, active: true, price: 1999,
    features: ['Everything in Pro', 'Unlimited AI requests', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
    limits: { ai: -1, products: -1, platforms: -1, images: -1 },
  },
]

export default function Plans() {
  const [plans, setPlans] = useState(INITIAL_PLANS)
  const [editing, setEditing] = useState<PlanName | null>(null)
  const [editPrice, setEditPrice] = useState(0)

  const toggle = (id: PlanName) => setPlans((p) => p.map((x) => x.id === id ? { ...x, active: !x.active } : x))
  const startEdit = (plan: PlanDef) => { setEditing(plan.id); setEditPrice(plan.price) }
  const saveEdit = (id: PlanName) => { setPlans((p) => p.map((x) => x.id === id ? { ...x, price: editPrice } : x)); setEditing(null) }

  const totalMRR = plans.reduce((s, p) => {
    const users = PLAN_CONFIG[p.id as keyof typeof PLAN_CONFIG]?.users ?? 0
    return s + (p.price * users)
  }, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Subscription Plans</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Manage pricing, limits & availability.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-sm font-dm transition-colors">
          <Plus className="w-4 h-4" /> New Plan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: IndianRupee, label: 'Total MRR', val: `₹${totalMRR.toLocaleString('en-IN')}`, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { icon: Users, label: 'Paying Users', val: '672', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { icon: TrendingUp, label: 'Avg Rev / User', val: '₹572/mo', color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(({ icon: Icon, label, val, color, bg }) => (
          <div key={label} className="glass rounded-xl p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-dm">{label}</p>
              <p className="text-xl font-syne font-bold text-white">{val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {plans.map((plan) => {
          const Icon = plan.icon
          const cfg = PLAN_CONFIG[plan.id as keyof typeof PLAN_CONFIG]
          const isEditing = editing === plan.id
          return (
            <div key={plan.id} className={`glass rounded-xl p-5 transition-all ${!plan.active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-white text-lg">{plan.id}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-dm px-1.5 py-0.5 rounded" style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>
                        {cfg?.users ?? 0} users
                      </span>
                      {plan.price > 0 && (
                        <span className="text-xs text-emerald-400 font-dm">₹{((cfg?.users ?? 0) * plan.price).toLocaleString('en-IN')} MRR</span>
                      )}
                    </div>
                  </div>
                </div>
                <button onClick={() => toggle(plan.id)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  {plan.active
                    ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                    : <ToggleLeft  className="w-5 h-5" />
                  }
                </button>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-slate-400 font-dm text-sm">₹</span>
                    <input
                      type="number" value={editPrice} autoFocus
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="flex-1 bg-transparent text-white font-syne font-bold text-xl focus:outline-none"
                    />
                    <button onClick={() => saveEdit(plan.id)} className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-dm hover:bg-emerald-500/30 transition-colors">Save</button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-dm hover:bg-white/10 transition-colors">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-syne font-bold text-2xl text-white">{plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}</span>
                      {plan.price > 0 && <span className="text-slate-500 font-dm text-sm ml-1">/month</span>}
                    </div>
                    <button onClick={() => startEdit(plan)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-dm transition-colors">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'AI Requests', val: plan.limits.ai },
                  { label: 'Products', val: plan.limits.products },
                  { label: 'Images', val: plan.limits.images },
                  { label: 'Platforms', val: plan.limits.platforms },
                ].map(({ label, val }) => (
                  <div key={label} className="px-3 py-2 rounded-lg bg-white/5">
                    <p className="text-xs text-slate-500 font-dm">{label}</p>
                    <p className="text-sm font-syne font-semibold mt-0.5" style={{ color: plan.color }}>
                      {val === -1 ? '∞ Unlimited' : val.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 shrink-0" style={{ color: plan.color }} />
                    <span className="text-xs font-dm text-slate-400">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Promo codes */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Promo Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Code','Discount','Applies To','Uses','Expires','Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'LAUNCH50',  discount: '50% off',        plan: 'All plans', uses: '142/200', expires: 'Mar 31, 2026', active: true  },
                { code: 'PRO3FREE',  discount: '3 months free',  plan: 'Pro',       uses: '38/50',   expires: 'Apr 30, 2026', active: true  },
                { code: 'STARTUP25', discount: '25% off',        plan: 'Starter',   uses: '89/∞',    expires: 'Never',        active: false },
              ].map((c) => (
                <tr key={c.code} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-rose-400">{c.code}</td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-300">{c.discount}</td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-400">{c.plan}</td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-400">{c.uses}</td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-500">{c.expires}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-dm px-2 py-0.5 rounded border ${c.active ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-slate-500 bg-white/5 border-white/10'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
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
