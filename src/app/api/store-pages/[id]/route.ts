import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const fields: string[] = []
  const values: unknown[] = []

  if (body.published !== undefined) { fields.push(`published = $${values.length + 1}`); values.push(body.published) }
  if (body.title)                   { fields.push(`title = $${values.length + 1}`);     values.push(body.title) }
  if (body.slug)                    { fields.push(`slug = $${values.length + 1}`);      values.push(body.slug) }
  if (!fields.length) return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })

  fields.push(`updated_at = NOW()`)
  values.push(params.id, userId)

  const page = await queryOne(
    `UPDATE store_pages SET ${fields.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`,
    values
  )
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ page })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await query('DELETE FROM store_pages WHERE id = $1 AND user_id = $2', [params.id, userId])
  return NextResponse.json({ success: true })
}
