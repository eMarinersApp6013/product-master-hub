import { NextRequest, NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  await queryOne(
    'UPDATE store_pages SET visits = visits + 1 WHERE id = $1 RETURNING visits',
    [params.id]
  )
  return NextResponse.json({ ok: true })
}
