'use client'

import { useState } from 'react'
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Package,
  Info,
} from 'lucide-react'

const PLATFORM_FEE_PCT: Record<string, number> = {
  Amazon: 15,
  Flipkart: 12,
  Meesho: 18,
  Etsy: 8,
}

const PLATFORM_COLORS: Record<string, string> = {
  Amazon: '#FF9900',
  Flipkart: '#2874F0',
  Meesho: '#9B32B4',
  Etsy: '#F56400',
}

type CostState = {
  mrp: number
  purchaseCost: number
  packagingCost: number
  shippingCost: number
  adSpend: number
}

export default function ProfitCalculatorPage() {
  const [costs, setCosts] = useState<CostState>({
    mrp: 1299,
    purchaseCost: 480,
    packagingCost: 35,
    shippingCost: 60,
    adSpend: 65,
  })

  const handleChange = (field: keyof CostState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) || 0
    setCosts((prev) => ({ ...prev, [field]: val }))
  }

  const results = Object.entries(PLATFORM_FEE_PCT).map(([platform, feePct]) => {
    const sellingPrice = costs.mrp
    const platformFee = sellingPrice * (feePct / 100)
    const profit =
      sellingPrice -
      costs.purchaseCost -
      costs.packagingCost -
      costs.shippingCost -
      costs.adSpend -
      platformFee
    const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0
    return { platform, profit, margin, platformFee, color: PLATFORM_COLORS[platform] }
  })

  // Use Amazon fees for the cost breakdown panel
  const amazonResult = results.find((r) => r.platform === 'Amazon')!
  const totalCosts =
    costs.purchaseCost + costs.packagingCost + costs.shippingCost + costs.adSpend + amazonResult.platformFee

  const fmt = (n: number) =>
    `₹${Math.round(n).toLocaleString('en-IN')}`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-syne font-bold text-2xl text-white">Profit Calculator</h1>
        <p className="text-slate-400 text-sm font-dm mt-0.5">
          Calculate real profit margins after all platform fees
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              Product Costs
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  MRP / Selling Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    value={costs.mrp}
                    onChange={handleChange('mrp')}
                    min="0"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  Purchase / COGS (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    value={costs.purchaseCost}
                    onChange={handleChange('purchaseCost')}
                    min="0"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  Packaging Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    value={costs.packagingCost}
                    onChange={handleChange('packagingCost')}
                    min="0"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  Shipping Cost (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    value={costs.shippingCost}
                    onChange={handleChange('shippingCost')}
                    min="0"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  Ad Spend (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    value={costs.adSpend}
                    onChange={handleChange('adSpend')}
                    min="0"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Fee Reference */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-syne font-semibold text-white mb-3 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Platform Fee Reference
            </h3>
            <div className="space-y-2">
              {Object.entries(PLATFORM_FEE_PCT).map(([platform, pct]) => (
                <div key={platform} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm font-dm text-slate-300">{platform}</span>
                  <span className="text-xs font-dm text-slate-500">{pct}% platform fee</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h2 className="font-syne font-semibold text-white mb-4">
              Profit Analysis by Platform
            </h2>

            {results.map((result) => {
              const isProfit = result.profit >= 0
              return (
                <div key={result.platform} className="py-4 border-b border-white/5 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-dm font-medium" style={{ color: result.color }}>
                      {result.platform}
                    </span>
                    <div className="flex items-center gap-1">
                      {isProfit ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                      <span className={`font-syne font-bold ${isProfit ? 'text-white' : 'text-red-400'}`}>
                        {fmt(result.profit)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs font-dm text-slate-500 mb-2">
                    <span>Profit Margin</span>
                    <span className={`font-semibold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.margin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max(0, Math.min(100, result.margin))}%`,
                        backgroundColor: result.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cost Breakdown (Amazon basis) */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="font-syne font-semibold text-white">
              Cost Breakdown <span className="text-slate-500 text-xs font-dm font-normal">(Amazon basis)</span>
            </h3>
            {[
              { label: 'Selling Price (MRP)', value: fmt(costs.mrp), color: 'text-white' },
              { label: 'Purchase / COGS', value: `-${fmt(costs.purchaseCost)}`, color: 'text-red-400' },
              { label: 'Packaging', value: `-${fmt(costs.packagingCost)}`, color: 'text-red-400' },
              { label: 'Shipping', value: `-${fmt(costs.shippingCost)}`, color: 'text-red-400' },
              { label: 'Ad Spend', value: `-${fmt(costs.adSpend)}`, color: 'text-red-400' },
              { label: `Platform Fee (Amazon ${PLATFORM_FEE_PCT.Amazon}%)`, value: `-${fmt(amazonResult.platformFee)}`, color: 'text-amber-400' },
              { label: 'Net Profit', value: fmt(amazonResult.profit), color: amazonResult.profit >= 0 ? 'text-emerald-400' : 'text-red-400' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-sm font-dm text-slate-400">{item.label}</span>
                <span className={`text-sm font-dm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Save your product first, then use product pricing page')}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            Apply to Product Pricing
          </button>
        </div>
      </div>
    </div>
  )
}
