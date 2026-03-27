'use client'

import { useState, useEffect } from 'react'
import { Store, Plus, Eye, Edit2, Trash2, Copy, Globe, RefreshCw } from 'lucide-react'

interface StorePage {
  id: number; title: string; slug: string; template: string
  published: boolean; visits: number; created_at: string; updated_at: string
}

const TEMPLATES = [
  { id: 'landing',   label: 'Landing Page',   desc: 'Hero section, features, CTA button' },
  { id: 'catalog',   label: 'Product Catalog', desc: 'Grid of all your products with filters' },
  { id: 'wholesale', label: 'Wholesale',       desc: 'B2B pricing table, bulk order form' },
  { id: 'seasonal',  label: 'Seasonal Sale',   desc: 'Banner, countdown, discounted products' },
]

export default function StorePagesPage() {
  const [pages,    setPages]    = useState<StorePage[]>([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [copied,   setCopied]   = useState<number | null>(null)

  // Form
  const [title,    setTitle]    = useState('')
  const [slug,     setSlug]     = useState('')
  const [template, setTemplate] = useState('catalog')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/store-pages')
      if (res.ok) { const d = await res.json(); setPages(d.pages || []) }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleTitleChange = (v: string) => {
    setTitle(v)
    setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
  }

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) { setError('Title and slug are required'); return }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/store-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, slug, template, published: true }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Save failed') }
      setShowForm(false); setTitle(''); setSlug('')
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this page?')) return
    await fetch(`/api/store-pages/${id}`, { method: 'DELETE' })
    setPages(prev => prev.filter(p => p.id !== id))
  }

  const handleTogglePublish = async (page: StorePage) => {
    const res = await fetch(`/api/store-pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !page.published }),
    })
    if (res.ok) setPages(prev => prev.map(p => p.id === page.id ? { ...p, published: !p.published } : p))
  }

  const handleCopy = (page: StorePage) => {
    const url = `${window.location.origin}/store/${page.slug}`
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(page.id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Store Pages</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Create shareable product pages for your customers</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />New Page
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 border border-indigo-500/30 space-y-4">
          <h2 className="font-syne font-semibold text-white">Create New Page</h2>

          <div className="grid grid-cols-2 gap-3">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-xl border text-left transition-all ${template === t.id ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
                <p className="text-sm font-dm font-semibold text-white">{t.label}</p>
                <p className="text-xs font-dm text-slate-500 mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">Page Title *</label>
              <input value={title} onChange={e => handleTitleChange(e.target.value)}
                placeholder="My Store"
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">URL Slug *</label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-dm text-slate-500 shrink-0">/store/</span>
                <input value={slug} onChange={e => setSlug(e.target.value.replace(/[^a-z0-9-]/g, ''))}
                  placeholder="my-store"
                  className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm font-dm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-dm font-medium rounded-lg transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Creating…' : 'Create Page'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-dm rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Pages List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-dm text-sm">Loading pages…</div>
      ) : pages.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Store className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-dm text-sm mb-2">No store pages yet.</p>
          <p className="text-slate-600 font-dm text-xs">Create a page to share your products with customers via a link.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map(page => (
            <div key={page.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-white/10 transition-all">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-syne font-semibold text-white text-sm">{page.title}</p>
                <p className="text-xs font-dm text-slate-500 mt-0.5">/store/{page.slug} · {page.visits ?? 0} visits</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-dm font-semibold ${page.published ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'}`}>
                  {page.published ? 'Live' : 'Draft'}
                </span>
                <button onClick={() => handleTogglePublish(page)} title={page.published ? 'Unpublish' : 'Publish'}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleCopy(page)} title="Copy link"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                  {copied === page.id ? <span className="text-[10px] text-emerald-400">✓</span> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <a href={`/store/${page.slug}`} target="_blank" rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => handleDelete(page.id)} className="p-1.5 rounded-lg bg-white/5 hover:text-red-400 text-slate-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
