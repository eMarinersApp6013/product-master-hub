import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

// Add combos table if not exists (auto-migrate)
async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS product_combos (
      id           SERIAL PRIMARY KEY,
      user_id      VARCHAR(255) NOT NULL,
      name         VARCHAR(500) NOT NULL,
      description  TEXT,
      discount_pct NUMERIC(5,2) DEFAULT 0,
      items        JSONB NOT NULL DEFAULT '[]',
      total_mrp    NUMERIC(12,2) DEFAULT 0,
      combo_price  NUMERIC(12,2) DEFAULT 0,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()
  const combos = await query('SELECT * FROM product_combos WHERE user_id = $1 ORDER BY created_at DESC', [userId])
  return NextResponse.json({ combos })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const { name, description, discount_pct, items, total_mrp, combo_price } = await request.json()
  if (!name || !items?.length) return NextResponse.json({ error: 'Name and items required' }, { status: 400 })

  const combo = await queryOne(
    `INSERT INTO product_combos (user_id, name, description, discount_pct, items, total_mrp, combo_price)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [userId, name, description ?? null, discount_pct ?? 0, JSON.stringify(items), total_mrp ?? 0, combo_price ?? 0]
  )
  return NextResponse.json({ combo }, { status: 201 })
}
