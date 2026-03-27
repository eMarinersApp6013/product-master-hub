'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Grid3X3, List, Image as ImageIcon, Download, Trash2, Plus, RefreshCw } from 'lucide-react'

interface ProductImage {
  id: number
  filename: string
  url: string
  size_bytes: number
  product_name?: string
  created_at: string
}

function formatBytes(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function ImagesPage() {
  const [images, setImages]     = useState<ProductImage[]>([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [view, setView]         = useState<'grid' | 'list'>('grid')
  const [dragging, setDragging] = useState(false)
  const [error, setError]       = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/images')
      if (res.ok) { const d = await res.json(); setImages(d.images || []) }
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return
    setUploading(true); setError('')
    let failed = 0
    for (const file of files) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/images', { method: 'POST', body: fd })
      if (!res.ok) failed++
    }
    if (failed) setError(`${failed} file(s) failed to upload.`)
    await load()
    setUploading(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) uploadFiles(Array.from(e.target.files))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files))
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/images/${id}`, { method: 'DELETE' })
    setImages(prev => prev.filter(img => img.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Images</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">Manage your product images</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors">
            {view === 'grid' ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
          </button>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-lg transition-colors">
            <Upload className="w-4 h-4" />Upload Images
          </button>
        </div>
      </div>

      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} />

      {/* Upload Zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${dragging ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/30'}`}>
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
          {uploading ? <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" /> : <Upload className="w-6 h-6 text-indigo-400" />}
        </div>
        <p className="font-dm text-slate-300 font-medium">{uploading ? 'Uploading…' : 'Drop images here or click to upload'}</p>
        <p className="font-dm text-slate-600 text-sm mt-1">Supports JPG, PNG, WebP up to 10MB each</p>
      </div>

      {error && <p className="text-red-400 text-sm font-dm">{error}</p>}

      {/* Images */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-dm text-sm">Loading images…</div>
      ) : images.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <ImageIcon className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-500 font-dm text-sm">No images yet.</p>
          <p className="text-slate-600 font-dm text-xs mt-1">Upload product images to get started.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {images.map(img => (
            <div key={img.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-white/10 transition-all">
              <div className="aspect-square bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.filename} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display='none' }} />
                <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <a href={img.url} download={img.filename}
                    className="w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-white hover:bg-black/70">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button onClick={() => handleDelete(img.id)}
                    className="w-7 h-7 rounded-lg bg-black/50 flex items-center justify-center text-red-400 hover:bg-black/70">
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
          <button onClick={() => fileRef.current?.click()} className="glass-card rounded-xl overflow-hidden hover:border-white/10 transition-all">
            <div className="aspect-square flex items-center justify-center flex-col gap-2">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Plus className="w-5 h-5 text-slate-600" />
              </div>
              <p className="text-[11px] font-dm text-slate-600">Upload more</p>
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
                <a href={img.url} download={img.filename}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button onClick={() => handleDelete(img.id)}
                  className="p-1.5 rounded-lg bg-white/5 hover:text-red-400 text-slate-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
