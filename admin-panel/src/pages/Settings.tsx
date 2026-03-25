import { useState } from 'react'
import { Sparkles, Globe2, ImageIcon, BookOpen, Bell, Lock, Database, Mail, AlertTriangle, CheckCircle2, Save, RefreshCw, Shield } from 'lucide-react'

type Toggle = { id: string; label: string; desc: string; on: boolean; cat: string; icon: typeof Sparkles; color: string; danger?: boolean }

const INITIAL: Toggle[] = [
  { id: 'ai_listing',    label: 'AI Listing Generator',    desc: 'Allow users to generate listings using AI',              on: true,  cat: 'AI Features',       icon: Sparkles,  color: '#6366F1' },
  { id: 'ai_rewrite',    label: 'AI Description Rewriter', desc: 'Rewrite and improve existing product descriptions',      on: true,  cat: 'AI Features',       icon: Sparkles,  color: '#6366F1' },
  { id: 'ai_pricing',    label: 'AI Price Suggestions',    desc: 'Suggest optimal pricing based on market data',           on: false, cat: 'AI Features',       icon: Sparkles,  color: '#6366F1' },
  { id: 'ai_tagging',    label: 'AI Auto-Tagging',         desc: 'Automatically generate product tags & categories',       on: true,  cat: 'AI Features',       icon: Sparkles,  color: '#6366F1' },
  { id: 'scraper',       label: 'Product Scraper',         desc: 'Allow users to scrape product data from external URLs',  on: true,  cat: 'Platform',          icon: Globe2,    color: '#10B981' },
  { id: 'image_opt',     label: 'Image Optimizer',         desc: 'AI-powered image enhancement and background removal',    on: true,  cat: 'Platform',          icon: ImageIcon, color: '#F59E0B' },
  { id: 'pdf_catalog',   label: 'PDF Catalog Generator',   desc: 'Generate printable product catalogs',                   on: true,  cat: 'Platform',          icon: BookOpen,  color: '#EC4899' },
  { id: 'store_pages',   label: 'Custom Store Pages',      desc: 'Allow Pro+ users to create branded store pages',        on: true,  cat: 'Platform',          icon: Globe2,    color: '#8B5CF6' },
  { id: 'new_signups',   label: 'New User Signups',        desc: 'Allow new users to register on the platform',           on: true,  cat: 'Security & Access', icon: Shield,    color: '#6366F1' },
  { id: 'free_plan',     label: 'Free Plan Access',        desc: 'Allow users to use the Free tier',                      on: true,  cat: 'Security & Access', icon: Shield,    color: '#64748B' },
  { id: 'rate_limit',    label: 'Rate Limiting',           desc: 'Enforce per-user API rate limits',                      on: true,  cat: 'Security & Access', icon: Lock,      color: '#10B981' },
  { id: 'maintenance',   label: 'Maintenance Mode',        desc: 'Put platform in read-only maintenance mode for all',    on: false, cat: 'Security & Access', icon: AlertTriangle, color: '#EF4444', danger: true },
  { id: 'email_welcome', label: 'Welcome Emails',          desc: 'Send onboarding email to new users',                   on: true,  cat: 'Notifications',     icon: Mail,      color: '#6366F1' },
  { id: 'usage_alerts',  label: 'Usage Alerts',            desc: 'Email users when they reach 80% of quota',             on: true,  cat: 'Notifications',     icon: Bell,      color: '#F59E0B' },
  { id: 'admin_alerts',  label: 'Admin Alert Emails',      desc: 'Send system alerts to marinersapp@gmail.com',          on: true,  cat: 'Notifications',     icon: Bell,      color: '#EC4899' },
]

const CATS = ['AI Features', 'Platform', 'Security & Access', 'Notifications']

function Toggler({ on, onClick, danger }: { on: boolean; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${on ? (danger ? 'bg-red-500' : 'bg-rose-500') : 'bg-white/10'}`}
    >
      <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-1'}`} />
    </button>
  )
}

export default function Settings() {
  const [toggles, setToggles] = useState(INITIAL)
  const [saved, setSaved] = useState(false)
  const [quotas, setQuotas] = useState({ free: 50, starter: 1000, pro: 10000 })
  const [smtp, setSmtp] = useState({ host: 'smtp.postmarkapp.com', port: '587', from: 'noreply@productvault.in', name: 'ProductVault' })

  const flip = (id: string) => {
    setToggles((p) => p.map((t) => t.id === id ? { ...t, on: !t.on } : t))
    setSaved(false)
  }

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">System Settings</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Configure platform features and global settings.</p>
        </div>
        <button onClick={save} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-dm transition-all ${saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500 hover:bg-rose-600 text-white'}`}>
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {CATS.map((cat) => {
        const items = toggles.filter((t) => t.cat === cat)
        return (
          <div key={cat} className="glass rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/5 bg-white/[0.02]">
              <h2 className="font-syne font-semibold text-white text-sm">{cat}</h2>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: t.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-dm font-medium ${t.danger ? 'text-red-400' : 'text-slate-200'}`}>{t.label}</p>
                        {t.danger && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20 font-dm">DANGER</span>}
                      </div>
                      <p className="text-xs text-slate-500 font-dm mt-0.5">{t.desc}</p>
                    </div>
                    <Toggler on={t.on} onClick={() => flip(t.id)} danger={t.danger} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* AI Quotas */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-syne font-semibold text-white">AI Request Quotas</h2>
            <p className="text-xs text-slate-500 font-dm">Monthly limits per plan</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { plan: 'Free', key: 'free' as const, color: '#64748B' },
            { plan: 'Starter', key: 'starter' as const, color: '#6366F1' },
            { plan: 'Pro', key: 'pro' as const, color: '#10B981' },
          ].map(({ plan, key, color }) => (
            <div key={plan} className="p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm font-dm font-medium" style={{ color }}>{plan}</span>
              </div>
              <input
                type="number" value={quotas[key]}
                onChange={(e) => setQuotas({ ...quotas, [key]: Number(e.target.value) })}
                className="w-full bg-transparent text-white font-syne font-bold text-xl focus:outline-none border-b border-white/10 pb-1 focus:border-rose-500/50 transition-colors"
              />
              <p className="text-xs text-slate-600 font-dm mt-1">requests / month</p>
            </div>
          ))}
        </div>
      </div>

      {/* SMTP */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="font-syne font-semibold text-white">Email / SMTP</h2>
            <p className="text-xs text-slate-500 font-dm">Transactional email settings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'SMTP Host', key: 'host' as const },
            { label: 'SMTP Port', key: 'port' as const },
            { label: 'From Email', key: 'from' as const },
            { label: 'From Name', key: 'name' as const },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-xs text-slate-500 font-dm mb-1.5">{label}</label>
              <input
                value={smtp[key]}
                onChange={(e) => setSmtp({ ...smtp, [key]: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors"
              />
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-dm border border-white/10 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Send Test Email
        </button>
      </div>

      {/* DB backup */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-syne font-semibold text-white">Database & Backups</h2>
            <p className="text-xs text-slate-500 font-dm">Backup schedule and storage</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Last Backup', val: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Backup Size', val: '14.2 GB',     icon: Database,     color: 'text-indigo-400'  },
            { label: 'Next Backup', val: 'In 4 hours',  icon: RefreshCw,    color: 'text-amber-400'   },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Icon className={`w-5 h-5 ${color} shrink-0`} />
              <div>
                <p className="text-xs text-slate-500 font-dm">{label}</p>
                <p className="text-sm font-syne font-semibold text-white">{val}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-sm font-dm border border-emerald-500/20 transition-colors">
          <Database className="w-3.5 h-3.5" /> Trigger Manual Backup
        </button>
      </div>
    </div>
  )
}
