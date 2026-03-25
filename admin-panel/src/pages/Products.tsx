import { useState } from 'react'
import { Search, Package, Tag, MoreHorizontal, ExternalLink, Eye } from 'lucide-react'
import { USERS } from '../lib/data'

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: '#FF9900', Flipkart: '#2874F0', Etsy: '#F56400', Meesho: '#9B32B4',
}

type Product = {
  id: number
  name: string
  sku: string
  owner: string
  ownerPlan: string
  category: string
  price: number
  stock: number
  platforms: string[]
}

const PRODUCTS: Product[] = [
  { id: 1,  name: 'Silk Kurta Set – Navy Blue',        sku: 'SKU-001', owner: 'Vikram Singh',  ownerPlan: 'Enterprise', category: 'Ethnic Wear',  price: 1299, stock: 145, platforms: ['Amazon','Flipkart','Meesho'] },
  { id: 2,  name: 'Cotton Blend Saree – Red Paisley',  sku: 'SKU-002', owner: 'Priya Sharma',  ownerPlan: 'Pro',        category: 'Sarees',       price: 899,  stock: 78,  platforms: ['Amazon','Etsy'] },
  { id: 3,  name: 'Embroidered Dupatta – Gold',        sku: 'SKU-003', owner: 'Arjun Nair',    ownerPlan: 'Enterprise', category: 'Accessories',  price: 449,  stock: 0,   platforms: ['Flipkart','Meesho'] },
  { id: 4,  name: 'Bandhani Print Kurti – Coral',      sku: 'SKU-004', owner: 'Karan Mehta',   ownerPlan: 'Pro',        category: 'Kurtis',       price: 699,  stock: 234, platforms: ['Amazon','Flipkart','Meesho'] },
  { id: 5,  name: 'Handwoven Pashmina Shawl',          sku: 'SKU-005', owner: 'Arjun Nair',    ownerPlan: 'Enterprise', category: 'Winterwear',   price: 2499, stock: 32,  platforms: ['Etsy','Amazon'] },
  { id: 6,  name: 'Block Print Bedsheet Set',          sku: 'SKU-006', owner: 'Vikram Singh',  ownerPlan: 'Enterprise', category: 'Home Decor',   price: 1799, stock: 89,  platforms: ['Amazon','Flipkart'] },
  { id: 7,  name: 'Jute Tote Bag – Natural',           sku: 'SKU-007', owner: 'Meena Iyer',    ownerPlan: 'Pro',        category: 'Accessories',  price: 349,  stock: 412, platforms: ['Etsy','Meesho'] },
  { id: 8,  name: 'Chikankari Anarkali Suit',          sku: 'SKU-008', owner: 'Arjun Nair',    ownerPlan: 'Enterprise', category: 'Ethnic Wear',  price: 1599, stock: 63,  platforms: ['Amazon','Flipkart','Etsy'] },
  { id: 9,  name: 'Copper Water Bottle – 1L',          sku: 'SKU-009', owner: 'Vikram Singh',  ownerPlan: 'Enterprise', category: 'Home Decor',   price: 599,  stock: 178, platforms: ['Amazon','Flipkart','Meesho'] },
  { id: 10, name: 'Silver Anklet – Traditional',       sku: 'SKU-010', owner: 'Meena Iyer',    ownerPlan: 'Pro',        category: 'Jewellery',    price: 799,  stock: 56,  platforms: ['Etsy','Amazon'] },
  { id: 11, name: 'Terracotta Planter Set',            sku: 'SKU-011', owner: 'Karan Mehta',   ownerPlan: 'Pro',        category: 'Home Decor',   price: 449,  stock: 291, platforms: ['Amazon','Etsy','Meesho'] },
  { id: 12, name: 'Kashmiri Salwar Kameez',            sku: 'SKU-012', owner: 'Arjun Nair',    ownerPlan: 'Enterprise', category: 'Ethnic Wear',  price: 2199, stock: 0,   platforms: ['Amazon','Etsy'] },
]

const PLAN_COLOR: Record<string, string> = {
  Free: 'text-slate-400', Starter: 'text-indigo-400', Pro: 'text-emerald-400', Enterprise: 'text-amber-400',
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [menu, setMenu] = useState<number | null>(null)

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map((p) => p.category))).sort()]

  const filtered = PRODUCTS.filter((p) => {
    const q = search.toLowerCase()
    return (
      (p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.owner.toLowerCase().includes(q)) &&
      (categoryFilter === 'All' || p.category === categoryFilter)
    )
  })

  const totalProducts = PRODUCTS.length
  const outOfStock = PRODUCTS.filter((p) => p.stock === 0).length
  const totalUsers = new Set(PRODUCTS.map((p) => p.owner)).size

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Products</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">All products across the platform (read-only view)</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', val: totalProducts.toLocaleString('en-IN'), color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Sellers',        val: totalUsers.toString(),                 color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Out of Stock',   val: outOfStock.toString(),                 color: 'text-red-400',    bg: 'bg-red-500/10'    },
          { label: 'Avg Price',      val: `₹${Math.round(PRODUCTS.reduce((s, p) => s + p.price, 0) / PRODUCTS.length).toLocaleString('en-IN')}`, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} className={`glass rounded-xl p-4 flex flex-col`}>
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2`}>
              <Package className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`font-syne font-bold text-xl ${color}`}>{val}</p>
            <p className="text-xs text-slate-500 font-dm">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, SKUs, owners…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors" />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none appearance-none">
          {categories.map((c) => <option key={c} value={c} className="bg-[#1E293B]">{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Product', 'Owner', 'Category', 'Price', 'Stock', 'Platforms', ''].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-left text-xs font-dm text-slate-500 uppercase tracking-wider ${i >= 2 && i <= 4 ? 'hidden md:table-cell' : ''} ${i === 5 ? 'hidden lg:table-cell' : ''} ${i === 6 ? 'w-10' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-dm text-slate-200 font-medium truncate max-w-[180px]">{p.name}</p>
                        <p className="text-xs font-dm text-slate-600">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className={`text-sm font-dm font-medium ${PLAN_COLOR[p.ownerPlan]}`}>{p.owner}</p>
                    <p className="text-[10px] font-dm text-slate-600">{p.ownerPlan}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-xs font-dm text-slate-400"><Tag className="w-3 h-3" />{p.category}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-syne font-bold text-white">₹{p.price.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className={`text-sm font-dm ${p.stock === 0 ? 'text-red-400' : p.stock < 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} units`}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {p.platforms.map((pl) => (
                        <span key={pl} className="text-[10px] font-dm px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${PLATFORM_COLORS[pl]}18`, color: PLATFORM_COLORS[pl] }}>
                          {pl.slice(0,3)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 relative">
                    <button onClick={() => setMenu(menu === p.id ? null : p.id)}
                      className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all ml-auto">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menu === p.id && (
                      <div className="absolute right-4 top-full mt-1 z-50 w-40 rounded-xl bg-[#1E293B] border border-white/10 shadow-xl overflow-hidden">
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-300 hover:bg-white/5">
                          <Eye className="w-3.5 h-3.5 text-indigo-400" /> View Details
                        </button>
                        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-dm text-slate-300 hover:bg-white/5">
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" /> Open Listing
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 font-dm text-sm">No products found.</p>
          </div>
        )}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-600 font-dm">Showing {filtered.length} of {totalProducts} products</p>
        </div>
      </div>
    </div>
  )
}
