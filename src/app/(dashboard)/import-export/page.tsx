import {
  ArrowLeftRight,
  Upload,
  Download,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'

const recentJobs = [
  {
    id: 1,
    type: 'import',
    format: 'Excel',
    file: 'products_batch_march.xlsx',
    records: 234,
    status: 'completed',
    time: '10 min ago',
  },
  {
    id: 2,
    type: 'export',
    format: 'CSV',
    file: 'amazon_export_20240315.csv',
    records: 1204,
    status: 'completed',
    time: '1 hr ago',
  },
  {
    id: 3,
    type: 'import',
    format: 'JSON',
    file: 'flipkart_products.json',
    records: 0,
    status: 'processing',
    time: 'Just now',
  },
  {
    id: 4,
    type: 'export',
    format: 'Excel',
    file: 'all_products_backup.xlsx',
    records: 2847,
    status: 'failed',
    time: '3 hr ago',
  },
]

export default function ImportExportPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Import / Export</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">
          Bulk import and export product data across all platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <Upload className="w-4 h-4 text-emerald-400" />
            </div>
            <h2 className="font-syne font-semibold text-white">Import Products</h2>
          </div>

          {/* Drop zone */}
          <div className="border-2 border-dashed border-white/10 hover:border-emerald-500/30 rounded-xl p-6 text-center transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="font-dm text-slate-400 text-sm">Drop your file here</p>
            <p className="font-dm text-slate-600 text-xs mt-1">Excel, CSV, JSON, XML supported</p>
          </div>

          {/* Format options */}
          <div>
            <p className="text-xs font-dm text-slate-400 mb-2">Supported Formats</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: FileSpreadsheet, label: 'Excel (.xlsx, .xls)', color: '#10B981' },
                { icon: FileSpreadsheet, label: 'CSV (.csv)', color: '#6366F1' },
                { icon: FileJson, label: 'JSON (.json)', color: '#F59E0B' },
                { icon: FileSpreadsheet, label: 'XML (.xml)', color: '#EC4899' },
              ].map((fmt) => {
                const Icon = fmt.icon
                return (
                  <div
                    key={fmt.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5"
                  >
                    <Icon className="w-4 h-4" style={{ color: fmt.color }} />
                    <span className="text-xs font-dm text-slate-400">{fmt.label}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Map to Platform</label>
            <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option>ProductVault (all platforms)</option>
              <option>Amazon India format</option>
              <option>Flipkart format</option>
              <option>Etsy format</option>
              <option>Meesho format</option>
            </select>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <Upload className="w-4 h-4" />
            Import Products
          </button>

          <a
            href="#"
            className="block text-center text-xs font-dm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Download import template →
          </a>
        </div>

        {/* Export */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <Download className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="font-syne font-semibold text-white">Export Products</h2>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {['Excel', 'CSV', 'JSON'].map((fmt) => (
                <button
                  key={fmt}
                  className={`py-2 text-sm font-dm rounded-lg border transition-colors ${
                    fmt === 'Excel'
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Platform Format</label>
            <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option>All Products (ProductVault)</option>
              <option>Amazon Flat File</option>
              <option>Flipkart Template</option>
              <option>Etsy CSV</option>
              <option>Meesho Catalog</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Filter by Category</label>
            <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
              <option>All Categories (2,847 products)</option>
              <option>Ethnic Wear (845)</option>
              <option>Sarees (612)</option>
              <option>Kurtis (534)</option>
              <option>Accessories (412)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-2">Include Fields</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Title', 'Description', 'Price', 'Images', 'Keywords', 'Variants', 'Stock', 'Dimensions'].map((field) => (
                <label key={field} className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-4 h-4 rounded border border-indigo-500/50 bg-indigo-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-xs font-dm text-slate-400 group-hover:text-slate-300">{field}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export Products
          </button>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-syne font-semibold text-white">Recent Jobs</h2>
          <button className="flex items-center gap-1.5 text-xs font-dm text-slate-500 hover:text-slate-300">
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {recentJobs.map((job) => (
            <div key={job.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="shrink-0">
                {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {job.status === 'processing' && <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />}
                {job.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div
                className={`w-14 py-0.5 text-center text-[10px] font-dm rounded-full shrink-0 ${
                  job.type === 'import'
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-indigo-400/10 text-indigo-400'
                }`}
              >
                {job.type === 'import' ? '↑ Import' : '↓ Export'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-dm text-slate-300 truncate">{job.file}</p>
                {job.records > 0 && (
                  <p className="text-xs font-dm text-slate-600">{job.records.toLocaleString()} records · {job.format}</p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-dm text-slate-600 shrink-0">
                <Clock className="w-3 h-3" />
                {job.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
