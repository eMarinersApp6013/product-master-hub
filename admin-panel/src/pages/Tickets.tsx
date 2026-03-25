import { useState } from 'react'
import { Search, MessageSquare, Clock, CheckCircle2, AlertTriangle, Circle, ChevronDown, ChevronUp, Send, User, Tag } from 'lucide-react'
import { TICKETS, type Ticket, type TicketStatus } from '../lib/data'

const PRIORITY_CFG = {
  low:      { label: 'Low',      color: 'text-slate-400',  bg: 'bg-slate-500/10 border-slate-500/20',  dot: 'bg-slate-400'  },
  medium:   { label: 'Medium',   color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20',  dot: 'bg-amber-400'  },
  high:     { label: 'High',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  critical: { label: 'Critical', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20',      dot: 'bg-red-400'    },
}
const STATUS_CFG: Record<TicketStatus, { label: string; icon: typeof Circle; color: string; bg: string }> = {
  open:        { label: 'Open',        icon: Circle,         color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20'  },
  in_progress: { label: 'In Progress', icon: Clock,          color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20'    },
  resolved:    { label: 'Resolved',    icon: CheckCircle2,   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  closed:      { label: 'Closed',      icon: CheckCircle2,   color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20'    },
}

export default function Tickets() {
  const [tickets, setTickets] = useState(TICKETS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [expanded, setExpanded] = useState<string | null>('TKT-001')
  const [reply, setReply] = useState('')

  const filtered = tickets.filter((t) => {
    const q = search.toLowerCase()
    return (
      (t.subject.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || t.status === statusFilter)
    )
  })

  const sendReply = (id: string) => {
    if (!reply.trim()) return
    setTickets((prev) => prev.map((t) =>
      t.id !== id ? t : {
        ...t, status: 'in_progress', updated: 'just now',
        messages: [...t.messages, { sender: 'admin', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
      }
    ))
    setReply('')
  }

  const setStatus = (id: string, status: TicketStatus) =>
    setTickets((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Support Tickets</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">{filtered.length} tickets</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {(['open', 'in_progress', 'resolved'] as const).map((s) => {
            const count = tickets.filter((t) => t.status === s).length
            const cfg = STATUS_CFG[s]
            const Icon = cfg.icon
            return (
              <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-dm ${cfg.bg} ${cfg.color}`}>
                <Icon className="w-3 h-3" />{cfg.label}: {count}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tickets…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none appearance-none">
          {['All','open','in_progress','resolved','closed'].map((s) => (
            <option key={s} value={s} className="bg-[#1E293B] capitalize">{s === 'All' ? 'All Status' : s.replace('_',' ')}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.map((ticket) => {
          const isOpen = expanded === ticket.id
          const pCfg = PRIORITY_CFG[ticket.priority]
          const sCfg = STATUS_CFG[ticket.status]
          const SIcon = sCfg.icon
          return (
            <div key={ticket.id} className="glass rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : ticket.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                <div className={`w-2 h-2 rounded-full shrink-0 ${pCfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-slate-600">{ticket.id}</span>
                    <span className={`text-xs font-dm px-1.5 py-0.5 rounded border ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
                    <span className={`text-xs font-dm px-1.5 py-0.5 rounded border flex items-center gap-1 ${sCfg.bg} ${sCfg.color}`}>
                      <SIcon className="w-2.5 h-2.5" />{sCfg.label}
                    </span>
                    <span className="text-xs font-dm text-slate-600 px-1.5 py-0.5 rounded bg-white/5">{ticket.category}</span>
                  </div>
                  <p className="text-sm font-dm text-slate-200 font-medium truncate">{ticket.subject}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-dm text-slate-400">{ticket.user}</span>
                    <span className="text-xs font-dm text-slate-600">Updated {ticket.updated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 text-slate-500">
                  <div className="flex items-center gap-1 text-xs font-dm">
                    <MessageSquare className="w-3.5 h-3.5" />{ticket.messages.length}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/5">
                  <div className="px-5 py-4 space-y-4 max-h-72 overflow-y-auto">
                    {ticket.messages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'admin' ? 'bg-rose-500/20' : 'bg-indigo-500/20'}`}>
                          {msg.sender === 'admin' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> : <User className="w-3.5 h-3.5 text-indigo-400" />}
                        </div>
                        <div className="flex-1 max-w-lg">
                          <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-xs font-dm font-medium ${msg.sender === 'admin' ? 'text-rose-400' : 'text-indigo-400'}`}>
                              {msg.sender === 'admin' ? 'Admin' : ticket.user}
                            </span>
                            <span className="text-[10px] text-slate-600 font-dm">{msg.time}</span>
                          </div>
                          <div className={`px-3.5 py-2.5 rounded-xl text-sm font-dm leading-relaxed border ${msg.sender === 'admin' ? 'bg-rose-500/10 border-rose-500/15 text-slate-300 ml-auto' : 'bg-white/5 border-white/8 text-slate-300'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs text-slate-500 font-dm flex items-center gap-1"><Tag className="w-3 h-3" /> Set status:</span>
                      {(['open','in_progress','resolved','closed'] as const).map((s) => (
                        <button key={s} onClick={() => setStatus(ticket.id, s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-dm border transition-colors capitalize ${ticket.status === s ? `${STATUS_CFG[s].bg} ${STATUS_CFG[s].color}` : 'text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'}`}>
                          {s.replace('_',' ')}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={reply} onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply(ticket.id)}
                        placeholder="Write a reply…"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors" />
                      <button onClick={() => sendReply(ticket.id)} disabled={!reply.trim()}
                        className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-dm transition-colors flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" /> Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="glass rounded-xl py-16 text-center">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 font-dm text-sm">No tickets match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
