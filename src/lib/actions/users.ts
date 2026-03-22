'use server'

import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'
import type { User, DashboardStats } from '@/lib/types'

/** Upsert a user row from Clerk data. Call on first page load. */
export async function upsertUser(email: string, storeName?: string): Promise<User | null> {
  const { userId } = auth()
  if (!userId) return null

  return queryOne<User>(
    `INSERT INTO users (clerk_id, email, store_name, plan, ai_count)
     VALUES ($1, $2, $3, 'free', 0)
     ON CONFLICT (clerk_id) DO UPDATE
       SET email      = EXCLUDED.email,
           store_name = COALESCE(EXCLUDED.store_name, users.store_name)
     RETURNING *`,
    [userId, email, storeName ?? null]
  )
}

/** Get the current user row. */
export async function getUser(): Promise<User | null> {
  const { userId } = auth()
  if (!userId) return null
  return queryOne<User>('SELECT * FROM users WHERE clerk_id = $1', [userId])
}

/** Real stats for the dashboard. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const { userId } = auth()
  if (!userId) return { total_products: 0, total_revenue: 0, low_stock: 0, ai_calls_month: 0 }

  const [row] = await query<DashboardStats>(
    `SELECT
       COUNT(p.id)::int                                          AS total_products,
       COALESCE(SUM(p.selling_price::numeric), 0)::float        AS total_revenue,
       COUNT(CASE WHEN p.stock < 5 THEN 1 END)::int             AS low_stock,
       COALESCE((SELECT ai_count FROM users WHERE clerk_id=$1),0)::int AS ai_calls_month
     FROM products p
     WHERE p.user_id = $1`,
    [userId]
  )
  return row ?? { total_products: 0, total_revenue: 0, low_stock: 0, ai_calls_month: 0 }
}
