import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id           SERIAL PRIMARY KEY,
      user_id      VARCHAR(255) NOT NULL,
      product_id   INTEGER REFERENCES products(id) ON DELETE SET NULL,
      filename     VARCHAR(500) NOT NULL,
      url          VARCHAR(1000) NOT NULL,
      size_bytes   INTEGER,
      width        INTEGER,
      height       INTEGER,
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function GET() {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const images = await query(
    `SELECT pi.*, p.name as product_name
     FROM product_images pi
     LEFT JOIN products p ON p.id = pi.product_id
     WHERE pi.user_id = $1
     ORDER BY pi.created_at DESC
     LIMIT 100`,
    [userId]
  )
  return NextResponse.json({ images })
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await ensureTable()

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const productId = formData.get('product_id') as string | null

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.' }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large. Max 10MB.' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const ext = file.name.split('.').pop() || 'jpg'
  const safeName = `${userId}_${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, safeName), buffer)

  const url = `/uploads/products/${safeName}`
  const image = await queryOne(
    `INSERT INTO product_images (user_id, product_id, filename, url, size_bytes)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, productId ? parseInt(productId) : null, file.name, url, file.size]
  )

  return NextResponse.json({ image }, { status: 201 })
}
