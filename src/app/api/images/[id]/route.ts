import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { queryOne } from '@/lib/db'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const image = await queryOne<{ url: string }>(
    'DELETE FROM product_images WHERE id = $1 AND user_id = $2 RETURNING url',
    [params.id, userId]
  )

  if (image?.url?.startsWith('/uploads/')) {
    const filePath = join(process.cwd(), 'public', image.url)
    await unlink(filePath).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
