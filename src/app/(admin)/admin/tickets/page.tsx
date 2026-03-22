'use client'

import { useState } from 'react'
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Circle,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Tag,
} from 'lucide-react'

type Ticket = {
  id: string
  subject: string
  user: string
  email: string
  plan: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  category: string
  created: string
  updated: string
  messages: { sender: 'user' | 'admin'; text: string; time: string }[]
}

const tickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'AI listing generator giving wrong language output',
    user: 'Vikram Singh', email: 'vikram@example.com', plan: 'Enterprise',
    priority: 'high', status: 'open', category: 'AI Feature',
    created: 'Mar 22, 2026 9:12 AM', updated: '10 min ago',
    messages: [
      { sender: 'user', text: 'The AI listing generator is producing Hindi output even when I set language to English. I tried multiple products and the issue persists.', time: '9:12 AM' },
      { sender: 'admin', text: 'Hi Vikram, we\'ve reproduced this issue and our team is looking into it. Can you share the product URL you were using?', time: '9:45 AM' },
      { sender: 'user', text: 'Sure, here it is: flipkart.com/product-xyz. This is urgent for us.', time: '10:02 AM' },
    ],
  },
  {
    id: 'TKT-002',
    subject: 'Unable to download PDF catalog — getting 500 error',
    user: 'Priya Sharma', email: 'priya@example.com', plan: 'Pro',
    priority: 'medium', status: 'in_progress', category: 'PDF Catalog',
    created: 'Mar 21, 2026 4:30 PM', updated: '2 hr ago',
    messages: [
      { sender: 'user', text: 'Every time I try to download my PDF catalog it shows a 500 internal server error. This has been happening since yesterday.', time: '4:30 PM' },
      { sender: 'admin', text: 'We\'re investigating the PDF generation service. A fix is being deployed shortly.', time: '5:15 PM' },
    ],
  },
  {
    id: 'TKT-003',
    subject: 'Billing question — charged twice this month',
    user: 'Rahul Gupta', email: 'rahul@example.com', plan: 'Starter',
    priority: 'critical', status: 'open', category: 'Billing',
    created: 'Mar 22, 2026 11:00 AM', updated: '5 min ago',
    messages: [
      { sender: 'user', text: 'I see two charges on my credit card for ₹299 this month (March 1 and March 3). Please refund the duplicate charge.', time: '11:00 AM' },
    ],
  },
  {
    id: 'TKT-004',
    subject: 'Scraper not working on Meesho product pages',
    user: 'Karan Mehta', email: 'karan@example.com', plan: 'Pro',
    priority: 'medium', status: 'in_progress', category: 'Scraper',
    created: 'Mar 20, 2026 2:00 PM', updated: '1 day ago',
    messages: [
      { sender: 'user', text: 'Meesho product scraper stopped working 2 days ago. It just shows "Failed to fetch" every time.', time: '2:00 PM' },
      { sender: 'admin', text: 'Meesho updated their page structure. Our scraper is being updated to handle this. ETA: 24 hours.', time: '3:30 PM' },
    ],
  },
  {
    id: 'TKT-005',
    subject: 'How do I create a store page for WhatsApp catalogue?',
    user: 'Anita Patel', email: 'anita@example.com', plan: 'Free',
    priority: 'low', status: 'resolved', category: 'How-To',
    created: 'Mar 19, 2026 10:00 AM', updated: '2 days ago',
    messages: [
      { sender: 'user', text: 'Can you guide me on how to create a store page that I can share on WhatsApp?', time: '10:00 AM' },
      { sender: 'admin', text: 'Hi Anita! Go to Store Pages → New Page → choose the WhatsApp template. You can then share the link directly. Let me know if you need any help!', time: '10:45 AM' },
      { sender: 'user', text: 'Thank you! That worked perfectly.', time: '11:00 AM' },
    ],
  },
  {
    id: 'TKT-006',
    subject: 'Request to upgrade to Enterprise — need custom integration',
    user: 'Arjun Nair', email: 'arjun@example.com', plan: 'Enterprise',
    priority: 'low', status: 'closed', category: 'Sales',
    created: 'Mar 10, 2026 9:00 AM', updated: '12 days ago',
    messages: [
      { sender: 'user', text: 'We want to integrate ProductVault with our custom ERP system. Can your team help?', time: '9:00 AM' },
      { sender: 'admin', text: 'Absolutely! Our Enterprise plan includes custom integrations. I\'ll have our solutions team reach out within 24 hours.', time: '9:30 AM' },
      { sender: 'user', text: 'Great, looking forward to it!', time: '9:45 AM' },
    ],
  },
]

const priorityConfig = {
  low: { label: 'Low', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  high: { label: 'High', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', dot: 'bg-orange-400' },
  critical: { label: 'Critical', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
}

const statusConfig = {
  open: { label: 'Open', icon: Circle, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  in_progress: { label: 'In Progress', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  resolved: { label: 'Resolved', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  closed: { label: 'Closed', icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20' },
}

const planStyles: Record<string, string> = {
  Free: 'text-slate-400',
  Starter: 'text-indigo-400',
  Pro: 'text-emerald-400',
  Enterprise: 'text-amber-400',
}

export default function TicketsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [expanded, setExpanded] = useState<string | null>('TKT-001')
  const [reply, setReply] = useState('')
  const [ticketList, setTicketList] = useState(tickets)

  const filtered = ticketList.filter((t) => {
    const q = search.toLowerCase()
    return (
      (t.subject.toLowerCase().includes(q) || t.user.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
      (statusFilter === 'All' || t.status === statusFilter) &&
      (priorityFilter === 'All' || t.priority === priorityFilter)
    )
  })

  const sendReply = (id: string) => {
    if (!reply.trim()) return
    setTicketList((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'in_progress',
              updated: 'just now',
              messages: [...t.messages, { sender: 'admin', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
            }
          : t
      )
    )
    setReply('')
  }

  const updateStatus = (id: string, status: Ticket['status']) => {
    setTicketList((prev) => prev.map((t) => t.id === id ? { ...t, status } : t))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Support Tickets</h1>
          <p className="text-slate-400 text-sm font-dm mt-0.5">{filtered.length} tickets</p>
        </div>
        <div className="flex items-center gap-3">
          {(['open', 'in_progress', 'resolved'] as const).map((s) => {
            const count = ticketList.filter((t) => t.status === s).length
            const cfg = statusConfig[s]
            const Icon = cfg.icon
            return (
              <div key={s} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-dm ${cfg.bg} ${cfg.color}`}>
                <Icon className="w-3 h-3" />
                {cfg.label}: {count}
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none appearance-none"
        >
          {['All', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
            <option key={s} value={s} className="bg-[#1E293B] capitalize">{s === 'All' ? 'All Status' : s.replace('_', ' ')}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-dm focus:outline-none appearance-none"
        >
          {['All', 'critical', 'high', 'medium', 'low'].map((p) => (
            <option key={p} value={p} className="bg-[#1E293B] capitalize">{p === 'All' ? 'All Priority' : p}</option>
          ))}
        </select>
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {filtered.map((ticket) => {
          const isOpen = expanded === ticket.id
          const pCfg = priorityConfig[ticket.priority]
          const sCfg = statusConfig[ticket.status]
          const SIcon = sCfg.icon

          return (
            <div key={ticket.id} className="glass-card rounded-xl overflow-hidden">
              {/* Ticket header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : ticket.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors text-left"
              >
                <div className="shrink-0">
                  <div className={`w-2 h-2 rounded-full ${pCfg.dot}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono text-slate-600">{ticket.id}</span>
                    <span className={`text-xs font-dm font-medium px-1.5 py-0.5 rounded border ${pCfg.bg} ${pCfg.color}`}>
                      {pCfg.label}
                    </span>
                    <span className={`text-xs font-dm font-medium px-1.5 py-0.5 rounded border ${sCfg.bg} ${sCfg.color} flex items-center gap-1`}>
                      <SIcon className="w-2.5 h-2.5" />
                      {sCfg.label}
                    </span>
                    <span className="text-xs font-dm text-slate-600 px-1.5 py-0.5 rounded bg-white/5">
                      {ticket.category}
                    </span>
                  </div>
                  <p className="text-sm font-dm text-slate-200 font-medium truncate">{ticket.subject}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className={`text-xs font-dm ${planStyles[ticket.plan]}`}>{ticket.user}</span>
                    <span className="text-xs font-dm text-slate-600">{ticket.email}</span>
                    <span className="text-xs font-dm text-slate-600">Updated {ticket.updated}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-slate-500">
                  <div className="flex items-center gap-1 text-xs font-dm">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {ticket.messages.length}
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Expanded ticket thread */}
              {isOpen && (
                <div className="border-t border-white/5">
                  {/* Messages */}
                  <div className="px-5 py-4 space-y-4 max-h-72 overflow-y-auto">
                    {ticket.messages.map((msg, i) => (
                      <div key={i} className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'admin' ? 'bg-rose-500/20' : 'bg-indigo-500/20'}`}>
                          {msg.sender === 'admin'
                            ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            : <User className="w-3.5 h-3.5 text-indigo-400" />
                          }
                        </div>
                        <div className={`flex-1 max-w-lg ${msg.sender === 'admin' ? 'items-end' : ''}`}>
                          <div className={`flex items-center gap-2 mb-1 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-xs font-dm font-medium ${msg.sender === 'admin' ? 'text-rose-400' : 'text-indigo-400'}`}>
                              {msg.sender === 'admin' ? 'Admin' : ticket.user}
                            </span>
                            <span className="text-[10px] text-slate-600 font-dm">{msg.time}</span>
                          </div>
                          <div className={`px-3.5 py-2.5 rounded-xl text-sm font-dm leading-relaxed ${
                            msg.sender === 'admin'
                              ? 'bg-rose-500/10 border border-rose-500/15 text-slate-300 ml-auto'
                              : 'bg-white/5 border border-white/8 text-slate-300'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Reply + Actions */}
                  <div className="px-5 pb-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className="text-xs text-slate-500 font-dm flex items-center gap-1">
                        <Tag className="w-3 h-3" /> Set status:
                      </span>
                      {(['open', 'in_progress', 'resolved', 'closed'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => updateStatus(ticket.id, s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-dm border transition-colors capitalize ${
                            ticket.status === s
                              ? `${statusConfig[s].bg} ${statusConfig[s].color}`
                              : 'text-slate-500 border-white/10 hover:border-white/20 hover:text-slate-300'
                          }`}
                        >
                          {s.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendReply(ticket.id)}
                        placeholder="Write a reply…"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200 placeholder-slate-600 text-sm font-dm focus:outline-none focus:border-rose-500/40 transition-colors"
                      />
                      <button
                        onClick={() => sendReply(ticket.id)}
                        disabled={!reply.trim()}
                        className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-dm transition-colors flex items-center gap-2"
                      >
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
          <div className="glass-card rounded-xl py-16 text-center">
            <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-500 font-dm">No tickets match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
