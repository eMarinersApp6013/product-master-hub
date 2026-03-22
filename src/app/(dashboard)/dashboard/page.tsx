import { auth } from '@clerk/nextjs/server'
import {
  Package,
  TrendingUp,
  IndianRupee,
  ShoppingCart,
  ArrowUpRight,
  Sparkles,
  Globe2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { getDashboardStats } from '@/lib/actions/users'
import { getProducts } from '@/lib/actions/products'

const platformStats = [
  { name: 'Amazon', color: '#FF9900' },
  { name: 'Flipkart', color: '#2874F0' },
  { name: 'Etsy', color: '#F56400' },
  { name: 'Meesho', color: '#9B32B4' },
]

const recentActivity = [
  { action: 'Product synced to Amazon', product: 'Silk Kurta Set – Navy Blue', time: '2 min ago', status: 'success' },
  { action: 'Price updated on Flipkart', product: 'Cotton Blend Saree – Red', time: '15 min ago', status: 'success' },
  { action: 'Image optimization failed', product: 'Embroidered Dupatta', time: '1 hr ago', status: 'error' },
  { action: 'New combo created', product: 'Festival Bundle Pack #12', time: '3 hr ago', status: 'success' },
  { action: 'Meesho listing pending', product: 'Bandhani Print Kurti', time: '5 hr ago', status: 'warning' },
]

export default async function DashboardPage() {
  const { userId } = auth()

  // Fetch real stats + recent products in parallel
  const [stats, { products: recentProducts }] = await Promise.all([
    getDashboardStats(),
    getProducts({ limit: 5 }),
  ])

  // Platform product counts (from the real products list)
  const platformCounts = platformStats.map((p) => {
    const count = recentProducts.filter((prod) => {
      const platforms = Array.isArray(prod.platforms)
        ? prod.platforms
        : typeof prod.platforms === 'string'
        ? JSON.parse(prod.platforms as string)
        : []
      return platforms.includes(p.name)
    }).length
    return { ...p, products: count }
  })

  const statCards = [
    {
      label: 'Total Products',
      value: stats.total_products.toLocaleString('en-IN'),
      change: '+12.5%',
      trend: 'up' as const,
      icon: Package,
      color: '#6366F1',
      bg: 'rgba(99,102,241,0.1)',
    },
    {
      label: 'Catalogue Value',
      value: `₹${Number(stats.total_revenue).toLocaleString('en-IN')}`,
      change: '+8.2%',
      trend: 'up' as const,
      icon: IndianRupee,
      color: '#10B981',
      bg: 'rgba(16,185,129,0.1)',
    },
    {
      label: 'Low Stock Items',
      value: stats.low_stock.toLocaleString('en-IN'),
      change: stats.low_stock > 0 ? `${stats.low_stock} items` : 'All good',
      trend: stats.low_stock > 5 ? 'down' : 'up' as 'up' | 'down',
      icon: ShoppingCart,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.1)',
    },
    {
      label: 'AI Requests Used',
      value: stats.ai_calls_month.toLocaleString('en-IN'),
      change: '+2.4%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: '#EC4899',
      bg: 'rgba(236,72,153,0.1)',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Welcome back! Here&apos;s your store overview.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm text-slate-400 font-dm">Live data</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.bg }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium font-dm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  {stat.change}
                </span>
              </div>
              <p className="font-syne font-bold text-2xl text-white">{stat.value}</p>
              <p className="text-slate-500 text-sm font-dm mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Platform Breakdown */}
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">Platform Breakdown</h2>
          {stats.total_products === 0 ? (
            <p className="text-slate-500 text-sm font-dm">Add products to see platform stats.</p>
          ) : (
            <div className="space-y-4">
              {platformCounts.map((p) => (
                <div key={p.name} className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-dm text-slate-300">{p.name}</span>
                      <span className="text-xs font-dm text-slate-500">{p.products} products</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          backgroundColor: p.color,
                          width: stats.total_products > 0 ? `${(p.products / stats.total_products) * 100}%` : '0%',
                          opacity: 0.8,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="xl:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-syne font-semibold text-white">Recent Products</h2>
            <a href="/products" className="text-xs text-indigo-400 hover:text-indigo-300 font-dm transition-colors">
              View all →
            </a>
          </div>
          {recentProducts.length === 0 ? (
            <div className="py-8 text-center">
              <Package className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm font-dm">No products yet.</p>
              <a href="/products" className="text-xs text-indigo-400 hover:text-indigo-300 font-dm mt-1 inline-block">
                Add your first product →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((product) => {
                const platforms = Array.isArray(product.platforms)
                  ? product.platforms
                  : typeof product.platforms === 'string'
                  ? JSON.parse(product.platforms as string)
                  : []
                return (
                  <div key={product.id} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Package className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-dm text-slate-300 truncate">{product.name}</p>
                      <p className="text-xs font-dm text-slate-500">{product.sku ?? product.category ?? '—'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-dm font-medium text-white">
                        {product.selling_price ? `₹${Number(product.selling_price).toLocaleString('en-IN')}` : '—'}
                      </p>
                      <p className={`text-xs font-dm ${product.stock === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {product.stock === 0 ? 'Out of stock' : `${product.stock} units`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-syne font-semibold text-white">Recent Activity</h2>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-dm transition-colors">View all</button>
        </div>
        <div className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
              <div className="mt-0.5 shrink-0">
                {item.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {item.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-dm text-slate-300">{item.action}</p>
                <p className="text-xs font-dm text-slate-500 truncate">{item.product}</p>
              </div>
              <span className="text-xs font-dm text-slate-600 shrink-0">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'AI Generate Listing', icon: Sparkles, href: '/ai-studio', color: '#6366F1' },
            { label: 'Scrape Product', icon: Globe2, href: '/scraper', color: '#10B981' },
            { label: 'Add Product', icon: Package, href: '/products', color: '#F59E0B' },
            { label: 'Create Combo', icon: Package, href: '/combos', color: '#EC4899' },
          ].map((action) => {
            const Icon = action.icon
            return (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/8 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${action.color}20` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                </div>
                <span className="text-sm font-dm text-slate-300 group-hover:text-white transition-colors leading-tight">
                  {action.label}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
