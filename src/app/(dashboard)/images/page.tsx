'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Grid3X3, List, Image as ImageIcon, Download, Trash2, Plus, RefreshCw, Link, Clipboard, CheckCircle2 } from 'lucide-react'

interface ProductImage {
  id: number
  filename: string
  url: string
  size_bytes: number
  product_name?: string
  created_at: string
}

type UploadTab = 'file' | 'url'

function formatBytes(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImagesPage() {
  const [images, setImages]     = useState<ProductImage[]>([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [view, setView]         = useState<'grid' | 'list'>('grid')
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState('')
  const [toast, setToast]       = useState('')
  const [activeTab, setActiveTab] = useState<UploadTab>('file')
  const [urlInput, setUrlInput] = useState('')
  const [urlLoading, setUrlLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/images')
      if (res.ok) { const d = await res.json(); setImages(d.images || []) }
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  // Ctrl+V paste support
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      const imageItems = Array.from(items).filter(i => i.type.startsWith('image/'))
      if (!imageItems.length) return
      e.preventDefault()
      const files = imageItems.map(i => i.getAsFile()).filter(Boolean) as File[]
      if (files.length) { showToast('Pasting image…'); await uploadFiles(files) }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true); setError('')
    let ok = 0, fail = 0
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/images', { method: 'POST', body: fd })
      if (res.ok) ok++; else fail++
    }
    if (fail) setError(`${fail} file(s) failed to upload`)
    if (ok) showToast(`${ok} image${ok > 1 ? 's' : ''} uploaded!`)
    await load()
    setUploading(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files))
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files))
  }

  const handleUrlDownload = async () => {
    if (!urlInput.trim()) return
    setUrlLoading(true); setError('')
    const res = await fetch('/api/images/download-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.trim() }),
    })
    if (res.ok) {
      setUrlInput(''); showToast('Image downloaded and saved!')
      await load()
    } else {
      const d = await res.json(); setError(d.error || 'Failed to download image')
    }
    setUrlLoading(false)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/images/${id}`, { method: 'DELETE' })
    setImages(prev => prev.filter(img => img.id !== id))
    showToast('Image deleted')
  }

  const urlPlaceholder = 'Paste any image URL, Google Drive link, Dropbox, OneDrive…'

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-dm shadow-xl backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Images</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Upload product images — press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs text-slate-300">Ctrl+V</kbd> anywhere to paste</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <Upload className="w-4 h-4" />Upload
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />

      {/* Upload Panel */}
      <div className="glass-card rounded-xl overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {[
            { id: 'file', label: 'Upload File', icon: Upload },
            { id: 'url',  label: 'From URL / Cloud',  icon: Link },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as UploadTab)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-dm transition-colors ${activeTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}>
                <Icon className="w-4 h-4" />{tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'file' ? (
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`p-8 text-center cursor-pointer transition-all ${dragging ? 'bg-indigo-500/10' : 'hover:bg-white/2'}`}>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
              {uploading ? <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" /> : <Upload className="w-6 h-6 text-indigo-400" />}
            </div>
            <p className="font-dm text-slate-200 font-medium">{uploading ? 'Uploading…' : 'Drop images here or click to upload'}</p>
            <p className="font-dm text-slate-600 text-sm mt-1">JPG, PNG, WebP up to 10MB — or press <strong className="text-slate-400">Ctrl+V</strong> to paste</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-dm text-slate-400">Image URL</label>
              <div className="flex gap-2">
                <input
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUrlDownload()}
                  placeholder={urlPlaceholder}
                  className="flex-1 bg-[#1E293B] border border-white/10 rounded-lg px-4 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
                />
                <button onClick={handleUrlDownload} disabled={urlLoading || !urlInput.trim()}
                  className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-dm font-medium rounded-lg transition-colors flex items-center gap-2">
                  {urlLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {urlLoading ? 'Downloading…' : 'Download'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Google Drive', hint: 'Share link → File → Get link', color: '#4285F4' },
                { name: 'Dropbox',      hint: 'Right-click → Copy link',      color: '#0061FF' },
                { name: 'OneDrive',     hint: 'Share → Copy link',             color: '#0078D4' },
                { name: 'Direct URL',   hint: 'Any direct .jpg/.png link',    color: '#10B981' },
              ].map(src => (
                <div key={src.name} className="rounded-lg p-3 text-center" style={{ backgroundColor: `${src.color}12`, border: `1px solid ${src.color}25` }}>
                  <p className="text-xs font-dm font-medium" style={{ color: src.color }}>{src.name}</p>
                  <p className="text-[10px] font-dm text-slate-600 mt-1 leading-tight">{src.hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-sm font-dm bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl">{error}</p>}

      {/* Gallery */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-dm text-sm">Loading images…</div>
      ) : images.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-dm text-sm">No images yet. Upload your first product image above.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {images.map(img => (
            <div key={img.id} className="glass-card rounded-xl overflow-hidden group hover:border-white/10 transition-all">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={img.url} download={img.filename} onClick={e => e.stopPropagation()}
                    className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => handleDelete(img.id)}
                    className="w-8 h-8 rounded-lg bg-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/50 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-[11px] font-dm text-slate-400 truncate">{img.product_name || img.filename}</p>
                <p className="text-[10px] font-dm text-slate-600">{formatBytes(img.size_bytes)}</p>
              </div>
            </div>
          ))}
          <button onClick={() => fileRef.current?.click()} className="glass-card rounded-xl overflow-hidden border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all cursor-pointer">
            <div className="aspect-square flex items-center justify-center flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Plus className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-[11px] font-dm text-slate-600">Add more</p>
            </div>
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {images.map(img => (
            <div key={img.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-dm text-slate-200 truncate">{img.filename}</p>
                <p className="text-xs font-dm text-slate-500">{img.product_name || 'No product'} · {formatBytes(img.size_bytes)}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={img.url} download={img.filename} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors"><Download className="w-3.5 h-3.5" /></a>
                <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded-lg bg-white/5 hover:text-red-400 text-slate-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
