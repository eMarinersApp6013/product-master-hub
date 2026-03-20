import {
  Sparkles,
  Copy,
  RefreshCw,
  ChevronDown,
  Zap,
  FileText,
  Tag,
  Search,
  MessageSquare,
} from 'lucide-react'

const aiTools = [
  {
    id: 'listing',
    label: 'Product Listing Generator',
    desc: 'AI-crafted titles, bullets, and descriptions optimized for each platform',
    icon: FileText,
    color: '#6366F1',
    badge: 'Most Used',
  },
  {
    id: 'keywords',
    label: 'Keyword Research',
    desc: 'Find high-converting search terms for Indian buyers',
    icon: Search,
    color: '#10B981',
    badge: null,
  },
  {
    id: 'tags',
    label: 'Tag & Category Optimizer',
    desc: 'Smart tags for Etsy, Meesho, Amazon & Flipkart categories',
    icon: Tag,
    color: '#F59E0B',
    badge: null,
  },
  {
    id: 'review',
    label: 'Review Response Writer',
    desc: 'Generate professional responses to customer reviews',
    icon: MessageSquare,
    color: '#EC4899',
    badge: 'New',
  },
]

const sampleOutput = `✅ Title (Amazon):
Silk Blend Kurta Set for Women | Navy Blue Ethnic Wear | Traditional Indian Dress | Regular Fit | XS-3XL

✅ Bullet Points:
• PREMIUM SILK BLEND FABRIC – Luxurious soft-touch material that drapes beautifully, perfect for festive occasions and daily wear
• TRADITIONAL DESIGN – Classic Navy Blue with intricate embroidery work, showcasing authentic Indian craftsmanship
• REGULAR FIT – Relaxed silhouette suitable for all body types; available in sizes XS to 3XL
• COMPLETE SET – Includes matching kurta, palazzo pants, and dupatta – ready to wear right out of the box
• EASY CARE – Machine washable fabric; colors stay vibrant even after multiple washes

✅ Description:
Embrace the elegance of Indian fashion with our Silk Blend Kurta Set in classic Navy Blue. Crafted for the modern Indian woman who values both tradition and comfort...`

export default function AIStudioPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">AI Studio</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Generate optimized product content with AI
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
          <Zap className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-dm text-indigo-300">240 credits remaining</span>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.id}
              className={`glass-card rounded-xl p-5 text-left hover:border-white/10 transition-all group relative ${
                tool.id === 'listing' ? 'ring-1 ring-indigo-500/30' : ''
              }`}
            >
              {tool.badge && (
                <span
                  className={`absolute top-3 right-3 text-[10px] font-dm px-2 py-0.5 rounded-full ${
                    tool.badge === 'New'
                      ? 'bg-emerald-400/10 text-emerald-400'
                      : 'bg-indigo-400/10 text-indigo-400'
                  }`}
                >
                  {tool.badge}
                </span>
              )}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${tool.color}18` }}
              >
                <Icon className="w-5 h-5" style={{ color: tool.color }} />
              </div>
              <p className="font-syne font-semibold text-white text-sm leading-tight">
                {tool.label}
              </p>
              <p className="font-dm text-slate-500 text-xs mt-2 leading-relaxed">{tool.desc}</p>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h2 className="font-syne font-semibold text-white">Product Listing Generator</h2>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Target Platform
            </label>
            <div className="relative">
              <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50 appearance-none">
                <option>Amazon India</option>
                <option>Flipkart</option>
                <option>Etsy</option>
                <option>Meesho</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Product Name / Brief Description
            </label>
            <input
              type="text"
              placeholder="e.g. Silk Blend Kurta Set, Navy Blue, Women's Ethnic Wear"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Key Features (one per line)
            </label>
            <textarea
              rows={4}
              placeholder="Silk blend fabric&#10;Navy blue color&#10;Traditional embroidery&#10;Includes kurta, palazzo, dupatta"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Tone</label>
            <div className="flex gap-2">
              {['Professional', 'Festive', 'Casual', 'Luxury'].map((tone) => (
                <button
                  key={tone}
                  className={`px-3 py-1.5 text-xs font-dm rounded-lg border transition-colors ${
                    tone === 'Professional'
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <Sparkles className="w-4 h-4" />
            Generate Listing
          </button>
        </div>

        {/* Output Panel */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-syne font-semibold text-white">Generated Output</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300">
                <Copy className="w-3 h-3" />
                Copy All
              </button>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-lg p-4 h-[380px] overflow-y-auto">
            <pre className="text-xs font-dm text-slate-300 whitespace-pre-wrap leading-relaxed">
              {sampleOutput}
            </pre>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs font-dm text-slate-500">
              <span>2 credits used</span>
              <span>•</span>
              <span>Score: 94/100</span>
            </div>
            <button className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-dm rounded-lg hover:bg-emerald-500/30 transition-colors">
              Apply to Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
