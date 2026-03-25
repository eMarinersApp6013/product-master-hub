import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Props {
  label: string
  value: string
  change?: string
  up?: boolean
  sub?: string
  icon: LucideIcon
  color: string
  bg: string
}

export default function StatCard({ label, value, change, up = true, sub, icon: Icon, color, bg }: Props) {
  return (
    <div className="glass rounded-xl p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span className={`flex items-center gap-0.5 text-xs font-dm font-medium ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {change}
          </span>
        )}
      </div>
      <p className="font-syne font-bold text-2xl text-white">{value}</p>
      <p className="text-slate-500 text-sm font-dm mt-1">{label}</p>
      {sub && <p className="text-slate-600 text-xs font-dm mt-1">{sub}</p>}
    </div>
  )
}
