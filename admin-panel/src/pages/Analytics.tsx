import { useState, useEffect } from 'react'
import {
  ShoppingBag, Users, Ticket, DollarSign,
  Package, Truck, RefreshCw, AlertCircle,
} from 'lucide-react'

// ── Safe number helper (handles number | string | object | undefined) ──────────
const safeNum = (v: unknown): number => {
  if (typeof v === 'number') return v
  if (typeof v === 'string') return parseInt(v) || 0
  if (v && typeof v === 'object')
    return Object.values(v as Record<string, unknown>).reduce(
      (a: number, b) => a + (parseInt(String(b)) || 0),
      0,
    )
  return 0
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface SummaryStats {
  revenue_today: number
  total_orders: number
  active_clients: number
  open_tickets: number
}

interface StatusRow {
  status: string
  count: number
}

interface ProductRow {
  name: string
  sku?: string
  sold: number
  revenue: number
}

interface CourierRow {
  courier: string
  count: number
  delivered: number
  pending: number
}

interface PaymentSplit {
  cod: number
  prepaid: number
}

interface AnalyticsData {
  summary: SummaryStats
  orders_by_status: StatusRow[]
  top_products: ProductRow[]
  courier_breakdown: CourierRow[]
  payment_split: PaymentSplit
}

// ── Fallback/mock data (shown when API is unavailable) ────────────────────────
const FALLBACK: AnalyticsData = {
  summary: {
    revenue_today: 84500,
    total_orders: 312,
    active_clients: 187,
    open_tickets: 14,
  },
  orders_by_status: [
    { status: 'Delivered',  count: 198 },
    { status: 'Pending',    count: 54  },
    { status: 'Shipped',    count: 37  },
    { status: 'Cancelled',  count: 18  },
    { status: 'Returned',   count: 5   },
  ],
  top_products: [
    { name: 'Navy Blue Kurta Set',     sku: 'NB-KRT-01', sold: 84,  revenue: 251580 },
    { name: 'Gold Embroidered Dupatta', sku: 'GE-DPT-02', sold: 71,  revenue: 106500 },
    { name: 'Cotton Anarkali Suit',     sku: 'CA-ANK-03', sold: 63,  revenue: 157500 },
    { name: 'Silk Saree - Banarasi',    sku: 'SS-BNR-04', sold: 49,  revenue: 294000 },
    { name: 'Palazzo Pant Set',         sku: 'PP-SET-05', sold: 45,  revenue: 89775  },
  ],
  courier_breakdown: [
    { courier: 'Delhivery',    count: 142, delivered: 118, pending: 24 },
    { courier: 'Shiprocket',   count: 89,  delivered: 71,  pending: 18 },
    { courier: 'DTDC',         count: 54,  delivered: 42,  pending: 12 },
    { courier: 'BlueDart',     count: 27,  delivered: 23,  pending: 4  },
  ],
  payment_split: { cod: 187, prepaid: 125 },
}

// ── Status badge colours ───────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, { bar: string; badge: string }> = {
  Delivered:  { bar: '#10B981', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  Pending:    { bar: '#F59E0B', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  Shipped:    { bar: '#6366F1', badge: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
  Cancelled:  { bar: '#EF4444', badge: 'bg-red-500/15 text-red-400 border-red-500/25' },
  Returned:   { bar: '#EC4899', badge: 'bg-pink-500/15 text-pink-400 border-pink-500/25' },
}
const DEFAULT_STATUS = { bar: '#64748B', badge: 'bg-slate-500/15 text-slate-400 border-slate-500/25' }

// ── Simulated API fetch (replace with real fetch when backend is ready) ───────
async function fetchAnalytics(): Promise<AnalyticsData> {
  try {
    const res = await fetch('/api/analytics/summary', { signal: AbortSignal.timeout(5000) })
    if (!res.ok) throw new Error('non-200')
    const json = await res.json()

    // Normalise whatever shape the API returns
    const summary: SummaryStats = {
      revenue_today:  safeNum(json?.summary?.revenue_today  ?? json?.revenue_today),
      total_orders:   safeNum(json?.summary?.total_orders   ?? json?.total_orders),
      active_clients: safeNum(json?.summary?.active_clients ?? json?.active_clients),
      open_tickets:   safeNum(json?.summary?.open_tickets   ?? json?.open_tickets),
    }

    const orders_by_status: StatusRow[] = Array.isArray(json?.orders_by_status)
      ? json.orders_by_status.map((r: Record<string, unknown>) => ({
          status: String(r.status ?? ''),
          count:  safeNum(r.count),
        }))
      : FALLBACK.orders_by_status

    const top_products: ProductRow[] = Array.isArray(json?.top_products)
      ? json.top_products.slice(0, 5).map((r: Record<string, unknown>) => ({
          name:    String(r.name ?? ''),
          sku:     r.sku ? String(r.sku) : undefined,
          sold:    safeNum(r.sold ?? r.quantity ?? r.qty),
          revenue: safeNum(r.revenue ?? r.total),
        }))
      : FALLBACK.top_products

    const courier_breakdown: CourierRow[] = Array.isArray(json?.courier_breakdown)
      ? json.courier_breakdown.map((r: Record<string, unknown>) => ({
          courier:   String(r.courier ?? r.name ?? ''),
          count:     safeNum(r.count ?? r.total),
          delivered: safeNum(r.delivered),
          pending:   safeNum(r.pending),
        }))
      : FALLBACK.courier_breakdown

    const payment_split: PaymentSplit = {
      cod:     safeNum(json?.payment_split?.cod     ?? json?.cod),
      prepaid: safeNum(json?.payment_split?.prepaid ?? json?.prepaid),
    }

    return { summary, orders_by_status, top_products, courier_breakdown, payment_split }
  } catch {
    // Return mock data so the page never crashes
    return FALLBACK
  }
}

// ── Small reusable components ─────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}) {
  return (
    <div className="glass rounded-xl p-5 flex flex-col gap-3">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <div>
        <p className="font-syne font-bold text-2xl text-white leading-none">{value}</p>
        <p className="text-slate-500 text-sm font-dm mt-1">{label}</p>
        {sub && <p className="text-slate-600 text-xs font-dm mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  )
}

function SectionHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-syne font-semibold text-white">{title}</h2>
      {right}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [data, setData] = useState<AnalyticsData>(FALLBACK)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const result = await fetchAnalytics()
      setData(result)
      setLastRefresh(new Date())
    } catch {
      setError(true)
      setData(FALLBACK)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  // ── Derived values ───────────────────────────────────────────────────────────
  const { summary, orders_by_status, top_products, courier_breakdown, payment_split } = data

  const totalOrdersByStatus = orders_by_status.reduce((s, r) => s + safeNum(r.count), 0) || 1
  const totalPayments = safeNum(payment_split.cod) + safeNum(payment_split.prepaid) || 1
  const codPct = Math.round((safeNum(payment_split.cod) / totalPayments) * 100)
  const prepaidPct = 100 - codPct

  const fmtCurrency = (n: number) =>
    '₹' + safeNum(n).toLocaleString('en-IN')

  const timeStr = lastRefresh.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="p-6 space-y-6">

      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">NavyStore Analytics</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            Orders, revenue and logistics at a glance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {error && (
            <span className="flex items-center gap-1.5 text-xs font-dm text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" />
              Showing cached data
            </span>
          )}
          <span className="text-xs font-dm text-slate-600">Updated {timeStr}</span>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-dm text-slate-300
                       bg-white/5 hover:bg-white/10 border border-white/6 transition-colors disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Revenue Today"
          value={fmtCurrency(summary.revenue_today)}
          icon={DollarSign}
          iconBg="rgba(8,80,65,0.25)"
          iconColor="#10B981"
        />
        <StatCard
          label="Total Orders"
          value={safeNum(summary.total_orders).toLocaleString('en-IN')}
          icon={ShoppingBag}
          iconBg="rgba(201,168,76,0.18)"
          iconColor="#C9A84C"
        />
        <StatCard
          label="Active Clients"
          value={safeNum(summary.active_clients).toLocaleString('en-IN')}
          icon={Users}
          iconBg="rgba(99,102,241,0.15)"
          iconColor="#6366F1"
        />
        <StatCard
          label="Open Tickets"
          value={safeNum(summary.open_tickets).toLocaleString('en-IN')}
          icon={Ticket}
          iconBg="rgba(239,68,68,0.15)"
          iconColor="#EF4444"
        />
      </div>

      {/* ── Middle row: Orders by status + COD vs Prepaid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Orders by status */}
        <div className="xl:col-span-2 glass rounded-xl p-5">
          <SectionHeader
            title="Orders by Status"
            right={
              <span className="text-xs font-dm text-slate-500">
                {totalOrdersByStatus} total
              </span>
            }
          />
          <div className="space-y-4">
            {orders_by_status.map((row) => {
              const colors = STATUS_COLORS[row.status] ?? DEFAULT_STATUS
              const pct = Math.round((safeNum(row.count) / totalOrdersByStatus) * 100)
              return (
                <div key={row.status} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-dm px-2 py-0.5 rounded border ${colors.badge}`}
                    >
                      {row.status}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-dm text-slate-500">{pct}%</span>
                      <span className="text-sm font-syne font-semibold text-white w-8 text-right">
                        {safeNum(row.count)}
                      </span>
                    </div>
                  </div>
                  <ProgressBar pct={pct} color={colors.bar} />
                </div>
              )
            })}
          </div>
        </div>

        {/* COD vs Prepaid */}
        <div className="glass rounded-xl p-5">
          <SectionHeader title="Payment Split" />
          <div className="space-y-6">
            {/* COD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-dm text-slate-300">Cash on Delivery</span>
                <span className="text-sm font-syne font-bold text-white">{codPct}%</span>
              </div>
              <ProgressBar pct={codPct} color="#C9A84C" />
              <p className="text-xs font-dm text-slate-600">
                {safeNum(payment_split.cod).toLocaleString('en-IN')} orders
              </p>
            </div>

            {/* Prepaid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-dm text-slate-300">Prepaid / UPI</span>
                <span className="text-sm font-syne font-bold text-white">{prepaidPct}%</span>
              </div>
              <ProgressBar pct={prepaidPct} color="#085041" />
              <p className="text-xs font-dm text-slate-600">
                {safeNum(payment_split.prepaid).toLocaleString('en-IN')} orders
              </p>
            </div>

            {/* Visual split bar */}
            <div className="mt-2">
              <div className="h-3 rounded-full overflow-hidden flex">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${codPct}%`, backgroundColor: '#C9A84C' }}
                />
                <div
                  className="h-full flex-1"
                  style={{ backgroundColor: '#085041' }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="flex items-center gap-1.5 text-[11px] font-dm text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#C9A84C' }} />
                  COD
                </span>
                <span className="flex items-center gap-1.5 text-[11px] font-dm text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: '#085041' }} />
                  Prepaid
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top 5 Products table ── */}
      <div className="glass rounded-xl p-5">
        <SectionHeader
          title="Top 5 Products"
          right={
            <Package className="w-4 h-4 text-slate-500" />
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['#', 'Product', 'SKU', 'Units Sold', 'Revenue'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {top_products.map((p, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-syne font-bold
                        ${i === 0 ? 'text-amber-400 bg-amber-400/15' : 'text-slate-500 bg-white/5'}`}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-dm text-slate-200 max-w-[220px] truncate">
                    {p.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs font-dm text-slate-500">
                    {p.sku || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-syne font-semibold text-white">
                      {safeNum(p.sold).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-dm" style={{ color: '#10B981' }}>
                      {fmtCurrency(p.revenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Courier Breakdown table ── */}
      <div className="glass rounded-xl p-5">
        <SectionHeader
          title="Courier Breakdown"
          right={<Truck className="w-4 h-4 text-slate-500" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Courier', 'Total Shipments', 'Delivered', 'Pending', 'Success Rate'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-xs font-dm text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {courier_breakdown.map((c, i) => {
                const total = safeNum(c.count) || 1
                const delivered = safeNum(c.delivered)
                const rate = Math.round((delivered / total) * 100)
                return (
                  <tr
                    key={i}
                    className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-dm text-slate-200 font-medium">
                        {c.courier || '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-syne font-semibold text-white">
                      {safeNum(c.count).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm font-dm text-emerald-400">
                      {delivered.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-sm font-dm text-amber-400">
                      {safeNum(c.pending).toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <ProgressBar pct={rate} color="#085041" />
                        </div>
                        <span className="text-xs font-dm text-slate-400 w-9 text-right">
                          {rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
