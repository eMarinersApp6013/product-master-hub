'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Plus, Download, Trash2, RefreshCw, FileText } from 'lucide-react'

interface CatalogJob { id: string; name: string; status: 'generating' | 'ready' | 'error'; pages?: number; created_at: string; downloadUrl?: string }

const TEMPLATES = [
  { id: 'modern',    label: 'Modern Grid',   desc: '4 products/page, white bg, bold titles' },
  { id: 'elegant',   label: 'Elegant Dark',  desc: '2 products/page, dark theme, luxury feel' },
  { id: 'minimal',   label: 'Minimal',       desc: '6 products/page, clean, perfect for wholesale' },
  { id: 'festive',   label: 'Festive',       desc: 'Colorful, ideal for seasonal promotions' },
]

export default function PDFCatalogPage() {
  const [jobs,     setJobs]     = useState<CatalogJob[]>([])
  const [template, setTemplate] = useState('modern')
  const [title,    setTitle]    = useState('Product Catalog')
  const [category, setCategory] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  // Load saved catalogs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pv_catalogs')
      if (saved) setJobs(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  const saveJobs = (updated: CatalogJob[]) => {
    setJobs(updated)
    try { localStorage.setItem('pv_catalogs', JSON.stringify(updated.slice(0, 20))) } catch { /* ignore */ }
  }

  const handleGenerate = async () => {
    if (!title.trim()) { setError('Enter a catalog title'); return }
    setLoading(true); setError('')

    const jobId = Date.now().toString()
    const newJob: CatalogJob = { id: jobId, name: title, status: 'generating', created_at: new Date().toISOString() }
    saveJobs([newJob, ...jobs])

    try {
      const params = new URLSearchParams({ title, template })
      if (category) params.set('category', category)
      const res = await fetch(`/api/catalog/generate?${params}`)
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Generation failed') }

      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const pages = Math.ceil(blob.size / 10000) // rough estimate

      // Trigger download immediately
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `${title.replace(/\s+/g,'-')}.pdf`
      a.click()

      setJobs(prev => {
        const updated = prev.map(j => j.id === jobId ? { ...j, status: 'ready' as const, pages, downloadUrl } : j)
        try { localStorage.setItem('pv_catalogs', JSON.stringify(updated.slice(0, 20))) } catch { /* ignore */ }
        return updated
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Generation failed'
      setError(msg)
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'error' } : j))
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (job: CatalogJob) => {
    if (!job.downloadUrl) return
    const a = document.createElement('a')
    a.href = job.downloadUrl
    a.download = `${job.name}.pdf`
    a.click()
  }

  const handleDelete = (id: string) => saveJobs(jobs.filter(j => j.id !== id))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">PDF Catalog</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">Generate beautiful product catalogs as PDF</p>
      </div>

      {/* Templates */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="font-syne font-semibold text-white mb-4">Choose Template</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => setTemplate(t.id)}
              className={`p-4 rounded-xl border text-left transition-all ${template === t.id ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
              <p className="text-sm font-dm font-semibold text-white mb-1">{t.label}</p>
              <p className="text-xs font-dm text-slate-500">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Build */}
      <div className="glass-card rounded-xl p-5 space-y-4">
        <h2 className="font-syne font-semibold text-white">Generate Catalog</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Catalog Title *</label>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="My Product Catalog 2024"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
          </div>
          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Filter by Category (optional)</label>
            <input value={category} onChange={e => setCategory(e.target.value)}
              placeholder="e.g. Ethnic Wear"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
          </div>
        </div>
        {error && <p className="text-red-400 text-sm font-dm">{error}</p>}
        <button onClick={handleGenerate} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-dm font-medium rounded-lg transition-colors">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? 'Generating PDF…' : 'Generate & Download'}
        </button>
        <p className="text-xs font-dm text-slate-600">PDF will include all your products matching the filters, formatted using the selected template.</p>
      </div>

      {/* History */}
      {jobs.length > 0 && (
        <div className="glass-card rounded-xl p-5">
          <h2 className="font-syne font-semibold text-white mb-4">Generated Catalogs</h2>
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <FileText className={`w-4 h-4 shrink-0 ${job.status === 'ready' ? 'text-indigo-400' : job.status === 'error' ? 'text-red-400' : 'text-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-dm text-slate-200 truncate">{job.name}</p>
                  <p className="text-xs font-dm text-slate-500">
                    {job.status === 'generating' ? 'Generating…'
                     : job.status === 'error'    ? 'Failed'
                     : `Ready · ${job.pages ?? '?'} pages`}
                    {' · '}{new Date(job.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {job.status === 'ready' && job.downloadUrl && (
                    <button onClick={() => handleDownload(job)} className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-lg bg-white/5 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {jobs.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-dm text-sm">No catalogs generated yet. Create your first one above!</p>
        </div>
      )}
    </div>
  )
}
