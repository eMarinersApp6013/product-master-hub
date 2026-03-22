'use client'

import { useState, useTransition } from 'react'
import {
  X, Package, Plus, Loader2, CheckCircle2, AlertCircle,
  IndianRupee, Tag, Hash, Weight, Layers, Globe2,
} from 'lucide-react'
import { createProduct, type CreateProductInput } from '@/lib/actions/products'

const PLATFORMS = ['Amazon', 'Flipkart', 'Etsy', 'Meesho']
const CATEGORIES = [
  'Ethnic Wear', 'Sarees', 'Kurtis', 'Accessories', 'Winterwear',
  'Footwear', 'Jewellery', 'Home Decor', 'Electronics', 'Other',
]

function Field({
  label, name, type = 'text', placeholder, required, prefix, className = '',
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  prefix?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-slate-500 font-dm mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className={`flex items-center rounded-xl border border-white/10 bg-white/5 focus-within:border-indigo-500/50 transition-colors ${prefix ? 'pl-3' : ''}`}>
        {prefix && <span className="text-slate-500 text-sm font-dm shrink-0">{prefix}</span>}
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          step={type === 'number' ? 'any' : undefined}
          min={type === 'number' ? '0' : undefined}
          className="w-full px-3 py-2.5 bg-transparent text-slate-200 text-sm font-dm focus:outline-none placeholder-slate-600"
        />
      </div>
    </div>
  )
}

export function AddProductDialog({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false)
  const [platforms, setPlatforms] = useState<string[]>([])
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => (fd.get(k) as string)?.trim() || undefined
    const getNum = (k: string) => { const v = get(k); return v ? Number(v) : undefined }

    const input: CreateProductInput = {
      name: get('name')!,
      description: get('description'),
      sku: get('sku'),
      category: get('category'),
      sub_category: get('sub_category'),
      mrp: getNum('mrp'),
      selling_price: getNum('selling_price'),
      purchase_price: getNum('purchase_price'),
      wholesale_price: getNum('wholesale_price'),
      weight: getNum('weight'),
      dimensions: get('dimensions'),
      seo_keywords: get('seo_keywords'),
      hsn_code: get('hsn_code'),
      stock: getNum('stock') ?? 0,
      amazon_link: get('amazon_link'),
      flipkart_link: get('flipkart_link'),
      etsy_link: get('etsy_link'),
      meesho_link: get('meesho_link'),
      platforms,
    }

    startTransition(async () => {
      const res = await createProduct(input)
      if (res.success) {
        setResult({ ok: true, msg: 'Product added successfully!' })
        setTimeout(() => {
          setOpen(false)
          setResult(null)
          setPlatforms([])
          onSuccess?.()
        }, 1200)
      } else {
        setResult({ ok: false, msg: res.error ?? 'Something went wrong.' })
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Product
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isPending && setOpen(false)}
          />

          {/* Dialog */}
          <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0F172A] z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <h2 className="font-syne font-bold text-white">Add New Product</h2>
              </div>
              <button
                onClick={() => !isPending && setOpen(false)}
                className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" /> Basic Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Product Name" name="name" placeholder="e.g. Silk Kurta Set" required className="sm:col-span-2" />
                  <Field label="SKU" name="sku" placeholder="e.g. SKU-001-BLU" />
                  <div>
                    <label className="block text-xs text-slate-500 font-dm mb-1.5">Category</label>
                    <select
                      name="category"
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 appearance-none"
                    >
                      <option value="" className="bg-[#1E293B]">Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#1E293B]">{c}</option>)}
                    </select>
                  </div>
                  <Field label="Sub-category" name="sub_category" placeholder="e.g. Kurtas" />
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-500 font-dm mb-1.5">Description</label>
                    <textarea
                      name="description"
                      rows={3}
                      placeholder="Product description..."
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 placeholder-slate-600 resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" /> Pricing
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="MRP" name="mrp" type="number" placeholder="0.00" prefix="₹" />
                  <Field label="Selling Price" name="selling_price" type="number" placeholder="0.00" prefix="₹" />
                  <Field label="Purchase Price" name="purchase_price" type="number" placeholder="0.00" prefix="₹" />
                  <Field label="Wholesale Price" name="wholesale_price" type="number" placeholder="0.00" prefix="₹" />
                </div>
              </div>

              {/* Inventory & Shipping */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Inventory & Shipping
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Field label="Stock Qty" name="stock" type="number" placeholder="0" />
                  <Field label="Weight (kg)" name="weight" type="number" placeholder="0.500" />
                  <Field label="Dimensions (cm)" name="dimensions" placeholder="30×20×5" className="sm:col-span-2" />
                </div>
              </div>

              {/* Catalogue Fields */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" /> Catalogue & SEO
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="HSN Code" name="hsn_code" placeholder="e.g. 62114290" />
                  <Field label="SEO Keywords" name="seo_keywords" placeholder="silk, kurta, ethnic wear" />
                </div>
              </div>

              {/* Platform Links */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5" /> Platform Links
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Amazon Link" name="amazon_link" placeholder="https://amazon.in/..." />
                  <Field label="Flipkart Link" name="flipkart_link" placeholder="https://flipkart.com/..." />
                  <Field label="Etsy Link" name="etsy_link" placeholder="https://etsy.com/..." />
                  <Field label="Meesho Link" name="meesho_link" placeholder="https://meesho.com/..." />
                </div>
              </div>

              {/* Platforms */}
              <div>
                <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" /> Listed On
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => {
                    const colors: Record<string, string> = {
                      Amazon: '#FF9900', Flipkart: '#2874F0', Etsy: '#F56400', Meesho: '#9B32B4',
                    }
                    const active = platforms.includes(p)
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-dm border transition-all ${active ? 'text-white' : 'text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300 bg-white/5'}`}
                        style={active ? { backgroundColor: `${colors[p]}25`, borderColor: `${colors[p]}50`, color: colors[p] } : {}}
                      >
                        {active && '✓ '}{p}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Result banner */}
              {result && (
                <div className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-sm font-dm ${result.ok ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                  {result.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  {result.msg}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="px-4 py-2.5 text-sm font-dm text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white text-sm font-dm font-medium rounded-lg transition-colors"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isPending ? 'Saving…' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
