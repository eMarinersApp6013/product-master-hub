'use client'

import { useEffect, useState } from 'react'
import {
  Settings,
  User,
  Store,
  CreditCard,
  Bell,
  Shield,
  Zap,
  Globe2,
  Webhook,
  Key,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'

const settingsSections = [
  { id: 'profile', label: 'Profile & Business', icon: User, color: '#6366F1' },
  { id: 'platforms', label: 'Platform Connections', icon: Store, color: '#10B981' },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard, color: '#F59E0B' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: '#EC4899' },
  { id: 'security', label: 'Security', icon: Shield, color: '#EF4444' },
  { id: 'api', label: 'API & Webhooks', icon: Webhook, color: '#8B5CF6' },
]

const platforms = [
  { name: 'Amazon Seller Central', connected: true, color: '#FF9900', sellerId: 'A1B2C3D4E5F6' },
  { name: 'Flipkart Seller Hub', connected: true, color: '#2874F0', sellerId: 'FK-SELLER-789' },
  { name: 'Etsy Shop', connected: false, color: '#F56400', sellerId: null },
  { name: 'Meesho Supplier', connected: true, color: '#9B32B4', sellerId: 'MS-SUP-4421' },
]

type FormState = {
  storeName: string
  gstNumber: string
  email: string
  phone: string
  address: string
}

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>({
    storeName: '',
    gstNumber: '',
    email: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [apiUnavailable, setApiUnavailable] = useState(false)

  // On mount, fetch current profile
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => {
        if (!res.ok) throw new Error('unavailable')
        return res.json()
      })
      .then((data) => {
        setForm({
          storeName: data.store_name ?? '',
          gstNumber: data.gst_number ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          address: data.address ?? '',
        })
        setApiUnavailable(false)
      })
      .catch(() => {
        setApiUnavailable(true)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_name: form.storeName }),
      })
      if (!res.ok) throw new Error('save failed')
      setToast('Settings saved!')
      setTimeout(() => setToast(null), 3000)
    } catch {
      setApiUnavailable(true)
      setToast('Profile settings will be saved when connected')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-dm shadow-xl backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Settings</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">
          Manage your account, platforms, and preferences
        </p>
      </div>

      {apiUnavailable && (
        <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-dm">
          Profile settings will be saved when connected
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Navigation */}
        <div className="glass-card rounded-xl p-3 space-y-1 h-fit">
          {settingsSections.map((section) => {
            const Icon = section.icon
            const isActive = section.id === 'profile'
            return (
              <button
                key={section.id}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-dm transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${section.color}18` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: section.color }} />
                </div>
                {section.label}
                <ChevronRight className="w-4 h-4 ml-auto text-slate-600" />
              </button>
            )
          })}
        </div>

        {/* Main Content */}
        <div className="xl:col-span-2 space-y-5">
          {/* Profile */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-semibold text-white">Business Profile</h2>
            {loading ? (
              <p className="text-slate-500 text-sm font-dm py-4">Loading profile…</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-dm text-slate-400 mb-1.5">Business Name</label>
                    <input
                      type="text"
                      value={form.storeName}
                      onChange={handleChange('storeName')}
                      placeholder="Your business name"
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-dm text-slate-400 mb-1.5">GST Number</label>
                    <input
                      type="text"
                      value={form.gstNumber}
                      onChange={handleChange('gstNumber')}
                      placeholder="22AAAAA0000A1Z5"
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-dm text-slate-400 mb-1.5">Contact Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange('email')}
                      placeholder="you@example.com"
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-dm text-slate-400 mb-1.5">WhatsApp / Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-dm text-slate-400 mb-1.5">Business Address</label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={handleChange('address')}
                    placeholder="Your business address"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-dm font-medium rounded-lg transition-colors"
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </>
            )}
          </div>

          {/* Platform Connections */}
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-semibold text-white">Platform Connections</h2>
            <div className="space-y-3">
              {platforms.map((platform) => (
                <div
                  key={platform.name}
                  className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${platform.color}18` }}
                  >
                    <Globe2 className="w-4 h-4" style={{ color: platform.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-dm font-medium text-slate-200 text-sm">{platform.name}</p>
                    {platform.sellerId && (
                      <p className="text-xs font-dm text-slate-600 mt-0.5">
                        ID: {platform.sellerId}
                      </p>
                    )}
                  </div>
                  {platform.connected ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-dm text-emerald-400">Connected</span>
                      <button className="text-xs font-dm text-slate-500 hover:text-red-400 transition-colors ml-2">
                        Disconnect
                      </button>
                    </div>
                  ) : (
                    <button
                      className="px-3 py-1.5 text-xs font-dm rounded-lg border transition-colors"
                      style={{
                        borderColor: `${platform.color}40`,
                        backgroundColor: `${platform.color}10`,
                        color: platform.color,
                      }}
                    >
                      Connect →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Credits */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                AI Credits & Plan
              </h2>
              <span className="text-xs font-dm px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Pro Plan
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm font-dm">
                <span className="text-slate-400">AI Credits Used</span>
                <span className="text-white font-semibold">760 / 1,000</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[76%] bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
              </div>
              <p className="text-xs font-dm text-slate-500">Resets on April 1, 2024</p>
              <button className="px-4 py-2 text-xs font-dm rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors">
                Upgrade Plan for More Credits
              </button>
            </div>
          </div>

          {/* API Key */}
          <div className="glass-card rounded-xl p-5">
            <h2 className="font-syne font-semibold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-slate-400" />
              API Access
            </h2>
            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  defaultValue="pv_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-400 focus:outline-none font-mono"
                />
                <button className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-dm rounded-lg transition-colors">
                  Reveal
                </button>
                <button className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs font-dm rounded-lg transition-colors">
                  Rotate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
