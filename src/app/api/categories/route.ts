import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id          SERIAL PRIMARY KEY,
      user_id     VARCHAR(255) NOT NULL,
      name        VARCHAR(255) NOT NULL,
      slug        VARCHAR(255) NOT NULL,
      color       VARCHAR(20) NOT NULL DEFAULT '#6366F1',
      icon        VARCHAR(50),
      description TEXT,
      parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      sort_order  INTEGER NOT NULL DEFAULT 0,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, slug)
    )
  `)
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()
  const cats = await query(
    `SELECT c.*, COUNT(p.id)::int AS product_count
     FROM categories c
     LEFT JOIN products p ON p.user_id = c.user_id AND p.category = c.name
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.sort_order, c.name`,
    [userId]
  )
  return NextResponse.json({ categories: cats })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()
  const { name, color, description, parent_id } = await request.json()
  if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const cat = await queryOne(
    `INSERT INTO categories (user_id, name, slug, color, description, parent_id)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id, slug) DO UPDATE SET name=EXCLUDED.name, color=EXCLUDED.color, description=EXCLUDED.description
     RETURNING *`,
    [userId, name, slug, color || '#6366F1', description || null, parent_id || null]
  )
  return NextResponse.json({ category: cat }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  await query('DELETE FROM categories WHERE id = $1 AND user_id = $2', [id, userId])
  return NextResponse.json({ success: true })
}
