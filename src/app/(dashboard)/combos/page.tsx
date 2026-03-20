import {
  Layers,
  Plus,
  Package,
  Tag,
  TrendingUp,
  IndianRupee,
  Sparkles,
  Search,
} from 'lucide-react'

const combos = [
  {
    id: 1,
    name: 'Festival Bundle Pack',
    products: ['Silk Kurta Set', 'Embroidered Dupatta', 'Matching Earrings'],
    originalPrice: '₹2,247',
    comboPrice: '₹1,799',
    discount: '20%',
    margin: '38%',
    platforms: ['Amazon', 'Meesho'],
    sales: 234,
  },
  {
    id: 2,
    name: 'Wedding Essentials Kit',
    products: ['Bridal Lehenga', 'Blouse Piece', 'Dupatta', 'Bangles Set'],
    originalPrice: '₹8,996',
    comboPrice: '₹6,999',
    discount: '22%',
    margin: '42%',
    platforms: ['Amazon', 'Flipkart'],
    sales: 87,
  },
  {
    id: 3,
    name: 'Daily Wear Combo',
    products: ['Cotton Kurti', 'Palazzo Pants'],
    originalPrice: '₹1,198',
    comboPrice: '₹999',
    discount: '17%',
    margin: '34%',
    platforms: ['Meesho', 'Flipkart'],
    sales: 456,
  },
]

const platformColors: Record<string, string> = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Etsy: '#F56400',
  Meesho: '#9B32B4',
}

export default function CombosPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Combos</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Create product bundles to increase average order value
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          Create Combo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Active Combos', value: '24', icon: Layers, color: '#6366F1' },
          { label: 'Combo Revenue', value: '₹1,24,500', icon: IndianRupee, color: '#10B981' },
          { label: 'Avg Discount', value: '19.6%', icon: Tag, color: '#F59E0B' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="font-syne font-bold text-xl text-white">{stat.value}</p>
                <p className="font-dm text-slate-500 text-sm">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* AI Suggestion */}
      <div className="glass-card rounded-xl p-5 border border-indigo-500/20 bg-indigo-500/5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4.5 h-4.5 text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="font-dm font-semibold text-indigo-300 text-sm">AI Combo Suggestion</p>
            <p className="font-dm text-slate-400 text-sm mt-1">
              Based on buying patterns, <span className="text-white font-medium">Bandhani Kurti + Palazzo Pants + Dupatta</span> would make a high-converting combo with estimated 28% discount and 36% margin.
            </p>
          </div>
          <button className="px-3 py-1.5 text-xs font-dm rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 transition-colors shrink-0">
            Create this
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search combos..."
          className="w-full max-w-xs bg-[#1E293B] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
        />
      </div>

      {/* Combos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div key={combo.id} className="glass-card rounded-xl p-5 hover:border-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-syne font-semibold text-white">{combo.name}</h3>
                <p className="text-xs font-dm text-slate-500 mt-0.5">
                  {combo.products.length} products · {combo.sales} sold
                </p>
              </div>
              <span className="text-xs font-dm px-2 py-1 rounded-full bg-emerald-400/10 text-emerald-400 shrink-0">
                {combo.discount} off
              </span>
            </div>

            {/* Products list */}
            <div className="space-y-1.5 mb-4">
              {combo.products.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center">
                    <Package className="w-3 h-3 text-slate-600" />
                  </div>
                  <span className="text-xs font-dm text-slate-400">{p}</span>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between py-3 border-t border-white/5">
              <div>
                <p className="text-xs font-dm text-slate-600 line-through">{combo.originalPrice}</p>
                <p className="font-syne font-bold text-lg text-white">{combo.comboPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-dm text-slate-500">Margin</p>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-dm font-semibold text-emerald-400">
                    {combo.margin}
                  </span>
                </div>
              </div>
            </div>

            {/* Platforms & Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1">
                {combo.platforms.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-dm px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${platformColors[p]}18`,
                      color: platformColors[p],
                    }}
                  >
                    {p.slice(0, 3)}
                  </span>
                ))}
              </div>
              <button className="text-xs font-dm text-indigo-400 hover:text-indigo-300 transition-colors">
                Edit →
              </button>
            </div>
          </div>
        ))}

        {/* Add new */}
        <button className="glass-card rounded-xl p-5 hover:border-indigo-500/30 transition-all flex flex-col items-center justify-center gap-3 min-h-[200px] border-dashed">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
            <Plus className="w-6 h-6 text-slate-600" />
          </div>
          <p className="font-dm text-slate-500 text-sm">Create new combo</p>
        </button>
      </div>
    </div>
  )
}
