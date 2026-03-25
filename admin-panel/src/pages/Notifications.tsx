import { useState } from 'react'
import {
  Bell, AlertTriangle, CheckCircle2, Info, Zap,
  Mail, Trash2, Eye, EyeOff, Filter,
} from 'lucide-react'

type NType = 'error' | 'warning' | 'success' | 'info'

type Notification = {
  id: number
  type: NType
  title: string
  body: string
  time: string
  read: boolean
  category: string
}

const INITIAL: Notification[] = [
  { id: 1,  type: 'error',   title: 'Scraper service down',            body: '2 scraper jobs failed with timeout error on flipkart.com',            time: '5 min ago',  read: false, category: 'System'   },
  { id: 2,  type: 'warning', title: 'AI quota near limit',             body: 'Vikram Singh (Enterprise) has used 94% of unlimited quota this month', time: '12 min ago', read: false, category: 'Usage'    },
  { id: 3,  type: 'warning', title: 'Payment retry failed',            body: 'Rahul Gupta\'s card declined — 3rd retry. Subscription at risk',       time: '1 hr ago',   read: false, category: 'Billing'  },
  { id: 4,  type: 'success', title: 'Database backup completed',       body: 'Automated backup successful — 14.2 GB stored to S3',                   time: '2 hr ago',   read: true,  category: 'System'   },
  { id: 5,  type: 'info',    title: 'New Enterprise signup',           body: 'Arjun Nair upgraded from Pro to Enterprise — ₹1,999/month',             time: '3 hr ago',   read: true,  category: 'Billing'  },
  { id: 6,  type: 'warning', title: 'Abuse detected',                  body: 'Deepika Rao triggered 5 failed login attempts in 10 minutes',           time: '4 hr ago',   read: false, category: 'Security' },
  { id: 7,  type: 'success', title: 'New support ticket resolved',     body: 'TKT-005 (Anita Patel) marked as resolved',                             time: '5 hr ago',   read: true,  category: 'Support'  },
  { id: 8,  type: 'info',    title: 'Feature request received',        body: 'Multiple users requested bulk CSV import — added to roadmap',           time: '8 hr ago',   read: true,  category: 'Feedback' },
  { id: 9,  type: 'error',   title: 'PDF generation errors',           body: '22 PDF catalog jobs failed with render timeout >15s',                   time: '10 hr ago',  read: true,  category: 'System'   },
  { id: 10, type: 'success', title: 'Stripe webhook received',         body: 'Monthly renewals processed — ₹3,84,200 MRR collected',                 time: '1 day ago',  read: true,  category: 'Billing'  },
  { id: 11, type: 'info',    title: 'SSL certificate renewed',         body: 'productvault.in SSL auto-renewed — valid for 90 days',                  time: '2 days ago', read: true,  category: 'System'   },
  { id: 12, type: 'warning', title: 'Disk usage at 78%',              body: 'VPS /var partition at 78% usage — consider cleanup or upgrade',          time: '3 days ago', read: true,  category: 'System'   },
]

const TYPE_CFG: Record<NType, { icon: typeof Bell; color: string; bg: string; border: string }> = {
  error:   { icon: AlertTriangle, color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
  warning: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
  success: { icon: CheckCircle2,  color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20'},
  info:    { icon: Info,          color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
}

const CATEGORIES = ['All', 'System', 'Billing', 'Usage', 'Security', 'Support', 'Feedback']

export default function Notifications() {
  const [notifs, setNotifs] = useState(INITIAL)
  const [catFilter, setCatFilter] = useState('All')
  const [showUnread, setShowUnread] = useState(false)

  const filtered = notifs.filter((n) =>
    (catFilter === 'All' || n.category === catFilter) &&
    (!showUnread || !n.read)
  )

  const unreadCount = notifs.filter((n) => !n.read).length

  const markRead = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, read: true } : n))
  const markAllRead = () => setNotifs((p) => p.map((n) => ({ ...n, read: true })))
  const dismiss = (id: number) => setNotifs((p) => p.filter((n) => n.id !== id))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Notifications</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">
            {unreadCount > 0 ? <span className="text-rose-400 font-medium">{unreadCount} unread</span> : 'All caught up'} · {notifs.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnread(!showUnread)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-dm border transition-colors ${showUnread ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'bg-white/5 text-slate-400 border-white/10 hover:border-white/20'}`}
          >
            {showUnread ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            {showUnread ? 'Show All' : 'Unread Only'}
          </button>
          <button onClick={markAllRead} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-dm bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-slate-300 transition-colors">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Read
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="flex flex-wrap gap-3">
        {(['error','warning','success','info'] as const).map((t) => {
          const count = notifs.filter((n) => n.type === t).length
          const cfg = TYPE_CFG[t]
          const Icon = cfg.icon
          return (
            <div key={t} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
              <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
              <span className={`text-xs font-dm capitalize ${cfg.color}`}>{t}</span>
              <span className={`text-xs font-dm font-bold ${cfg.color}`}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {CATEGORIES.map((c) => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-dm border transition-all ${catFilter === c ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' : 'text-slate-400 bg-white/5 border-white/10 hover:border-white/20'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {filtered.map((n) => {
          const cfg = TYPE_CFG[n.type]
          const Icon = cfg.icon
          return (
            <div
              key={n.id}
              className={`glass rounded-xl px-5 py-4 flex items-start gap-4 transition-all ${!n.read ? 'border-l-2 border-l-rose-500/50' : ''}`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <Icon className={`w-4.5 h-4.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`text-sm font-dm font-medium ${n.read ? 'text-slate-300' : 'text-white'}`}>{n.title}</p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />}
                      <span className="text-[10px] font-dm px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{n.category}</span>
                    </div>
                    <p className="text-xs font-dm text-slate-500 mt-0.5">{n.body}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!n.read && (
                      <button onClick={() => markRead(n.id)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-emerald-400 transition-colors" title="Mark read">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button onClick={() => dismiss(n.id)} className="w-7 h-7 rounded-md hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-red-400 transition-colors" title="Dismiss">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-dm text-slate-600 mt-1">{n.time}</p>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-xl py-16 text-center">
            <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 font-dm text-sm">No notifications here.</p>
          </div>
        )}
      </div>

      {/* Notification settings */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="font-syne font-semibold text-white">Notification Preferences</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Email on new support ticket', on: true  },
            { label: 'Email on failed payment',     on: true  },
            { label: 'Email on system error',       on: true  },
            { label: 'Email on new Enterprise user', on: true },
            { label: 'Daily summary digest',        on: false },
            { label: 'Weekly revenue report',       on: true  },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <span className="text-sm font-dm text-slate-300">{item.label}</span>
              <div className={`relative inline-flex h-5 w-9 items-center rounded-full ${item.on ? 'bg-rose-500' : 'bg-white/10'}`}>
                <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${item.on ? 'translate-x-4' : 'translate-x-1'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
