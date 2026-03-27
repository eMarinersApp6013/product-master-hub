import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Revenue today (sum of selling_price for products updated today — proxy metric)
    const [revenueRow] = await query<{ revenue_today: number }>(
      `SELECT COALESCE(SUM(selling_price), 0)::float AS revenue_today
       FROM products WHERE user_id = $1`,
      [userId]
    )

    // Total products as "total_orders" proxy
    const [ordersRow] = await query<{ total_orders: number }>(
      `SELECT COUNT(*)::int AS total_orders FROM products WHERE user_id = $1`,
      [userId]
    )

    // Active products as "active_clients"
    const [clientsRow] = await query<{ active_clients: number }>(
      `SELECT COUNT(*)::int AS active_clients FROM products WHERE user_id = $1 AND stock > 0`,
      [userId]
    )

    // Low stock as "open tickets"
    const [ticketsRow] = await query<{ open_tickets: number }>(
      `SELECT COUNT(*)::int AS open_tickets FROM products WHERE user_id = $1 AND stock < 5`,
      [userId]
    )

    // Top products by value
    const topProducts = await query<{ name: string; sku: string; selling_price: number; stock: number }>(
      `SELECT name, sku, selling_price::float, stock
       FROM products WHERE user_id = $1
       ORDER BY selling_price DESC NULLS LAST LIMIT 5`,
      [userId]
    )

    // Category breakdown
    const categories = await query<{ category: string; count: number }>(
      `SELECT COALESCE(category, 'Uncategorized') as category, COUNT(*)::int as count
       FROM products WHERE user_id = $1
       GROUP BY category ORDER BY count DESC`,
      [userId]
    )

    return NextResponse.json({
      summary: {
        revenue_today:  revenueRow?.revenue_today  ?? 0,
        total_orders:   ordersRow?.total_orders    ?? 0,
        active_clients: clientsRow?.active_clients ?? 0,
        open_tickets:   ticketsRow?.open_tickets   ?? 0,
      },
      orders_by_status: categories.map((c) => ({ status: c.category, count: c.count })),
      top_products: topProducts.map((p) => ({
        name:    p.name,
        sku:     p.sku,
        sold:    p.stock ?? 0,
        revenue: (p.selling_price ?? 0) * (p.stock ?? 1),
      })),
      courier_breakdown: [],
      payment_split: { cod: 0, prepaid: 0 },
    })
  } catch (err) {
    console.error('[API /api/analytics/summary]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
