import {
  Globe2,
  Search,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader,
  ExternalLink,
  Download,
  Package,
} from 'lucide-react'

const recentScrapes = [
  {
    id: 1,
    url: 'amazon.in/dp/B09XXXXXX1',
    product: 'Silk Blend Kurta Set – Green',
    platform: 'Amazon',
    status: 'completed',
    time: '2 min ago',
    fieldsExtracted: 12,
  },
  {
    id: 2,
    url: 'flipkart.com/p/itm123',
    product: 'Cotton Bandhani Saree',
    platform: 'Flipkart',
    status: 'completed',
    time: '18 min ago',
    fieldsExtracted: 10,
  },
  {
    id: 3,
    url: 'etsy.com/listing/987654',
    product: 'Handmade Beaded Jewelry Set',
    platform: 'Etsy',
    status: 'processing',
    time: 'Just now',
    fieldsExtracted: 0,
  },
  {
    id: 4,
    url: 'meesho.com/product/456',
    product: 'Floral Print Kurti',
    platform: 'Meesho',
    status: 'failed',
    time: '1 hr ago',
    fieldsExtracted: 0,
  },
]

const platformColors: Record<string, string> = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Etsy: '#F56400',
  Meesho: '#9B32B4',
}

export default function ScraperPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Scraper</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">
          Extract product data from any eCommerce platform
        </p>
      </div>

      {/* Main Scraper Input */}
      <div className="glass-card rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Globe2 className="w-5 h-5 text-indigo-400" />
          <h2 className="font-syne font-semibold text-white">New Scrape Job</h2>
        </div>

        <div>
          <label className="block text-xs font-dm text-slate-400 mb-2">
            Product URL(s)
          </label>
          <textarea
            rows={4}
            placeholder="Paste product URLs (one per line)&#10;https://www.amazon.in/dp/B09XXXXX&#10;https://www.flipkart.com/..."
            className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-4 py-3 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Auto-detect Platform
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-dm text-slate-300">Enabled</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Extract Images
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-sm font-dm text-slate-300">Yes (all variants)</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">
              Add to Catalog
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[#1E293B] border border-white/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-dm text-slate-300">After review</span>
            </div>
          </div>
        </div>

        {/* What gets scraped */}
        <div className="bg-white/[0.03] rounded-lg p-4">
          <p className="text-xs font-dm text-slate-400 mb-3 font-medium">Fields extracted:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'Title', 'Description', 'Price', 'MRP', 'Images',
              'Category', 'Brand', 'Keywords', 'Ratings', 'Variants', 'Dimensions', 'Weight',
            ].map((field) => (
              <span
                key={field}
                className="text-[11px] font-dm px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
              >
                {field}
              </span>
            ))}
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
          <Play className="w-4 h-4" />
          Start Scraping
        </button>
      </div>

      {/* Recent Jobs */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-syne font-semibold text-white">Recent Scrape Jobs</h2>
          <button className="text-xs text-indigo-400 hover:text-indigo-300 font-dm">
            View all
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {recentScrapes.map((job) => (
            <div key={job.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] group">
              <div className="shrink-0">
                {job.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {job.status === 'processing' && <Loader className="w-5 h-5 text-indigo-400 animate-spin" />}
                {job.status === 'failed' && <AlertCircle className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-dm px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: `${platformColors[job.platform]}18`,
                      color: platformColors[job.platform],
                    }}
                  >
                    {job.platform}
                  </span>
                  <p className="text-sm font-dm text-slate-300 truncate">{job.product}</p>
                </div>
                <p className="text-xs font-dm text-slate-600 mt-0.5 truncate">{job.url}</p>
              </div>
              <div className="text-right shrink-0">
                {job.status === 'completed' && (
                  <p className="text-xs font-dm text-emerald-400">{job.fieldsExtracted} fields</p>
                )}
                {job.status === 'failed' && (
                  <p className="text-xs font-dm text-red-400">Failed</p>
                )}
                {job.status === 'processing' && (
                  <p className="text-xs font-dm text-indigo-400">Processing…</p>
                )}
                <div className="flex items-center gap-1 text-slate-600 mt-1 justify-end">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-dm">{job.time}</span>
                </div>
              </div>
              {job.status === 'completed' && (
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                    <Package className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
