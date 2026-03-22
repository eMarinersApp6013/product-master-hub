'use client'

import { useState } from 'react'
import {
  Zap,
  Sparkles,
  Crown,
  Users,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Plus,
  IndianRupee,
  TrendingUp,
  Check,
} from 'lucide-react'

type Plan = {
  id: string
  name: string
  price: number
  billing: string
  color: string
  icon: React.ElementType
  users: number
  mrr: number
  active: boolean
  features: string[]
  limits: { aiRequests: number; products: number; images: number; platforms: number }
}

const initialPlans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    billing: 'forever',
    color: '#64748B',
    icon: Zap,
    users: 612,
    mrr: 0,
    active: true,
    features: ['Up to 25 products', '50 AI requests/month', '2 platforms', 'Basic image tools', 'Community support'],
    limits: { aiRequests: 50, products: 25, images: 50, platforms: 2 },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 299,
    billing: '/month',
    color: '#6366F1',
    icon: Zap,
    users: 341,
    mrr: 101959,
    active: true,
    features: ['Up to 200 products', '1,000 AI requests/month', '4 platforms', 'Bulk image editing', 'PDF catalogs', 'Email support'],
    limits: { aiRequests: 1000, products: 200, images: 500, platforms: 4 },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 799,
    billing: '/month',
    color: '#10B981',
    icon: Sparkles,
    users: 218,
    mrr: 174182,
    active: true,
    features: ['Unlimited products', '10,000 AI requests/month', 'All platforms', 'Advanced analytics', 'Combo builder', 'Priority support', 'Custom store pages'],
    limits: { aiRequests: 10000, products: -1, images: -1, platforms: -1 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 1999,
    billing: '/month',
    color: '#F59E0B',
    icon: Crown,
    users: 113,
    mrr: 225887,
    active: true,
    features: ['Everything in Pro', 'Unlimited AI requests', 'Dedicated support manager', 'Custom integrations', 'White-label option', 'SLA guarantee', 'Team accounts'],
    limits: { aiRequests: -1, products: -1, images: -1, platforms: -1 },
  },
]

export default function PlansPage() {
  const [plans, setPlans] = useState(initialPlans)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)

  const togglePlan = (id: string) => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, active: !p.active } : p))
  }

  const startEdit = (plan: Plan) => {
    setEditingPlan(plan.id)
    setEditPrice(plan.price)
  }

  const saveEdit = (id: string) => {
    setPlans((prev) => prev.map((p) => p.id === id ? { ...p, price: editPrice } : p))
    setEditingPlan(null)
  }

  const totalMRR = plans.reduce((sum, p) => sum + p.mrr, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Subscription Plans</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Manage pricing, limits, and plan availability.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm transition-colors">
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <IndianRupee className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-dm">Total MRR</p>
            <p className="text-xl font-syne font-bold text-white">₹{(totalMRR).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-dm">Paying Users</p>
            <p className="text-xl font-syne font-bold text-white">{plans.filter(p => p.price > 0).reduce((s, p) => s + p.users, 0)}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-dm">Avg Revenue / User</p>
            <p className="text-xl font-syne font-bold text-white">₹572</p>
          </div>
        </div>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isEditing = editingPlan === plan.id
          return (
            <div
              key={plan.id}
              className={`glass-card rounded-xl p-5 transition-all ${!plan.active ? 'opacity-50' : ''}`}
              style={{ borderColor: `${plan.color}20` }}
            >
              {/* Plan header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="font-syne font-bold text-white text-lg">{plan.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-dm px-1.5 py-0.5 rounded" style={{ backgroundColor: `${plan.color}20`, color: plan.color }}>
                        {plan.users} users
                      </span>
                      {plan.mrr > 0 && (
                        <span className="text-xs text-emerald-400 font-dm">
                          ₹{plan.mrr.toLocaleString('en-IN')} MRR
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePlan(plan.id)}
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    title={plan.active ? 'Disable plan' : 'Enable plan'}
                  >
                    {plan.active
                      ? <ToggleRight className="w-5 h-5 text-emerald-400" />
                      : <ToggleLeft className="w-5 h-5" />
                    }
                  </button>
                </div>
              </div>

              {/* Price edit */}
              <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-white/5">
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-slate-400 font-dm text-sm">₹</span>
                    <input
                      type="number"
                      value={editPrice}
                      onChange={(e) => setEditPrice(Number(e.target.value))}
                      className="flex-1 bg-transparent text-white font-syne font-bold text-xl focus:outline-none"
                      autoFocus
                    />
                    <span className="text-slate-500 font-dm text-sm">{plan.billing}</span>
                    <button
                      onClick={() => saveEdit(plan.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-dm hover:bg-emerald-500/30 transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPlan(null)}
                      className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-dm hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-syne font-bold text-2xl text-white">
                        {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString('en-IN')}`}
                      </span>
                      {plan.price > 0 && <span className="text-slate-500 font-dm text-sm ml-1">{plan.billing}</span>}
                    </div>
                    <button
                      onClick={() => startEdit(plan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-dm transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Price
                    </button>
                  </>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: 'AI Requests', val: plan.limits.aiRequests },
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

      {/* Coupon / Promo section */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Promo Codes</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Code', 'Discount', 'Applies To', 'Uses', 'Expires', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { code: 'LAUNCH50', discount: '50% off', plan: 'All plans', uses: '142 / 200', expires: 'Mar 31, 2026', active: true },
                { code: 'PRO3FREE', discount: '3 months free', plan: 'Pro', uses: '38 / 50', expires: 'Apr 30, 2026', active: true },
                { code: 'STARTUP25', discount: '25% off', plan: 'Starter', uses: '89 / ∞', expires: 'Never', active: false },
              ].map((c) => (
                <tr key={c.code} className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 font-mono text-sm text-indigo-400">{c.code}</td>
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
