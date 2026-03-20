import {
  Store,
  Plus,
  Eye,
  Edit2,
  Globe2,
  ExternalLink,
  BarChart2,
  Smartphone,
  Monitor,
  Layout,
} from 'lucide-react'

const storePages = [
  {
    id: 1,
    name: 'Main Storefront',
    url: 'your-store.productvault.in',
    type: 'Homepage',
    status: 'live',
    visits: 2847,
    conversions: '4.2%',
    template: 'Boutique Dark',
  },
  {
    id: 2,
    name: 'Ethnic Wear Collection',
    url: 'your-store.productvault.in/ethnic',
    type: 'Category Page',
    status: 'live',
    visits: 1234,
    conversions: '5.8%',
    template: 'Gallery Grid',
  },
  {
    id: 3,
    name: 'Festival Sale Landing',
    url: 'your-store.productvault.in/festival',
    type: 'Landing Page',
    status: 'draft',
    visits: 0,
    conversions: '—',
    template: 'Sale Banner',
  },
]

const templates = [
  { name: 'Boutique Dark', category: 'Fashion', preview: '#6366F1' },
  { name: 'Gallery Grid', category: 'Catalog', preview: '#10B981' },
  { name: 'Sale Banner', category: 'Promotions', preview: '#F59E0B' },
  { name: 'Minimal White', category: 'Premium', preview: '#EC4899' },
  { name: 'Indian Festive', category: 'Seasonal', preview: '#EF4444' },
  { name: 'WhatsApp Store', category: 'Social', preview: '#25D366' },
]

export default function StorePagesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Store Pages</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Build and manage your branded online store
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Visits', value: '4,081', icon: BarChart2, color: '#6366F1' },
          { label: 'Avg Conversion', value: '5.0%', icon: Store, color: '#10B981' },
          { label: 'Live Pages', value: '2', icon: Globe2, color: '#F59E0B' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
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

      {/* My Pages */}
      <div>
        <h2 className="font-syne font-semibold text-white mb-3">My Pages</h2>
        <div className="space-y-3">
          {storePages.map((page) => (
            <div
              key={page.id}
              className="glass-card rounded-xl p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Layout className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-dm font-semibold text-white">{page.name}</h3>
                      <span
                        className={`text-[10px] font-dm px-2 py-0.5 rounded-full ${
                          page.status === 'live'
                            ? 'bg-emerald-400/10 text-emerald-400'
                            : 'bg-amber-400/10 text-amber-400'
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>
                    <p className="text-xs font-dm text-slate-500 mt-0.5">{page.type} · {page.template}</p>
                    <p className="text-xs font-dm text-indigo-400 mt-1 flex items-center gap-1">
                      <Globe2 className="w-3 h-3" />
                      {page.url}
                    </p>
                  </div>
                </div>

                {page.status === 'live' && (
                  <div className="flex gap-4 text-right shrink-0">
                    <div>
                      <p className="text-xs font-dm text-slate-500">Visits</p>
                      <p className="font-syne font-bold text-white">{page.visits.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs font-dm text-slate-500">Conv. Rate</p>
                      <p className="font-syne font-bold text-emerald-400">{page.conversions}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white">
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white">
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white">
                  <Monitor className="w-3 h-3" />
                  Desktop
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white">
                  <Smartphone className="w-3 h-3" />
                  Mobile
                </button>
                {page.status === 'live' && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 ml-auto">
                    <ExternalLink className="w-3 h-3" />
                    Open Live
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Templates */}
      <div>
        <h2 className="font-syne font-semibold text-white mb-3">Page Templates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
          {templates.map((t) => (
            <button
              key={t.name}
              className="glass-card rounded-xl overflow-hidden hover:border-white/10 transition-all group text-left"
            >
              <div
                className="h-24 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${t.preview}20, ${t.preview}08)` }}
              >
                <Store className="w-8 h-8 opacity-30" style={{ color: t.preview }} />
              </div>
              <div className="p-3">
                <p className="font-dm font-medium text-slate-300 text-xs">{t.name}</p>
                <p className="font-dm text-slate-600 text-[11px]">{t.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
