import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const rows: Record<string, string>[] = body.rows || []
  if (!rows.length) return NextResponse.json({ error: 'No data provided' }, { status: 400 })

  let imported = 0,
    skipped = 0
  for (const row of rows) {
    if (!row.name) {
      skipped++
      continue
    }
    try {
      await query(
        `INSERT INTO products (user_id, name, sku, category, sub_category, description, mrp, selling_price, purchase_price, stock, amazon_link, flipkart_link, etsy_link, meesho_link, weight, hsn_code, seo_keywords)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
         ON CONFLICT DO NOTHING`,
        [
          userId,
          row.name,
          row.sku || null,
          row.category || null,
          row.sub_category || null,
          row.description || null,
          parseFloat(row.mrp) || null,
          parseFloat(row.selling_price) || null,
          parseFloat(row.purchase_price) || null,
          parseInt(row.stock) || 0,
          row.amazon_link || null,
          row.flipkart_link || null,
          row.etsy_link || null,
          row.meesho_link || null,
          parseFloat(row.weight) || null,
          row.hsn_code || null,
          row.seo_keywords || null,
        ]
      )
      imported++
    } catch {
      skipped++
    }
  }

  return NextResponse.json({ imported, skipped, total: rows.length })
}
