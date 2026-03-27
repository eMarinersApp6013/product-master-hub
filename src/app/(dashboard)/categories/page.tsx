'use client'

import { useState, useEffect } from 'react'
import { Tag, Plus, Trash2, X, FolderOpen } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  color: string
  description?: string
  product_count: number
  created_at: string
}

const COLORS = ['#6366F1','#10B981','#F59E0B','#EF4444','#EC4899','#8B5CF6','#14B8A6','#F97316']

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366F1')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const r = await fetch('/api/categories')
      if (r.ok) { const d = await r.json(); setCats(d.categories || []) }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    const r = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), color, description: desc }),
    })
    if (r.ok) {
      setShowAdd(false); setName(''); setDesc(''); setColor('#6366F1')
      await load()
    } else {
      const d = await r.json(); setError(d.error || 'Failed to create')
    }
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this category?')) return
    await fetch('/api/categories', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setCats(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Categories</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Organize your products by category</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 font-dm text-sm">Loading…</div>
      ) : cats.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-300 font-dm font-medium text-lg">No categories yet</p>
          <p className="text-slate-500 font-dm text-sm mt-2 mb-5">Add your first category to organize products</p>
          <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm rounded-lg transition-colors">
            <Plus className="w-4 h-4" />Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {cats.map(cat => (
            <div key={cat.id} className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${cat.color}25` }}>
                    <Tag className="w-5 h-5" style={{ color: cat.color }} />
                  </div>
                  <div>
                    <p className="font-syne font-bold text-white text-base">{cat.name}</p>
                    <p className="text-xs font-dm" style={{ color: cat.color }}>{cat.product_count} products</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(cat.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {cat.description && <p className="text-xs font-dm text-slate-500 leading-relaxed">{cat.description}</p>}
              <div className="mt-auto pt-2 border-t border-white/5">
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, cat.product_count * 10)}%`, backgroundColor: cat.color }} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAdd(true)} className="glass-card rounded-xl p-5 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer min-h-[140px]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-sm font-dm text-slate-400">Add category</p>
          </button>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md glass-card rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-syne font-bold text-white text-lg">New Category</h2>
              <button onClick={() => { setShowAdd(false); setError('') }} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">Category Name *</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Electronics, Clothing, Home Decor" className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50" />
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-2">Color</label>
                <div className="flex gap-2">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setColor(c)} className="w-7 h-7 rounded-full border-2 transition-all" style={{ backgroundColor: c, borderColor: color === c ? 'white' : 'transparent' }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">Description (optional)</label>
                <textarea rows={2} value={desc} onChange={e => setDesc(e.target.value)} placeholder="Brief description of this category" className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50 resize-none" />
              </div>
              {error && <p className="text-red-400 text-xs font-dm">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowAdd(false); setError('') }} className="flex-1 py-2.5 border border-white/10 text-slate-400 text-sm font-dm rounded-lg hover:bg-white/5 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm rounded-lg transition-colors disabled:opacity-60">{saving ? 'Creating…' : 'Create Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
