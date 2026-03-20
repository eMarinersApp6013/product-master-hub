import {
  Calculator,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Percent,
  Info,
} from 'lucide-react'

const platformFees = {
  Amazon: { referral: 8, closing: 18, shipping: 45 },
  Flipkart: { referral: 7.5, closing: 15, shipping: 40 },
  Etsy: { referral: 6.5, closing: 0, shipping: 0 },
  Meesho: { referral: 0, closing: 0, shipping: 0 },
}

export default function ProfitCalculatorPage() {
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
        {/* Input */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5 space-y-4">
            <h2 className="font-syne font-semibold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-indigo-400" />
              Product Costs
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  Selling Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    defaultValue="1299"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  MRP / List Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    defaultValue="1799"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-dm text-slate-400 mb-1.5">
                  COGS / Cost Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-dm text-sm">₹</span>
                  <input
                    type="number"
                    defaultValue="480"
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
                    defaultValue="35"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg pl-7 pr-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">
                Product Weight (grams)
              </label>
              <input
                type="number"
                defaultValue="350"
                className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-dm text-slate-400 mb-1.5">Category</label>
              <select className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm font-dm text-slate-200 focus:outline-none focus:border-indigo-500/50">
                <option>Clothing & Accessories</option>
                <option>Electronics</option>
                <option>Home & Furniture</option>
                <option>Books & Media</option>
              </select>
            </div>
          </div>

          {/* Platform Fees Reference */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-syne font-semibold text-white mb-3 text-sm flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              Platform Fee Reference
            </h3>
            <div className="space-y-2">
              {Object.entries(platformFees).map(([platform, fees]) => (
                <div key={platform} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                  <span className="text-sm font-dm text-slate-300">{platform}</span>
                  <div className="flex gap-3 text-xs font-dm text-slate-500">
                    <span>Ref: {fees.referral}%</span>
                    {fees.closing > 0 && <span>Close: ₹{fees.closing}</span>}
                    {fees.shipping > 0 && <span>Ship: ₹{fees.shipping}</span>}
                    {fees.referral === 0 && <span className="text-emerald-400">Free to sell!</span>}
                  </div>
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

            {[
              { platform: 'Amazon', profit: 638, margin: 49.1, color: '#FF9900' },
              { platform: 'Flipkart', profit: 659, margin: 50.7, color: '#2874F0' },
              { platform: 'Meesho', profit: 784, margin: 60.4, color: '#9B32B4' },
              { platform: 'Etsy', profit: 712, margin: 54.8, color: '#F56400' },
            ].map((result) => (
              <div
                key={result.platform}
                className="py-4 border-b border-white/5 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-dm font-medium text-slate-200" style={{ color: result.color }}>
                    {result.platform}
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="font-syne font-bold text-white">₹{result.profit}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-dm text-slate-500 mb-2">
                  <span>Profit Margin</span>
                  <span className="text-emerald-400 font-semibold">{result.margin}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${result.margin}%`,
                      backgroundColor: result.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <h3 className="font-syne font-semibold text-white">Cost Breakdown</h3>
            {[
              { label: 'Selling Price', value: '₹1,299', color: 'text-white' },
              { label: 'COGS', value: '-₹480', color: 'text-red-400' },
              { label: 'Packaging', value: '-₹35', color: 'text-red-400' },
              { label: 'Platform Fees (Amazon)', value: '-₹146', color: 'text-amber-400' },
              { label: 'Net Profit', value: '₹638', color: 'text-emerald-400' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-1 border-b border-white/5 last:border-0">
                <span className="text-sm font-dm text-slate-400">{item.label}</span>
                <span className={`text-sm font-dm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-dm font-medium rounded-xl transition-colors flex items-center justify-center gap-2">
            <Package className="w-4 h-4" />
            Apply to Product Pricing
          </button>
        </div>
      </div>
    </div>
  )
}
