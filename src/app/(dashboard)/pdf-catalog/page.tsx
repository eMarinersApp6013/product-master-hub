import {
  BookOpen,
  Plus,
  Download,
  Eye,
  Trash2,
  FileText,
  Palette,
  Layout,
  Package,
  Calendar,
} from 'lucide-react'

const catalogs = [
  {
    id: 1,
    name: 'Summer Collection 2024',
    products: 48,
    pages: 24,
    template: 'Premium Grid',
    created: 'Mar 15, 2024',
    status: 'published',
  },
  {
    id: 2,
    name: 'Festive Season Special',
    products: 72,
    pages: 36,
    template: 'Elegant Portrait',
    created: 'Mar 10, 2024',
    status: 'draft',
  },
  {
    id: 3,
    name: 'Wholesale Catalog Q1',
    products: 156,
    pages: 78,
    template: 'Business Classic',
    created: 'Mar 5, 2024',
    status: 'published',
  },
]

const templates = [
  { id: 1, name: 'Premium Grid', desc: 'Modern 3-column layout', color: '#6366F1' },
  { id: 2, name: 'Elegant Portrait', desc: 'Single product showcase', color: '#EC4899' },
  { id: 3, name: 'Business Classic', desc: 'Professional B2B style', color: '#10B981' },
  { id: 4, name: 'Festival Special', desc: 'Colorful festive theme', color: '#F59E0B' },
]

export default function PDFCatalogPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">PDF Catalog</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Create beautiful product catalogs for buyers and distributors
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          New Catalog
        </button>
      </div>

      {/* Templates */}
      <div>
        <h2 className="font-syne font-semibold text-white mb-3">Templates</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              className="glass-card rounded-xl p-4 text-left hover:border-white/10 transition-all group"
            >
              <div
                className="w-full aspect-[4/3] rounded-lg mb-3 flex items-center justify-center"
                style={{ backgroundColor: `${t.color}15` }}
              >
                <Layout className="w-8 h-8" style={{ color: t.color, opacity: 0.6 }} />
              </div>
              <p className="font-dm font-medium text-slate-200 text-sm">{t.name}</p>
              <p className="font-dm text-slate-600 text-xs mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Builder Preview */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-indigo-400" />
          <h2 className="font-syne font-semibold text-white">Quick Build</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Catalog Name</label>
            <input
              type="text"
              placeholder="e.g. Summer Collection 2024"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Select Category</label>
            <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option>All Products</option>
              <option>Ethnic Wear</option>
              <option>Sarees</option>
              <option>Kurtis</option>
              <option>Accessories</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Products per Page</label>
            <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option>2 products</option>
              <option>4 products</option>
              <option>6 products</option>
              <option>9 products</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <FileText className="w-4 h-4" />
            Generate PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 text-sm font-dm rounded-lg transition-colors">
            <Eye className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Existing Catalogs */}
      <div>
        <h2 className="font-syne font-semibold text-white mb-3">My Catalogs</h2>
        <div className="space-y-3">
          {catalogs.map((catalog) => (
            <div
              key={catalog.id}
              className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-white/10 transition-all group"
            >
              <div className="w-12 h-14 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-dm font-semibold text-slate-200">{catalog.name}</p>
                  <span
                    className={`text-[10px] font-dm px-2 py-0.5 rounded-full ${
                      catalog.status === 'published'
                        ? 'bg-emerald-400/10 text-emerald-400'
                        : 'bg-amber-400/10 text-amber-400'
                    }`}
                  >
                    {catalog.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs font-dm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {catalog.products} products
                  </span>
                  <span>{catalog.pages} pages</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {catalog.created}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20">
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
