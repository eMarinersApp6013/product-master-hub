import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id     VARCHAR(255) PRIMARY KEY,
      store_name  VARCHAR(500),
      gst_number  VARCHAR(50),
      email       VARCHAR(255),
      phone       VARCHAR(50),
      address     TEXT,
      plan        VARCHAR(50) NOT NULL DEFAULT 'free',
      ai_credits  INTEGER NOT NULL DEFAULT 100,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const profile = await queryOne('SELECT * FROM user_profiles WHERE user_id = $1', [userId])
  if (!profile) {
    // Create blank profile on first access
    const newProfile = await queryOne(
      `INSERT INTO user_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW() RETURNING *`,
      [userId]
    )
    return NextResponse.json(newProfile)
  }
  return NextResponse.json(profile)
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const { store_name, gst_number, email, phone, address } = await request.json()

  const profile = await queryOne(
    `INSERT INTO user_profiles (user_id, store_name, gst_number, email, phone, address)
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (user_id) DO UPDATE SET
       store_name = COALESCE(EXCLUDED.store_name, user_profiles.store_name),
       gst_number = COALESCE(EXCLUDED.gst_number, user_profiles.gst_number),
       email      = COALESCE(EXCLUDED.email,      user_profiles.email),
       phone      = COALESCE(EXCLUDED.phone,      user_profiles.phone),
       address    = COALESCE(EXCLUDED.address,    user_profiles.address),
       updated_at = NOW()
     RETURNING *`,
    [userId, store_name ?? null, gst_number ?? null, email ?? null, phone ?? null, address ?? null]
  )
  return NextResponse.json(profile)
}
