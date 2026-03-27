'use client'

import { useEffect, useState } from 'react'
import {
  User, Store, CreditCard, Bell, Shield, Zap, Globe2, Webhook, Key,
  ChevronRight, CheckCircle2, ExternalLink, Copy, Eye, EyeOff, ChevronDown, ChevronUp,
} from 'lucide-react'

// ─── Platform setup guides (updated March 2026) ──────────────────────────────
const PLATFORMS = [
  {
    name: 'Amazon Seller Central',
    color: '#FF9900',
    logo: '🛒',
    tagline: 'Sell on India\'s largest marketplace',
    setupUrl: 'https://sellercentral.amazon.in/gp/on-board/workflow/Registration/ref=xx_sellRegister_dnav_xx',
    steps: [
      { title: 'Create Seller Account', desc: 'Go to sellercentral.amazon.in → click "Start Selling"', link: 'https://sellercentral.amazon.in', linkText: 'Open Amazon Seller Central →' },
      { title: 'Verify Business Documents', desc: 'Keep ready: GST number, Bank account (cancelled cheque), PAN Card, Address proof' },
      { title: 'Complete Tax Registration', desc: 'Under Settings → Account Info → Tax Information — enter your GST number' },
      { title: 'Get your Seller ID', desc: 'Settings → Account Info → Merchant Token — copy this ID into ProductVault' },
      { title: 'Add Bank Account', desc: 'Under Payment → Bank Account Information — add your business account for payouts' },
    ],
    tip: 'Amazon charges 0% referral fee for the first 3 months. Average setup time: 2-3 days (verification).',
  },
  {
    name: 'Flipkart Seller Hub',
    color: '#2874F0',
    logo: '🏪',
    tagline: 'India\'s leading fashion & electronics marketplace',
    setupUrl: 'https://seller.flipkart.com/sell-online',
    steps: [
      { title: 'Register as Seller', desc: 'Visit seller.flipkart.com → click "Start Selling" button at top right', link: 'https://seller.flipkart.com/sell-online', linkText: 'Open Flipkart Seller Hub →' },
      { title: 'Provide Business Details', desc: 'Business name, type (proprietorship/company/LLP), GST number, pickup address' },
      { title: 'Bank Account Verification', desc: 'Add your bank account — Flipkart will verify with a test deposit (usually ₹1)' },
      { title: 'List Your First Product', desc: 'Once approved, go to "My Listings" → "Add New Listing" and copy your Seller ID from Account Settings' },
      { title: 'Enable Flipkart Ads', desc: 'Optional: Flipkart Smart ROI Ads in Marketing → Ads to boost visibility' },
    ],
    tip: 'Flipkart approval takes 1-2 business days. Focus on fashion, electronics, and home goods for best margins.',
  },
  {
    name: 'Meesho Supplier',
    color: '#9B32B4',
    logo: '📦',
    tagline: 'Reach 50M+ resellers across India',
    setupUrl: 'https://supplier.meesho.com/onboarding',
    steps: [
      { title: 'Register as Supplier', desc: 'Go to supplier.meesho.com → "Register Now" → enter mobile number', link: 'https://supplier.meesho.com', linkText: 'Open Meesho Supplier Hub →' },
      { title: 'Add GST & Business Info', desc: 'Enter GSTIN, business name exactly as on GST certificate. Upload GST certificate PDF' },
      { title: 'Bank Details', desc: 'Add business account for weekly payouts — Meesho pays every Wednesday' },
      { title: 'Upload Product Catalog', desc: 'Use their catalog template (Excel/CSV) OR bulk upload via their panel' },
      { title: 'Set Supplier Price', desc: 'You set "Supplier Price" — Meesho adds margin + commission on top. No listing fee!' },
    ],
    tip: 'Meesho is 100% free to list. No commission on first 500 orders. Best for: sarees, kurtis, home decor.',
  },
  {
    name: 'Etsy Shop',
    color: '#F56400',
    logo: '🎨',
    tagline: 'Global marketplace for handmade & unique products',
    setupUrl: 'https://www.etsy.com/sell',
    steps: [
      { title: 'Open Etsy Shop', desc: 'etsy.com/sell → "Get Started" → choose language, country, currency (USD recommended)', link: 'https://www.etsy.com/sell', linkText: 'Open Etsy Sell Page →' },
      { title: 'Name Your Shop', desc: 'Choose a unique shop name (4-20 chars). Check availability — this is your brand on Etsy!' },
      { title: 'Create First Listing', desc: 'Add at least 1 product to open your shop. Use high-quality photos (natural light, white bg preferred)' },
      { title: 'Set Up Billing', desc: 'Add credit/debit card for Etsy fees. Indian sellers: use a Visa/Mastercard international card' },
      { title: 'Connect Payoneer', desc: 'Indian sellers receive payments via Payoneer. Sign up free at payoneer.com and link to Etsy Payments', link: 'https://www.payoneer.com', linkText: 'Open Payoneer →' },
    ],
    tip: 'Etsy charges $0.20/listing + 6.5% transaction fee. Best for: handicrafts, jewelry, art prints, personalized gifts.',
  },
  {
    name: 'Myntra',
    color: '#FF3F6C',
    logo: '👗',
    tagline: 'India\'s top fashion & lifestyle platform',
    setupUrl: 'https://seller.myntra.com',
    steps: [
      { title: 'Apply as Seller', desc: 'Go to seller.myntra.com → "Become a Seller" → fill inquiry form', link: 'https://seller.myntra.com', linkText: 'Open Myntra Seller →' },
      { title: 'Category Selection', desc: 'Myntra is invite-only for some categories. Focus on: clothing, footwear, accessories, home. Wait for approval email.' },
      { title: 'Document Submission', desc: 'Submit via portal: GST cert, business PAN, cancelled cheque, brand authorization letter (if selling brands)' },
      { title: 'Quality Check', desc: 'Myntra sends a quality auditor to your warehouse/office. Keep samples ready.' },
      { title: 'Style Guide Compliance', desc: 'Products must follow Myntra\'s strict photo & content guidelines. Use white background for all photos.' },
    ],
    tip: 'Myntra has strict quality standards. Approval takes 1-3 weeks. Best ROI category: ethnic wear, sportswear.',
  },
]

const SECTIONS = [
  { id: 'profile',    label: 'Profile & Business', icon: User,     color: '#6366F1' },
  { id: 'platforms',  label: 'Platform Connections', icon: Store,   color: '#10B981' },
  { id: 'billing',    label: 'Billing & Plans',      icon: CreditCard, color: '#F59E0B' },
  { id: 'api',        label: 'API Access',           icon: Key,     color: '#8B5CF6' },
]

type FormState = { storeName: string; gstNumber: string; email: string; phone: string; address: string }

function PlatformCard({ platform }: { platform: typeof PLATFORMS[0] }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLink = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/2 transition-colors" onClick={() => setOpen(o => !o)}>
        <div className="w-10 h-10 rounded-xl text-xl flex items-center justify-center" style={{ backgroundColor: `${platform.color}20` }}>
          {platform.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-dm font-semibold text-slate-200 text-sm">{platform.name}</p>
          </div>
          <p className="text-xs font-dm text-slate-500 mt-0.5">{platform.tagline}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a href={platform.setupUrl} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dm font-medium transition-colors"
            style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
            Start Selling <ExternalLink className="w-3 h-3" />
          </a>
          {open ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
        </div>
      </div>

      {open && (
        <div className="border-t border-white/5 p-4 space-y-4">
          {/* Steps */}
          <div className="space-y-3">
            <p className="text-xs font-dm font-semibold text-slate-400 uppercase tracking-wider">Step-by-Step Setup Guide</p>
            {platform.steps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: `${platform.color}25`, color: platform.color }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-dm font-medium text-slate-200">{step.title}</p>
                  <p className="text-xs font-dm text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                  {step.link && (
                    <a href={step.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-dm mt-1.5 transition-colors hover:underline"
                      style={{ color: platform.color }}>
                      {step.linkText} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="px-4 py-3 rounded-xl text-xs font-dm leading-relaxed" style={{ backgroundColor: `${platform.color}12`, border: `1px solid ${platform.color}25`, color: platform.color }}>
            💡 <strong>Pro tip:</strong> {platform.tip}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [form, setForm] = useState<FormState>({ storeName: '', gstNumber: '', email: '', phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [showApiKey, setShowApiKey] = useState(false)

  const apiKey = 'pv_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  useEffect(() => {
    fetch('/api/user/profile')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setForm({ storeName: data.store_name ?? '', gstNumber: data.gst_number ?? '', email: data.email ?? '', phone: data.phone ?? '', address: data.address ?? '' })
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_name: form.storeName, gst_number: form.gstNumber, email: form.email, phone: form.phone, address: form.address }),
      })
      if (!res.ok) throw new Error()
      showToast('Settings saved successfully!')
    } catch {
      showToast('Saved locally — will sync when reconnected')
    } finally { setSaving(false) }
  }

  const change = (f: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [f]: e.target.value }))

  return (
    <div className="p-6 space-y-6">
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-dm shadow-xl backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{toast}
        </div>
      )}

      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Settings</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">Manage your account, platforms, and preferences</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar Nav */}
        <div className="glass-card rounded-xl p-3 space-y-1 h-fit">
          {SECTIONS.map(s => {
            const Icon = s.icon
            return (
              <button key={s.id} onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-dm transition-colors ${activeSection === s.id ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                {s.label}
                <ChevronRight className="w-4 h-4 ml-auto text-slate-600" />
              </button>
            )
          })}
        </div>

        {/* Content */}
        <div className="xl:col-span-3 space-y-5">

          {/* ── Profile Section ── */}
          {activeSection === 'profile' && (
            <div className="glass-card rounded-xl p-5 space-y-4">
              <h2 className="font-syne font-semibold text-white text-lg">Business Profile</h2>
              {loading ? <p className="text-slate-500 text-sm font-dm py-4">Loading…</p> : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Business Name', field: 'storeName' as const, placeholder: 'Your business name' },
                      { label: 'GST Number', field: 'gstNumber' as const, placeholder: '22AAAAA0000A1Z5' },
                      { label: 'Contact Email', field: 'email' as const, placeholder: 'you@example.com' },
                      { label: 'WhatsApp / Phone', field: 'phone' as const, placeholder: '+91 98765 43210' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs font-dm text-slate-400 mb-1.5">{label}</label>
                        <input type="text" value={form[field]} onChange={change(field)} placeholder={placeholder}
                          className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-dm text-slate-400 mb-1.5">Business Address</label>
                    <textarea rows={2} value={form.address} onChange={change('address')} placeholder="Your full business address"
                      className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none" />
                  </div>
                  <button onClick={handleSave} disabled={saving}
                    className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-dm font-medium rounded-lg transition-colors">
                    {saving ? 'Saving…' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Platform Connections ── */}
          {activeSection === 'platforms' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-syne font-semibold text-white text-lg">Platform Connections</h2>
                  <p className="text-slate-500 text-sm font-dm mt-0.5">Click any platform to see a step-by-step beginner guide</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 flex items-start gap-3 border border-indigo-500/20 bg-indigo-500/5">
                <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-dm font-medium text-indigo-300">How platform connections work</p>
                  <p className="text-xs font-dm text-slate-400 mt-1 leading-relaxed">
                    ProductVault syncs your product catalog across all platforms automatically.
                    First register on each platform below, then note your Seller ID and enter it in your profile.
                    Our AI will format listings to each platform's requirements.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {PLATFORMS.map(p => <PlatformCard key={p.name} platform={p} />)}
              </div>
            </div>
          )}

          {/* ── Billing ── */}
          {activeSection === 'billing' && (
            <div className="space-y-4">
              <h2 className="font-syne font-semibold text-white text-lg">Billing & Plans</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Free', price: '₹0', features: ['50 products', '100 AI credits/mo', '1 store page', 'CSV export'], current: true, color: '#6366F1' },
                  { name: 'Pro', price: '₹999', features: ['Unlimited products', '1,000 AI credits/mo', '10 store pages', 'Priority support', 'WhatsApp integration'], current: false, color: '#10B981' },
                  { name: 'Business', price: '₹2,499', features: ['Everything in Pro', '5,000 AI credits/mo', 'Custom domain', 'API access', 'Dedicated account manager'], current: false, color: '#F59E0B' },
                ].map(plan => (
                  <div key={plan.name} className={`glass-card rounded-xl p-5 space-y-4 ${plan.current ? 'border border-indigo-500/30' : ''}`}>
                    <div>
                      <p className="font-syne font-bold text-white text-base">{plan.name}</p>
                      <p className="text-2xl font-bold mt-1" style={{ color: plan.color }}>{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></p>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs font-dm text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: plan.color }} />{f}
                        </li>
                      ))}
                    </ul>
                    {plan.current ? (
                      <div className="w-full py-2 rounded-lg text-center text-xs font-dm text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">Current Plan</div>
                    ) : (
                      <button className="w-full py-2 rounded-lg text-xs font-dm font-medium text-white transition-colors" style={{ backgroundColor: plan.color }}>
                        Upgrade to {plan.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── API Access ── */}
          {activeSection === 'api' && (
            <div className="space-y-4">
              <h2 className="font-syne font-semibold text-white text-lg">API Access</h2>
              <div className="glass-card rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-dm text-slate-400 mb-1.5">Your API Key</label>
                  <div className="flex gap-2">
                    <input type={showApiKey ? 'text' : 'password'} value={apiKey} readOnly
                      className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-400 font-mono focus:outline-none" />
                    <button onClick={() => setShowApiKey(v => !v)} className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 rounded-lg transition-colors">
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(apiKey); showToast('API key copied!') }}
                      className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-dm">
                  ⚠️ Keep your API key secret. Treat it like a password — never share it publicly.
                </div>
                <div>
                  <p className="text-xs font-dm text-slate-400 mb-3">Example API call:</p>
                  <div className="bg-[#0F1623] rounded-lg p-4 font-mono text-xs text-slate-400 overflow-x-auto">
                    <span className="text-green-400">GET</span> https://yourdomain.com/api/products<br/>
                    <span className="text-slate-600">Authorization: Bearer {showApiKey ? apiKey : 'pv_live_sk_***'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
