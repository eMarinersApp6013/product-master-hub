'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Upload,
  Download,
  FileSpreadsheet,
  FileJson,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react'

type JobStatus = 'completed' | 'processing' | 'failed'

interface RecentJob {
  id: number
  type: 'import' | 'export'
  format: string
  file: string
  records: number
  status: JobStatus
  time: string
}

export default function ImportExportPage() {
  // Export state
  const [exportFormat, setExportFormat] = useState<'CSV' | 'JSON'>('CSV')
  const [isExporting, setIsExporting] = useState(false)

  // Import state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number; total: number } | null>(null)
  const [importError, setImportError] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)

  // Recent jobs (local state, updated on actions)
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([])
  const jobIdCounter = useRef(1)

  function addJob(job: Omit<RecentJob, 'id'>) {
    const id = jobIdCounter.current++
    setRecentJobs((prev) => [{ id, ...job }, ...prev])
    return id
  }

  function updateJob(id: number, patch: Partial<RecentJob>) {
    setRecentJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)))
  }

  // ── Export ────────────────────────────────────────────────────────────────
  async function handleExport() {
    setIsExporting(true)
    const jobId = addJob({
      type: 'export',
      format: exportFormat,
      file: `products-${new Date().toISOString().split('T')[0]}.${exportFormat.toLowerCase()}`,
      records: 0,
      status: 'processing',
      time: 'Just now',
    })

    try {
      const res = await fetch(`/api/products/export?format=${exportFormat.toLowerCase()}`)
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Export failed')
      }

      // Trigger browser download
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') || ''
      const match = disposition.match(/filename="?([^"]+)"?/)
      a.download = match ? match[1] : `products.${exportFormat.toLowerCase()}`
      a.href = url
      a.click()
      URL.revokeObjectURL(url)

      updateJob(jobId, { status: 'completed', time: 'Just now' })
    } catch (err) {
      updateJob(jobId, { status: 'failed', time: 'Just now' })
      console.error(err)
    } finally {
      setIsExporting(false)
    }
  }

  // ── CSV parsing ───────────────────────────────────────────────────────────
  function parseCSV(text: string): Record<string, string>[] {
    const lines = text.split('\n').filter((l) => l.trim())
    if (lines.length < 2) return []
    const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''))
    return lines.slice(1).map((line) => {
      const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
      const row: Record<string, string> = {}
      headers.forEach((h, i) => { row[h] = values[i] ?? '' })
      return row
    })
  }

  function parseJSON(text: string): Record<string, string>[] {
    try {
      const data = JSON.parse(text)
      return Array.isArray(data) ? data : []
    } catch {
      return []
    }
  }

  // ── Import file processing ────────────────────────────────────────────────
  async function processFile(file: File) {
    setImportError('')
    setImportResult(null)
    setIsImporting(true)

    const jobId = addJob({
      type: 'import',
      format: file.name.endsWith('.json') ? 'JSON' : 'CSV',
      file: file.name,
      records: 0,
      status: 'processing',
      time: 'Just now',
    })

    try {
      const text = await file.text()
      const rows = file.name.endsWith('.json') ? parseJSON(text) : parseCSV(text)

      if (!rows.length) throw new Error('No valid rows found in file.')

      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Import failed')

      setImportResult(data)
      updateJob(jobId, { status: 'completed', records: data.imported, time: 'Just now' })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Import failed'
      setImportError(msg)
      updateJob(jobId, { status: 'failed', time: 'Just now' })
    } finally {
      setIsImporting(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

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

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
              isDragOver
                ? 'border-emerald-500/60 bg-emerald-500/5'
                : 'border-white/10 hover:border-emerald-500/30'
            }`}
          >
            {isImporting ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="font-dm text-slate-400 text-sm">Importing…</p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-dm text-slate-400 text-sm">Drop your file here or click to browse</p>
                <p className="font-dm text-slate-600 text-xs mt-1">CSV, JSON supported</p>
              </>
            )}
          </div>

          {/* Import result / error */}
          {importResult && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <p className="text-xs font-dm text-emerald-300">
                Imported {importResult.imported} product{importResult.imported !== 1 ? 's' : ''}
                {importResult.skipped > 0 && `, ${importResult.skipped} skipped`}
              </p>
            </div>
          )}
          {importError && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-xs font-dm text-red-300">{importError}</p>
            </div>
          )}

          {/* Format options */}
          <div>
            <p className="text-xs font-dm text-slate-400 mb-2">Supported Formats</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: FileSpreadsheet, label: 'CSV (.csv)', color: '#6366F1' },
                { icon: FileJson, label: 'JSON (.json)', color: '#F59E0B' },
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

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-dm font-medium rounded-lg transition-colors"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Importing…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Products
              </>
            )}
          </button>

          <a
            href="/api/products/template"
            download="productvault-import-template.csv"
            className="block text-center text-xs font-dm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ⬇ Download import template (CSV)
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
            <div className="grid grid-cols-2 gap-2">
              {(['CSV', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`py-2 text-sm font-dm rounded-lg border transition-colors ${
                    exportFormat === fmt
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
              <option>All Categories</option>
              <option>Ethnic Wear</option>
              <option>Sarees</option>
              <option>Kurtis</option>
              <option>Accessories</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-2">Include Fields</label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Title', 'Description', 'Price', 'Images', 'Keywords', 'Variants', 'Stock', 'Dimensions'].map(
                (field) => (
                  <label key={field} className="flex items-center gap-2 cursor-pointer group">
                    <div className="w-4 h-4 rounded border border-indigo-500/50 bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span className="text-xs font-dm text-slate-400 group-hover:text-slate-300">
                      {field}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-dm font-medium rounded-lg transition-colors"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Downloading…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Products ({exportFormat})
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-syne font-semibold text-white">Recent Jobs</h2>
          <button
            onClick={() => setRecentJobs([])}
            className="flex items-center gap-1.5 text-xs font-dm text-slate-500 hover:text-slate-300"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
        {recentJobs.length === 0 ? (
          <div className="px-5 py-8 text-center">
            <p className="text-xs font-dm text-slate-600">No recent jobs. Import or export products to see activity here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recentJobs.map((job) => (
              <div key={job.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="shrink-0">
                  {job.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {job.status === 'processing' && (
                    <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />
                  )}
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
                    <p className="text-xs font-dm text-slate-600">
                      {job.records.toLocaleString()} records · {job.format}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs font-dm text-slate-600 shrink-0">
                  <Clock className="w-3 h-3" />
                  {job.time}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
