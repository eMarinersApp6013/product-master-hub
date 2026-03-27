import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS store_pages (
      id         SERIAL PRIMARY KEY,
      user_id    VARCHAR(255) NOT NULL,
      title      VARCHAR(500) NOT NULL,
      slug       VARCHAR(255) NOT NULL,
      template   VARCHAR(50) NOT NULL DEFAULT 'catalog',
      published  BOOLEAN NOT NULL DEFAULT true,
      visits     INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, slug)
    )
  `)
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()
  const pages = await query(
    'SELECT * FROM store_pages WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  )
  return NextResponse.json({ pages })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const { title, slug, template, published } = await request.json()
  if (!title || !slug) return NextResponse.json({ error: 'Title and slug required' }, { status: 400 })

  // Check slug uniqueness
  const existing = await queryOne(
    'SELECT id FROM store_pages WHERE user_id = $1 AND slug = $2',
    [userId, slug]
  )
  if (existing) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 })

  const page = await queryOne(
    `INSERT INTO store_pages (user_id, title, slug, template, published)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, title, slug, template || 'catalog', published ?? true]
  )
  return NextResponse.json({ page }, { status: 201 })
}
