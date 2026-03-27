'use client'

import { useState, useCallback } from 'react'
import { Globe2, Search, CheckCircle2, XCircle, Clock, RefreshCw, Plus } from 'lucide-react'

interface ScrapeResult {
  id: string; url: string; status: 'success' | 'error' | 'pending'
  product?: Record<string, unknown>; platform?: string; timestamp: string; error?: string
}

function detectPlatform(u: string) {
  if (u.includes('amazon')) return 'Amazon'
  if (u.includes('flipkart')) return 'Flipkart'
  if (u.includes('meesho')) return 'Meesho'
  if (u.includes('etsy')) return 'Etsy'
  return 'Web'
}

export default function ScraperPage() {
  const [url, setUrl]         = useState('')
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs]       = useState<ScrapeResult[]>([])
  const [result, setResult]   = useState<Record<string, unknown> | null>(null)
  const [error, setError]     = useState('')
  const [added, setAdded]     = useState(false)

  const handleScrape = useCallback(async () => {
    if (!url.trim()) return
    setLoading(true); setError(''); setResult(null); setAdded(false)

    const jobId = Date.now().toString()
    setJobs(prev => [{ id: jobId, url, status: 'pending', platform: detectPlatform(url), timestamp: new Date().toISOString() }, ...prev.slice(0, 9)])

    try {
      const res  = await fetch('/api/scraper', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Scrape failed')
      setResult(data.product)
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'success', product: data.product } : j))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Scrape failed'
      setError(msg)
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'error', error: msg } : j))
    } finally {
      setLoading(false)
    }
  }, [url])

  const handleAdd = async () => {
    if (!result) return
    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(result) })
    if (res.ok) { setAdded(true) } else { const d = await res.json(); alert(d.error || 'Failed') }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Product Scraper</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">Extract product data from Amazon, Flipkart, Meesho & Etsy via AI</p>
      </div>

      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="font-syne font-semibold text-white">Paste Product URL</h2>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input type="url" value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScrape()}
              placeholder="https://www.amazon.in/dp/…  or  flipkart.com/…"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
          </div>
          <button onClick={handleScrape} disabled={loading || !url.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-dm font-medium rounded-lg transition-colors">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Scraping…' : 'Scrape'}
          </button>
        </div>
        {error && <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-dm"><XCircle className="w-4 h-4 shrink-0" />{error}</div>}
      </div>

      {result && (
        <div className="glass-card rounded-xl p-5 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-syne font-semibold text-white flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" />Scraped Product</h2>
            {!added
              ? <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-dm font-medium rounded-lg transition-colors"><Plus className="w-4 h-4" />Add to Catalog</button>
              : <span className="text-emerald-400 text-sm font-dm flex items-center gap-1"><CheckCircle2 className="w-4 h-4" />Added!</span>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.entries(result) as [string, unknown][]).filter(([, v]) => v !== null && v !== undefined && typeof v !== 'object').map(([k, v]) => (
              <div key={k} className="bg-white/5 rounded-lg p-3">
                <p className="text-xs font-dm text-slate-500 capitalize mb-1">{k.replace(/_/g,' ')}</p>
                <p className="text-sm font-dm text-slate-200 truncate">{String(v)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {jobs.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">Recent Scrapes</h2>
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                {job.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {job.status === 'error'   && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                {job.status === 'pending' && <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-300 truncate">{(job.product?.name as string) || job.url}</p>
                  <p className="text-xs font-dm text-slate-500">{job.platform} · {job.error || 'completed'}</p>
                </div>
                <span className="text-xs font-dm text-slate-600 shrink-0">{new Date(job.timestamp).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-3">How it works</h2>
        <ol className="space-y-2 text-sm font-dm text-slate-400 list-decimal list-inside">
          <li>Paste any Amazon, Flipkart, Meesho or Etsy product URL above</li>
          <li>Our AI extracts product name, price, description, images & more</li>
          <li>Review the extracted data and click <strong className="text-slate-200">Add to Catalog</strong></li>
          <li>Product is saved to your ProductVault instantly</li>
        </ol>
      </div>
    </div>
  )
}
