import {
  Upload,
  Search,
  Grid3X3,
  List,
  Image as ImageIcon,
  Wand2,
  Download,
  Trash2,
  Plus,
} from 'lucide-react'

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `product-image-${String(i + 1).padStart(3, '0')}.jpg`,
  product: ['Silk Kurta Set', 'Cotton Saree', 'Embroidered Dupatta', 'Bandhani Kurti'][i % 4],
  size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
  dimensions: ['1000×1000', '2000×2000', '800×1200', '1500×1500'][i % 4],
  optimized: i % 3 !== 0,
}))

export default function ImagesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Images</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Manage and optimize your product images
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Upload className="w-4 h-4" />
          Upload Images
        </button>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/30 rounded-xl p-8 text-center transition-colors cursor-pointer group">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-indigo-500/20 transition-colors">
          <Upload className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="font-dm text-slate-300 font-medium">Drop images here or click to upload</p>
        <p className="font-dm text-slate-600 text-sm mt-1">
          Supports JPG, PNG, WebP up to 10MB each
        </p>
      </div>

      {/* AI Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: 'Remove Background',
            desc: 'AI-powered background removal for all platforms',
            color: '#6366F1',
            icon: Wand2,
          },
          {
            label: 'Bulk Optimize',
            desc: 'Resize and compress for Amazon, Flipkart standards',
            color: '#10B981',
            icon: Grid3X3,
          },
          {
            label: 'Generate Variants',
            desc: 'Create color/angle variants using AI',
            color: '#F59E0B',
            icon: ImageIcon,
          },
        ].map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.label}
              className="glass-card rounded-xl p-4 text-left hover:border-white/10 transition-all group"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${tool.color}20` }}
              >
                <Icon className="w-4.5 h-4.5" style={{ color: tool.color }} />
              </div>
              <p className="font-dm font-semibold text-slate-200 text-sm">{tool.label}</p>
              <p className="font-dm text-slate-500 text-xs mt-1 leading-relaxed">{tool.desc}</p>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search images..."
            className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-500 hover:text-slate-300">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {images.map((img) => (
          <div
            key={img.id}
            className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-white/10 transition-all"
          >
            {/* Image Placeholder */}
            <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative">
              <ImageIcon className="w-8 h-8 text-slate-700" />
              {!img.optimized && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-red-400 hover:bg-black/70">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-2">
              <p className="text-[11px] font-dm text-slate-400 truncate">{img.product}</p>
              <p className="text-[10px] font-dm text-slate-600">{img.dimensions} · {img.size}</p>
            </div>
          </div>
        ))}

        {/* Add More */}
        <button className="glass-card rounded-xl overflow-hidden hover:border-white/10 transition-all">
          <div className="aspect-square flex items-center justify-center flex-col gap-2">
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Plus className="w-5 h-5 text-slate-600" />
            </div>
            <p className="text-[11px] font-dm text-slate-600">Upload more</p>
          </div>
        </button>
      </div>
    </div>
  )
}
