import {
  Search,
  Filter,
  Plus,
  Package,
  MoreHorizontal,
  Tag,
  Edit2,
} from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Silk Kurta Set – Navy Blue',
    sku: 'SKU-001-NBL',
    category: 'Ethnic Wear',
    price: '₹1,299',
    stock: 145,
    platforms: ['Amazon', 'Flipkart', 'Meesho'],
    status: 'active',
    image: null,
  },
  {
    id: 2,
    name: 'Cotton Blend Saree – Red Paisley',
    sku: 'SKU-002-REP',
    category: 'Sarees',
    price: '₹899',
    stock: 78,
    platforms: ['Amazon', 'Etsy'],
    status: 'active',
    image: null,
  },
  {
    id: 3,
    name: 'Embroidered Dupatta – Gold',
    sku: 'SKU-003-GLD',
    category: 'Accessories',
    price: '₹449',
    stock: 0,
    platforms: ['Flipkart', 'Meesho'],
    status: 'out_of_stock',
    image: null,
  },
  {
    id: 4,
    name: 'Bandhani Print Kurti – Coral',
    sku: 'SKU-004-CRL',
    category: 'Kurtis',
    price: '₹699',
    stock: 234,
    platforms: ['Amazon', 'Flipkart', 'Meesho'],
    status: 'active',
    image: null,
  },
  {
    id: 5,
    name: 'Handwoven Pashmina Shawl',
    sku: 'SKU-005-PSH',
    category: 'Winterwear',
    price: '₹2,499',
    stock: 32,
    platforms: ['Etsy', 'Amazon'],
    status: 'active',
    image: null,
  },
]

const platformColors: Record<string, string> = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Etsy: '#F56400',
  Meesho: '#9B32B4',
}

export default function ProductsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Products</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            2,847 products across all platforms
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search products, SKUs..."
            className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Amazon', 'Flipkart', 'Etsy', 'Meesho'].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-2 text-xs font-dm rounded-lg border transition-colors ${
                filter === 'All'
                  ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300 hover:bg-white/8'
              }`}
            >
              {filter}
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Stock
                </th>
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Platforms
                </th>
                <th className="text-left px-4 py-3 text-xs font-dm font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                        <Package className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-dm text-slate-200 font-medium leading-tight">
                          {product.name}
                        </p>
                        <p className="text-xs font-dm text-slate-600 mt-0.5">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="flex items-center gap-1.5 text-xs font-dm text-slate-400">
                      <Tag className="w-3 h-3" />
                      {product.category}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-dm font-semibold text-white">
                      {product.price}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <span
                      className={`text-sm font-dm ${
                        product.stock === 0
                          ? 'text-red-400'
                          : product.stock < 50
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell">
                    <div className="flex gap-1">
                      {product.platforms.map((p) => (
                        <span
                          key={p}
                          className="text-[10px] font-dm px-1.5 py-0.5 rounded-md"
                          style={{
                            backgroundColor: `${platformColors[p]}18`,
                            color: platformColors[p],
                          }}
                        >
                          {p.slice(0, 3)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-xs font-dm px-2 py-1 rounded-full ${
                        product.status === 'active'
                          ? 'bg-emerald-400/10 text-emerald-400'
                          : 'bg-red-400/10 text-red-400'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs font-dm text-slate-500">Showing 5 of 2,847 products</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
              Previous
            </button>
            <button className="px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
