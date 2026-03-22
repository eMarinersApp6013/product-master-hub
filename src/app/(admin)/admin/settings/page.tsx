'use client'

import { useState } from 'react'
import {
  Shield,
  Sparkles,
  Globe2,
  ImageIcon,
  BookOpen,
  Bell,
  Lock,
  Database,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCw,
} from 'lucide-react'

type Toggle = {
  id: string
  label: string
  description: string
  enabled: boolean
  category: string
  icon: React.ElementType
  color: string
  danger?: boolean
}

const initialToggles: Toggle[] = [
  // AI Features
  { id: 'ai_listing', label: 'AI Listing Generator', description: 'Allow users to generate product listings using AI', enabled: true, category: 'AI Features', icon: Sparkles, color: '#6366F1' },
  { id: 'ai_descriptions', label: 'AI Description Rewriter', description: 'Rewrite and improve existing product descriptions', enabled: true, category: 'AI Features', icon: Sparkles, color: '#6366F1' },
  { id: 'ai_pricing', label: 'AI Price Suggestions', description: 'Suggest optimal pricing based on market data', enabled: false, category: 'AI Features', icon: Sparkles, color: '#6366F1' },
  { id: 'ai_tagging', label: 'AI Auto-Tagging', description: 'Automatically generate product tags and categories', enabled: true, category: 'AI Features', icon: Sparkles, color: '#6366F1' },
  // Platform
  { id: 'scraper', label: 'Product Scraper', description: 'Allow users to scrape product data from external URLs', enabled: true, category: 'Platform', icon: Globe2, color: '#10B981' },
  { id: 'image_optimizer', label: 'Image Optimizer', description: 'AI-powered image enhancement and background removal', enabled: true, category: 'Platform', icon: ImageIcon, color: '#F59E0B' },
  { id: 'pdf_catalog', label: 'PDF Catalog Generator', description: 'Generate printable product catalogs', enabled: true, category: 'Platform', icon: BookOpen, color: '#EC4899' },
  { id: 'store_pages', label: 'Custom Store Pages', description: 'Allow Pro+ users to create branded store pages', enabled: true, category: 'Platform', icon: Globe2, color: '#8B5CF6' },
  // Security
  { id: 'new_signups', label: 'New User Signups', description: 'Allow new users to register on the platform', enabled: true, category: 'Security & Access', icon: Shield, color: '#6366F1' },
  { id: 'free_plan', label: 'Free Plan Access', description: 'Allow users to use the Free tier', enabled: true, category: 'Security & Access', icon: Shield, color: '#64748B' },
  { id: 'rate_limiting', label: 'Rate Limiting', description: 'Enforce per-user API rate limits', enabled: true, category: 'Security & Access', icon: Lock, color: '#10B981' },
  { id: 'maintenance_mode', label: 'Maintenance Mode', description: 'Put platform in read-only maintenance mode for all users', enabled: false, category: 'Security & Access', icon: AlertTriangle, color: '#EF4444', danger: true },
  // Notifications
  { id: 'email_welcome', label: 'Welcome Emails', description: 'Send onboarding email to new users', enabled: true, category: 'Notifications', icon: Mail, color: '#6366F1' },
  { id: 'email_usage_alerts', label: 'Usage Alerts', description: 'Email users when they reach 80% of quota', enabled: true, category: 'Notifications', icon: Bell, color: '#F59E0B' },
  { id: 'admin_alerts', label: 'Admin Alert Emails', description: 'Send system alerts to marinersapp@gmail.com', enabled: true, category: 'Notifications', icon: Bell, color: '#EC4899' },
]

function Toggle({ on, onClick, danger }: { on: boolean; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
        on
          ? danger ? 'bg-red-500' : 'bg-indigo-500'
          : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-1'}`}
      />
    </button>
  )
}

const categories = ['AI Features', 'Platform', 'Security & Access', 'Notifications']

export default function SettingsPage() {
  const [toggles, setToggles] = useState(initialToggles)
  const [saved, setSaved] = useState(false)
  const [aiQuota, setAiQuota] = useState({ free: 50, starter: 1000, pro: 10000 })
  const [smtpHost, setSmtpHost] = useState('smtp.postmarkapp.com')
  const [smtpPort, setSmtpPort] = useState('587')

  const flip = (id: string) => {
    setToggles((prev) => prev.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">System Settings</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Configure platform features and global settings.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-dm transition-all ${
            saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Feature toggles by category */}
      {categories.map((cat) => {
        const items = toggles.filter((t) => t.category === cat)
        return (
          <div key={cat} className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-white/5 bg-white/3">
              <h2 className="font-syne font-semibold text-white text-sm">{cat}</h2>
            </div>
            <div className="divide-y divide-white/5">
              {items.map((t) => {
                const Icon = t.icon
                return (
                  <div key={t.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${t.color}18` }}>
                      <Icon className="w-4 h-4" style={{ color: t.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-dm font-medium ${t.danger ? 'text-red-400' : 'text-slate-200'}`}>{t.label}</p>
                        {t.danger && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20 font-dm">DANGER</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-dm mt-0.5">{t.description}</p>
                    </div>
                    <Toggle on={t.enabled} onClick={() => flip(t.id)} danger={t.danger} />
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {/* AI Quota limits */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
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
                type="number"
                value={aiQuota[key]}
                onChange={(e) => setAiQuota({ ...aiQuota, [key]: Number(e.target.value) })}
                className="w-full bg-transparent text-white font-syne font-bold text-xl focus:outline-none border-b border-white/10 pb-1 focus:border-indigo-500/50 transition-colors"
              />
              <p className="text-xs text-slate-600 font-dm mt-1">requests / month</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 font-dm mt-3">Enterprise plan has unlimited requests. Changes apply to new billing cycles.</p>
      </div>

      {/* SMTP / Email Config */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Mail className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-syne font-semibold text-white">Email / SMTP Configuration</h2>
            <p className="text-xs text-slate-500 font-dm">Transactional email settings</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'SMTP Host', value: smtpHost, onChange: setSmtpHost },
            { label: 'SMTP Port', value: smtpPort, onChange: setSmtpPort },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label className="block text-xs text-slate-500 font-dm mb-1.5">{label}</label>
              <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-500 font-dm mb-1.5">From Email</label>
            <input
              defaultValue="noreply@productvault.in"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 font-dm mb-1.5">From Name</label>
            <input
              defaultValue="ProductVault"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-dm border border-white/10 transition-colors">
          <RefreshCw className="w-3.5 h-3.5" /> Send Test Email
        </button>
      </div>

      {/* Database & Backups */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Database className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <h2 className="font-syne font-semibold text-white">Database &amp; Backups</h2>
            <p className="text-xs text-slate-500 font-dm">Backup schedule and storage</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Last Backup', value: '2 hours ago', icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Backup Size', value: '14.2 GB', icon: Database, color: 'text-indigo-400' },
            { label: 'Next Backup', value: 'In 4 hours', icon: RefreshCw, color: 'text-amber-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
              <Icon className={`w-5 h-5 ${color} shrink-0`} />
              <div>
                <p className="text-xs text-slate-500 font-dm">{label}</p>
                <p className="text-sm font-syne font-semibold text-white">{value}</p>
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
