import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { queryOne, query } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

function resolveUrl(raw: string): string {
  // Google Drive: convert share link to direct download
  // https://drive.google.com/file/d/FILE_ID/view → https://drive.google.com/uc?export=download&id=FILE_ID
  const gdrive = raw.match(/drive\.google\.com\/file\/d\/([^\/\?]+)/)
  if (gdrive) return `https://drive.google.com/uc?export=download&id=${gdrive[1]}`

  // Google Drive folder link (open?id=...)
  const gdriveOpen = raw.match(/drive\.google\.com\/open\?id=([^&]+)/)
  if (gdriveOpen) return `https://drive.google.com/uc?export=download&id=${gdriveOpen[1]}`

  // Dropbox: ?dl=0 → ?dl=1
  if (raw.includes('dropbox.com')) return raw.replace('?dl=0', '?dl=1').replace('www.dropbox.com', 'dl.dropboxusercontent.com')

  // OneDrive: embed link → download
  if (raw.includes('1drv.ms') || raw.includes('onedrive.live.com')) {
    // Best effort: add download=1
    if (raw.includes('?')) return raw + '&download=1'
    return raw + '?download=1'
  }

  // Box: /s/ share link → /shared/static/
  // box.com/s/xxx → keep as-is, attempt direct fetch

  return raw
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url, product_id } = await request.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  let resolvedUrl: string
  try { resolvedUrl = resolveUrl(url.trim()) } catch { resolvedUrl = url.trim() }

  const res = await fetch(resolvedUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ProductVault/1.0)' },
    redirect: 'follow',
  })

  if (!res.ok) return NextResponse.json({ error: `Failed to fetch image: HTTP ${res.status}` }, { status: 400 })

  const contentType = res.headers.get('content-type') || 'image/jpeg'
  if (!contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
    return NextResponse.json({ error: 'URL does not point to an image file' }, { status: 400 })
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  if (buffer.length > 15 * 1024 * 1024) return NextResponse.json({ error: 'Image too large (max 15MB)' }, { status: 400 })

  const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg'
  const safeName = `${userId}_${Date.now()}_url.${ext}`
  const uploadDir = join(process.cwd(), 'public', 'uploads', 'products')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, safeName), buffer)

  // Ensure table
  await query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id SERIAL PRIMARY KEY, user_id VARCHAR(255) NOT NULL,
      product_id INTEGER, filename VARCHAR(500) NOT NULL,
      url VARCHAR(1000) NOT NULL, size_bytes INTEGER,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  const imageUrl = `/uploads/products/${safeName}`
  const image = await queryOne(
    `INSERT INTO product_images (user_id, product_id, filename, url, size_bytes)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [userId, product_id || null, safeName, imageUrl, buffer.length]
  )
  return NextResponse.json({ image }, { status: 201 })
}
