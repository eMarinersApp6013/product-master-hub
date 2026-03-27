'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
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

const PLATFORMS = ['Amazon India', 'Flipkart', 'Etsy', 'Meesho']
const TONES = ['Professional', 'Festive', 'Casual', 'Luxury']

export default function AIStudioPage() {
  const [selectedTool, setSelectedTool] = useState('listing')
  const [platform, setPlatform] = useState('Amazon India')
  const [productInput, setProductInput] = useState('')
  const [features, setFeatures] = useState('')
  const [tone, setTone] = useState('Professional')
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState('')
  const [aiCredits, setAiCredits] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/user/profile')
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.ai_count === 'number') {
          setAiCredits(data.ai_count)
        }
      })
      .catch(() => {/* silently fail */})
  }, [])

  async function handleGenerate() {
    if (!productInput.trim()) {
      setError('Please enter a product name or description.')
      return
    }
    setError('')
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, productInput, features, tone }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Generation failed. Please try again.')
      } else {
        setOutput(data.result || '')
        if (typeof data.credits_used === 'number') {
          setAiCredits(500 - data.credits_used)
        }
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleCopyAll() {
    if (!output) return
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard not available */
    }
  }

  const creditsRemaining = aiCredits !== null ? Math.max(0, 500 - aiCredits) : null

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
          <span className="text-xs font-dm text-indigo-300">
            {creditsRemaining !== null ? `${creditsRemaining} credits remaining` : 'Loading credits…'}
          </span>
        </div>
      </div>

      {/* Tool Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {aiTools.map((tool) => {
          const Icon = tool.icon
          const isSelected = selectedTool === tool.id
          return (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`glass-card rounded-xl p-5 text-left hover:border-white/10 transition-all group relative ${
                isSelected ? 'ring-1 ring-indigo-500/30' : ''
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
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50 appearance-none"
              >
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
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
              value={productInput}
              onChange={(e) => setProductInput(e.target.value)}
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
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="Silk blend fabric&#10;Navy blue color&#10;Traditional embroidery&#10;Includes kurta, palazzo, dupatta"
              className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-dm text-slate-400 mb-1.5">Tone</label>
            <div className="flex gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 text-xs font-dm rounded-lg border transition-colors ${
                    tone === t
                      ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-dm text-red-400">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-dm font-medium rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Listing
              </>
            )}
          </button>
        </div>

        {/* Output Panel */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-syne font-semibold text-white">Generated Output</h2>
            <div className="flex gap-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !output}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </button>
              <button
                onClick={handleCopyAll}
                disabled={!output}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-dm rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Copy className="w-3 h-3" />
                {copied ? 'Copied!' : 'Copy All'}
              </button>
            </div>
          </div>

          <div className="bg-[#1E293B] rounded-lg p-4 h-[380px] overflow-y-auto flex items-start">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center w-full h-full gap-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-xs font-dm text-slate-500">AI is generating your listing…</p>
              </div>
            ) : output ? (
              <pre className="text-xs font-dm text-slate-300 whitespace-pre-wrap leading-relaxed">
                {output}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-2">
                <Sparkles className="w-8 h-8 text-slate-700" />
                <p className="text-xs font-dm text-slate-600 text-center">
                  Fill in the product details and click Generate Listing to see your AI-crafted content here.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-xs font-dm text-slate-500">
              {output && (
                <>
                  <span>1 credit used</span>
                  <span>•</span>
                  <span>Platform: {platform}</span>
                </>
              )}
            </div>
            <button
              disabled={!output}
              className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-dm rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply to Product
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
