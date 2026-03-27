'use client'

import { useState, useTransition, useCallback, useEffect } from 'react'
import {
  Search, Filter, Package, Tag, MoreHorizontal, Trash2,
  Edit2, ExternalLink, RefreshCw, ChevronLeft, ChevronRight,
  X, Loader2, CheckCircle2, AlertCircle,
  IndianRupee, Hash, Globe2, Layers,
} from 'lucide-react'
import { getProducts, updateProduct } from '@/lib/actions/products'
import { deleteProduct } from '@/lib/actions/products'
import type { Product } from '@/lib/types'
import { AddProductDialog } from './add-product-dialog'

// ── Edit Dialog ─────────────────────────────────────────────────────────────

const PLATFORMS = ['Amazon', 'Flipkart', 'Etsy', 'Meesho']
const PLATFORM_COLORS_MAP: Record<string, string> = {
  Amazon: '#FF9900', Flipkart: '#2874F0', Etsy: '#F56400', Meesho: '#9B32B4',
}

function EditProductDialog({
  product,
  onClose,
  onSuccess,
  categories,
}: {
  product: Product
  onClose: () => void
  onSuccess: () => void
  categories: string[]
}) {
  const initialPlatforms: string[] = Array.isArray(product.platforms)
    ? product.platforms
    : typeof product.platforms === 'string'
    ? JSON.parse(product.platforms)
    : []

  const [platforms, setPlatforms] = useState<string[]>(initialPlatforms)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const togglePlatform = (p: string) =>
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const get = (k: string) => (fd.get(k) as string)?.trim() || undefined
    const getNum = (k: string) => { const v = get(k); return v ? Number(v) : undefined }

    startTransition(async () => {
      const res = await updateProduct(product.id, {
        name: get('name') ?? product.name,
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
        stock: getNum('stock') ?? product.stock,
        amazon_link: get('amazon_link'),
        flipkart_link: get('flipkart_link'),
        etsy_link: get('etsy_link'),
        meesho_link: get('meesho_link'),
        platforms,
      })
      if (res.success) {
        setResult({ ok: true, msg: 'Product updated successfully!' })
        setTimeout(() => {
          onClose()
          onSuccess()
          setResult(null)
        }, 1000)
      } else {
        setResult({ ok: false, msg: res.error ?? 'Something went wrong.' })
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isPending && onClose()}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0F172A] z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Edit2 className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="font-syne font-bold text-white">Edit Product</h2>
          </div>
          <button
            onClick={() => !isPending && onClose()}
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
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Product Name <span className="text-red-400">*</span></label>
                <input
                  name="name"
                  defaultValue={product.name}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">SKU</label>
                <input
                  name="sku"
                  defaultValue={product.sku ?? ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Category</label>
                <select
                  name="category"
                  defaultValue={product.category ?? ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50 appearance-none"
                >
                  <option value="" className="bg-[#1E293B]">Select category</option>
                  {categories.map((c) => <option key={c} value={c} className="bg-[#1E293B]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Sub-category</label>
                <input
                  name="sub_category"
                  defaultValue={product.sub_category ?? ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={product.description ?? ''}
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
              {([
                ['MRP', 'mrp', product.mrp],
                ['Selling Price', 'selling_price', product.selling_price],
                ['Purchase Price', 'purchase_price', product.purchase_price],
                ['Wholesale Price', 'wholesale_price', product.wholesale_price],
              ] as [string, string, string | null][]).map(([label, name, val]) => (
                <div key={name}>
                  <label className="block text-xs text-slate-500 font-dm mb-1.5">{label}</label>
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 focus-within:border-indigo-500/50 transition-colors pl-3">
                    <span className="text-slate-500 text-sm font-dm shrink-0">₹</span>
                    <input
                      name={name}
                      type="number"
                      step="any"
                      min="0"
                      defaultValue={val ?? ''}
                      className="w-full px-3 py-2.5 bg-transparent text-slate-200 text-sm font-dm focus:outline-none placeholder-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inventory & Shipping */}
          <div>
            <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Inventory & Shipping
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Stock Qty</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product.stock}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Weight (kg)</label>
                <input
                  name="weight"
                  type="number"
                  step="any"
                  min="0"
                  defaultValue={product.weight ?? ''}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-500 font-dm mb-1.5">Dimensions (cm)</label>
                <input
                  name="dimensions"
                  defaultValue={product.dimensions ?? ''}
                  placeholder="30×20×5"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Catalogue & SEO */}
          <div>
            <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Catalogue & SEO
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">HSN Code</label>
                <input
                  name="hsn_code"
                  defaultValue={product.hsn_code ?? ''}
                  placeholder="e.g. 62114290"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 font-dm mb-1.5">SEO Keywords</label>
                <input
                  name="seo_keywords"
                  defaultValue={product.seo_keywords ?? ''}
                  placeholder="silk, kurta, ethnic wear"
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" /> Platform Links
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['Amazon Link', 'amazon_link', product.amazon_link],
                ['Flipkart Link', 'flipkart_link', product.flipkart_link],
                ['Etsy Link', 'etsy_link', product.etsy_link],
                ['Meesho Link', 'meesho_link', product.meesho_link],
              ] as [string, string, string | null][]).map(([label, name, val]) => (
                <div key={name}>
                  <label className="block text-xs text-slate-500 font-dm mb-1.5">{label}</label>
                  <input
                    name={name}
                    defaultValue={val ?? ''}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-sm font-dm focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Listed On */}
          <div>
            <p className="text-xs text-slate-500 font-dm uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Listed On
            </p>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => {
                const active = platforms.includes(p)
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-dm border transition-all ${active ? 'text-white' : 'text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300 bg-white/5'}`}
                    style={active ? { backgroundColor: `${PLATFORM_COLORS_MAP[p]}25`, borderColor: `${PLATFORM_COLORS_MAP[p]}50`, color: PLATFORM_COLORS_MAP[p] } : {}}
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
              onClick={onClose}
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
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Edit2 className="w-4 h-4" />}
              {isPending ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: '#FF9900', Flipkart: '#2874F0', Etsy: '#F56400', Meesho: '#9B32B4',
}

const PAGE_SIZE = 20

type Props = {
  initialProducts: Product[]
  initialTotal: number
}

export function ProductsTable({ initialProducts, initialTotal }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isPending, startTransition] = useTransition()
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.ok ? r.json() : { categories: [] })
      .then(d => setDynamicCategories((d.categories || []).map((c: { name: string }) => c.name)))
      .catch(() => {})
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const fetchProducts = useCallback(
    (s: string, p: string, pg: number) => {
      startTransition(async () => {
        const res = await getProducts({
          search: s,
          platform: p,
          limit: PAGE_SIZE,
          offset: (pg - 1) * PAGE_SIZE,
        })
        setProducts(res.products)
        setTotal(res.total)
      })
    },
    []
  )

  const handleSearch = (val: string) => {
    setSearch(val)
    setPage(1)
    fetchProducts(val, platform, 1)
  }

  const handlePlatform = (val: string) => {
    const next = val === platform ? '' : val
    setPlatform(next)
    setPage(1)
    fetchProducts(search, next, 1)
  }

  const handlePage = (pg: number) => {
    setPage(pg)
    fetchProducts(search, platform, pg)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    setOpenMenu(null)
    await deleteProduct(id)
    fetchProducts(search, platform, page)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Products</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            {isPending ? 'Loading…' : `${total.toLocaleString('en-IN')} products`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchProducts(search, platform, page)}
            className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} />
          </button>
          <AddProductDialog onSuccess={() => fetchProducts(search, platform, page)} />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search products, SKUs…"
            className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All', 'Amazon', 'Flipkart', 'Etsy', 'Meesho'].map((f) => (
            <button
              key={f}
              onClick={() => handlePlatform(f === 'All' ? '' : f)}
              className={`px-3 py-2 text-xs font-dm rounded-lg border transition-colors ${
                (f === 'All' && !platform) || platform === f
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
          {dynamicCategories.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 text-xs font-dm overflow-hidden">
              <Filter className="w-3.5 h-3.5 ml-2.5 shrink-0" />
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-transparent py-2 pr-2.5 focus:outline-none text-slate-400 appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#1E293B]">All Categories</option>
                {dynamicCategories.map(c => (
                  <option key={c} value={c} className="bg-[#1E293B]">{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Category', 'Price', 'Stock', 'Platforms', 'Status', ''].map((h, i) => (
                  <th
                    key={i}
                    className={`text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider ${
                      i === 1 ? 'hidden md:table-cell' : i >= 3 && i <= 4 ? 'hidden lg:table-cell' : ''
                    } ${i === 6 ? 'w-10' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-slate-500 font-dm text-sm">
                      {search || platform ? 'No products match your search.' : 'No products yet. Add your first product!'}
                    </p>
                  </td>
                </tr>
              )}
              {products.map((product) => {
                const price = product.selling_price
                  ? `₹${Number(product.selling_price).toLocaleString('en-IN')}`
                  : '—'
                const outOfStock = product.stock === 0
                const lowStock = product.stock > 0 && product.stock < 10
                const platforms = Array.isArray(product.platforms)
                  ? product.platforms
                  : typeof product.platforms === 'string'
                  ? JSON.parse(product.platforms)
                  : []

                return (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group relative">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="text-sm font-dm text-slate-200 font-medium leading-tight">{product.name}</p>
                          <p className="text-xs font-dm text-slate-600 mt-0.5">{product.sku ?? '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-xs font-dm text-slate-400">
                        <Tag className="w-3 h-3" />
                        {product.category ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-dm font-semibold text-white">{price}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-sm font-dm ${outOfStock ? 'text-red-400' : lowStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {outOfStock ? 'Out of stock' : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex gap-1 flex-wrap">
                        {platforms.length === 0
                          ? <span className="text-xs text-slate-600 font-dm">—</span>
                          : platforms.map((p: string) => (
                            <span
                              key={p}
                              className="text-[10px] font-dm px-1.5 py-0.5 rounded-md"
                              style={{ backgroundColor: `${PLATFORM_COLORS[p] ?? '#6366F1'}18`, color: PLATFORM_COLORS[p] ?? '#6366F1' }}
                            >
                              {p.slice(0, 3)}
                            </span>
                          ))
                        }
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-dm px-2 py-1 rounded-full ${outOfStock ? 'bg-red-400/10 text-red-400' : 'bg-emerald-400/10 text-emerald-400'}`}>
                        {outOfStock ? 'Out of Stock' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-4 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === product.id ? null : product.id)}
                        className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenu === product.id && (
                        <div className="absolute right-4 top-full mt-1 z-50 w-40 rounded-xl bg-[#1E293B] border border-white/10 shadow-xl overflow-hidden">
                          <button
                            onClick={() => { setEditingProduct(product); setOpenMenu(null) }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-300 hover:bg-white/5 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> Edit
                          </button>
                          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-300 hover:bg-white/5 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> View
                          </button>
                          <div className="border-t border-white/5" />
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-red-400 hover:bg-white/5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs font-dm text-slate-500">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total.toLocaleString('en-IN')}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePage(page - 1)}
              disabled={page <= 1 || isPending}
              className="w-7 h-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`w-7 h-7 rounded-md text-xs font-dm transition-colors ${p === page ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:bg-white/5'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => handlePage(page + 1)}
              disabled={page >= totalPages || isPending}
              className="w-7 h-7 rounded-md border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={() => fetchProducts(search, platform, page)}
          categories={dynamicCategories}
        />
      )}
    </div>
  )
}
