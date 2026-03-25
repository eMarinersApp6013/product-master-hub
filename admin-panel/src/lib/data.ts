// ── Shared mock data used across pages ──────────────────────

export type Plan = 'Free' | 'Starter' | 'Pro' | 'Enterprise'
export type UserStatus = 'active' | 'warned' | 'banned'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface AppUser {
  id: number
  name: string
  email: string
  plan: Plan
  status: UserStatus
  joined: string
  aiUsage: number
  products: number
  location: string
  revenue: number
}

export interface Ticket {
  id: string
  subject: string
  user: string
  email: string
  plan: Plan
  priority: TicketPriority
  status: TicketStatus
  category: string
  created: string
  updated: string
  messages: { sender: 'user' | 'admin'; text: string; time: string }[]
}

export const USERS: AppUser[] = [
  { id: 1,  name: 'Priya Sharma',   email: 'priya@example.com',   plan: 'Pro',        status: 'active', joined: 'Jan 4, 2026',  aiUsage: 8420,  products: 312,  location: 'Mumbai',    revenue: 799 },
  { id: 2,  name: 'Rahul Gupta',    email: 'rahul@example.com',   plan: 'Starter',    status: 'active', joined: 'Jan 9, 2026',  aiUsage: 2140,  products: 87,   location: 'Delhi',     revenue: 299 },
  { id: 3,  name: 'Anita Patel',    email: 'anita@example.com',   plan: 'Free',       status: 'active', joined: 'Jan 14, 2026', aiUsage: 180,   products: 11,   location: 'Ahmedabad', revenue: 0   },
  { id: 4,  name: 'Vikram Singh',   email: 'vikram@example.com',  plan: 'Enterprise', status: 'active', joined: 'Dec 22, 2025', aiUsage: 21800, products: 1240, location: 'Bangalore', revenue: 1999},
  { id: 5,  name: 'Deepika Rao',    email: 'deepika@example.com', plan: 'Free',       status: 'warned', joined: 'Jan 3, 2026',  aiUsage: 92,    products: 4,    location: 'Chennai',   revenue: 0   },
  { id: 6,  name: 'Karan Mehta',    email: 'karan@example.com',   plan: 'Pro',        status: 'active', joined: 'Dec 18, 2025', aiUsage: 9100,  products: 421,  location: 'Pune',      revenue: 799 },
  { id: 7,  name: 'Sunita Verma',   email: 'sunita@example.com',  plan: 'Starter',    status: 'banned', joined: 'Nov 30, 2025', aiUsage: 0,     products: 0,    location: 'Jaipur',    revenue: 0   },
  { id: 8,  name: 'Arjun Nair',     email: 'arjun@example.com',   plan: 'Enterprise', status: 'active', joined: 'Dec 5, 2025',  aiUsage: 31200, products: 2100, location: 'Kochi',     revenue: 1999},
  { id: 9,  name: 'Meena Iyer',     email: 'meena@example.com',   plan: 'Pro',        status: 'active', joined: 'Jan 1, 2026',  aiUsage: 6800,  products: 198,  location: 'Hyderabad', revenue: 799 },
  { id: 10, name: 'Sanjay Joshi',   email: 'sanjay@example.com',  plan: 'Free',       status: 'active', joined: 'Jan 18, 2026', aiUsage: 340,   products: 22,   location: 'Nagpur',    revenue: 0   },
  { id: 11, name: 'Pooja Desai',    email: 'pooja@example.com',   plan: 'Starter',    status: 'active', joined: 'Jan 12, 2026', aiUsage: 1820,  products: 63,   location: 'Surat',     revenue: 299 },
  { id: 12, name: 'Amit Kumar',     email: 'amit@example.com',    plan: 'Free',       status: 'warned', joined: 'Dec 28, 2025', aiUsage: 0,     products: 8,    location: 'Lucknow',   revenue: 0   },
]

export const WEEKLY_AI = [
  { day: 'Mon', listings: 8200, scraper: 4100, images: 3800, pdf: 2300 },
  { day: 'Tue', listings: 9800, scraper: 5200, images: 4400, pdf: 2700 },
  { day: 'Wed', listings: 8900, scraper: 4600, images: 3900, pdf: 2400 },
  { day: 'Thu', listings: 10800,scraper: 5900, images: 4700, pdf: 2900 },
  { day: 'Fri', listings: 9600, scraper: 5100, images: 4200, pdf: 2700 },
  { day: 'Sat', listings: 11700,scraper: 6300, images: 5100, pdf: 3300 },
  { day: 'Sun', listings: 11000,scraper: 5900, images: 4800, pdf: 3171 },
]

export const MONTHLY_REVENUE = [
  { month: 'Aug', mrr: 184200 },
  { month: 'Sep', mrr: 211400 },
  { month: 'Oct', mrr: 238700 },
  { month: 'Nov', mrr: 261000 },
  { month: 'Dec', mrr: 312500 },
  { month: 'Jan', mrr: 348900 },
  { month: 'Feb', mrr: 362100 },
  { month: 'Mar', mrr: 384200 },
]

export const TICKETS: Ticket[] = [
  {
    id: 'TKT-001', subject: 'AI listing generator giving wrong language output',
    user: 'Vikram Singh', email: 'vikram@example.com', plan: 'Enterprise',
    priority: 'high', status: 'open', category: 'AI Feature',
    created: 'Mar 22, 2026 9:12 AM', updated: '10 min ago',
    messages: [
      { sender: 'user', text: 'The AI listing generator is producing Hindi output even when I set language to English.', time: '9:12 AM' },
      { sender: 'admin', text: "We've reproduced this and our team is on it. Can you share the product URL?", time: '9:45 AM' },
    ],
  },
  {
    id: 'TKT-002', subject: 'Unable to download PDF catalog — getting 500 error',
    user: 'Priya Sharma', email: 'priya@example.com', plan: 'Pro',
    priority: 'medium', status: 'in_progress', category: 'PDF Catalog',
    created: 'Mar 21, 2026 4:30 PM', updated: '2 hr ago',
    messages: [
      { sender: 'user', text: 'Every time I try to download my PDF catalog it shows a 500 internal server error.', time: '4:30 PM' },
      { sender: 'admin', text: "We're investigating the PDF generation service. A fix is being deployed shortly.", time: '5:15 PM' },
    ],
  },
  {
    id: 'TKT-003', subject: 'Billing question — charged twice this month',
    user: 'Rahul Gupta', email: 'rahul@example.com', plan: 'Starter',
    priority: 'critical', status: 'open', category: 'Billing',
    created: 'Mar 22, 2026 11:00 AM', updated: '5 min ago',
    messages: [
      { sender: 'user', text: 'I see two charges on my credit card for ₹299 this month. Please refund the duplicate.', time: '11:00 AM' },
    ],
  },
  {
    id: 'TKT-004', subject: 'Scraper not working on Meesho product pages',
    user: 'Karan Mehta', email: 'karan@example.com', plan: 'Pro',
    priority: 'medium', status: 'in_progress', category: 'Scraper',
    created: 'Mar 20, 2026 2:00 PM', updated: '1 day ago',
    messages: [
      { sender: 'user', text: 'Meesho product scraper stopped working 2 days ago. It shows "Failed to fetch" every time.', time: '2:00 PM' },
      { sender: 'admin', text: 'Meesho updated their page structure. Our scraper is being updated. ETA: 24 hours.', time: '3:30 PM' },
    ],
  },
  {
    id: 'TKT-005', subject: 'How do I create a store page for WhatsApp catalogue?',
    user: 'Anita Patel', email: 'anita@example.com', plan: 'Free',
    priority: 'low', status: 'resolved', category: 'How-To',
    created: 'Mar 19, 2026 10:00 AM', updated: '2 days ago',
    messages: [
      { sender: 'user', text: 'Can you guide me on how to create a store page to share on WhatsApp?', time: '10:00 AM' },
      { sender: 'admin', text: 'Hi Anita! Go to Store Pages → New Page → choose the WhatsApp template.', time: '10:45 AM' },
    ],
  },
]

export const PLAN_CONFIG = {
  Free:       { color: '#64748B', users: 612,  price: 0,    mrr: 0      },
  Starter:    { color: '#6366F1', users: 341,  price: 299,  mrr: 101859 },
  Pro:        { color: '#10B981', users: 218,  price: 799,  mrr: 174182 },
  Enterprise: { color: '#F59E0B', users: 113,  price: 1999, mrr: 225887 },
}
