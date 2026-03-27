'use client'

import { useState, useEffect, useCallback } from 'react'
import { Layers, Plus, Trash2, RefreshCw, Package, Tag, Sparkles } from 'lucide-react'

interface Product { id: number; name: string; sku?: string; selling_price?: number }
interface ComboItem { product_id: number; name: string; qty: number; price: number }
interface Combo { id: number; name: string; description?: string; discount_pct: number; items: ComboItem[]; total_mrp: number; combo_price: number; created_at: string }

export default function CombosPage() {
  const [combos,   setCombos]   = useState<Combo[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [comboName, setComboName]       = useState('')
  const [comboDesc, setComboDesc]       = useState('')
  const [discountPct, setDiscountPct]   = useState(10)
  const [selectedItems, setSelectedItems] = useState<ComboItem[]>([])
  const [saving, setSaving]             = useState(false)
  const [error, setError]               = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [combosRes, prodsRes] = await Promise.all([
        fetch('/api/combos'),
        fetch('/api/products?limit=200'),
      ])
      if (combosRes.ok) { const d = await combosRes.json(); setCombos(d.combos || []) }
      if (prodsRes.ok)  { const d = await prodsRes.json();  setProducts(d.products || []) }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const addItem = (productId: number) => {
    const prod = products.find(p => p.id === productId)
    if (!prod || selectedItems.find(i => i.product_id === productId)) return
    setSelectedItems(prev => [...prev, { product_id: prod.id, name: prod.name, qty: 1, price: prod.selling_price ?? 0 }])
  }

  const removeItem = (productId: number) => setSelectedItems(prev => prev.filter(i => i.product_id !== productId))

  const totalMRP = selectedItems.reduce((s, i) => s + i.price * i.qty, 0)
  const comboPrice = +(totalMRP * (1 - discountPct / 100)).toFixed(2)
  const savings = +(totalMRP - comboPrice).toFixed(2)

  const handleSave = async () => {
    if (!comboName.trim() || selectedItems.length < 2) {
      setError('Enter a combo name and add at least 2 products'); return
    }
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: comboName, description: comboDesc, discount_pct: discountPct, items: selectedItems, total_mrp: totalMRP, combo_price: comboPrice }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Save failed') }
      setShowForm(false); setComboName(''); setComboDesc(''); setSelectedItems([]); setDiscountPct(10)
      load()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this combo?')) return
    await fetch(`/api/combos/${id}`, { method: 'DELETE' })
    setCombos(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Product Combos</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Bundle products to increase average order value</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />New Combo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active Combos',   value: combos.length, color: '#6366F1' },
          { label: 'Avg Discount',    value: combos.length ? `${Math.round(combos.reduce((s,c)=>s+c.discount_pct,0)/combos.length)}%` : '—', color: '#10B981' },
          { label: 'Products in Use', value: new Set(combos.flatMap(c => c.items?.map(i => i.product_id) ?? [])).size, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4" style={{ borderLeft: `3px solid ${s.color}` }}>
            <p className="text-slate-500 text-xs font-dm">{s.label}</p>
            <p className="font-syne font-bold text-xl text-white mt-1">{String(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-5 border border-indigo-500/30 space-y-4">
          <h2 className="font-syne font-semibold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-indigo-400" />Create New Combo</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">Combo Name *</label>
              <input value={comboName} onChange={e => setComboName(e.target.value)}
                placeholder="e.g. Festival Bundle Pack"
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
            </div>
            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">Discount %</label>
              <input type="number" min={0} max={90} value={discountPct} onChange={e => setDiscountPct(Number(e.target.value))}
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Description (optional)</label>
            <input value={comboDesc} onChange={e => setComboDesc(e.target.value)}
              placeholder="Brief combo description…"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Add Products *</label>
            <select onChange={e => addItem(Number(e.target.value))} value=""
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option value="">— Select a product to add —</option>
              {products.filter(p => !selectedItems.find(i => i.product_id === p.id)).map(p => (
                <option key={p.id} value={p.id}>{p.name} {p.selling_price ? `(₹${p.selling_price})` : ''}</option>
              ))}
            </select>
          </div>

          {selectedItems.length > 0 && (
            <div className="space-y-2">
              {selectedItems.map(item => (
                <div key={item.product_id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                  <Package className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="flex-1 text-sm font-dm text-slate-200 truncate">{item.name}</span>
                  <span className="text-sm font-dm text-slate-400">₹{item.price}</span>
                  <button onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-300 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <div className="flex justify-between text-sm font-dm pt-2 border-t border-white/10">
                <span className="text-slate-400">MRP Total: <strong className="text-slate-200">₹{totalMRP.toLocaleString('en-IN')}</strong></span>
                <span className="text-slate-400">Combo Price: <strong className="text-emerald-400">₹{comboPrice.toLocaleString('en-IN')}</strong></span>
                <span className="text-slate-400">Savings: <strong className="text-amber-400">₹{savings.toLocaleString('en-IN')}</strong></span>
              </div>
            </div>
          )}

          {error && <p className="text-red-400 text-sm font-dm">{error}</p>}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-dm font-medium rounded-lg transition-colors">
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save Combo'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-400 text-sm font-dm rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Combo List */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-dm text-sm">Loading combos…</div>
      ) : combos.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Layers className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-dm text-sm">No combos yet. Create your first product bundle!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {combos.map(combo => (
            <div key={combo.id} className="glass-card rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-syne font-semibold text-white text-sm">{combo.name}</h3>
                  {combo.description && <p className="text-xs font-dm text-slate-500 mt-0.5">{combo.description}</p>}
                </div>
                <button onClick={() => handleDelete(combo.id)} className="text-slate-600 hover:text-red-400 transition-colors p-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1 mb-3">
                {(combo.items || []).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-dm text-slate-400">
                    <Package className="w-3 h-3 shrink-0" />{item.name}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-dm text-amber-400">{combo.discount_pct}% off</span>
                </div>
                <div className="text-right">
                  <p className="text-xs font-dm text-slate-500 line-through">₹{Number(combo.total_mrp).toLocaleString('en-IN')}</p>
                  <p className="text-sm font-dm font-bold text-emerald-400">₹{Number(combo.combo_price).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
