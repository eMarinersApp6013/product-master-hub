'use client'

import { useState, useTransition, useCallback } from 'react'
import {
  Search, Filter, Package, Tag, MoreHorizontal, Trash2,
  Edit2, ExternalLink, RefreshCw, ChevronLeft, ChevronRight,
} from 'lucide-react'
import { getProducts } from '@/lib/actions/products'
import { deleteProduct } from '@/lib/actions/products'
import type { Product } from '@/lib/types'
import { AddProductDialog } from './add-product-dialog'

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
  const [page, setPage] = useState(1)
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [isPending, startTransition] = useTransition()

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
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
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
                          <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-300 hover:bg-white/5 transition-colors">
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
    </div>
  )
}
