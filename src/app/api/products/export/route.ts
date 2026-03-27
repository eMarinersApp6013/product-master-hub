import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const format = new URL(request.url).searchParams.get('format') || 'csv'

  const products = await query(
    `SELECT p.name, p.sku, p.category, p.sub_category, p.description,
            p.mrp, p.selling_price, p.purchase_price, p.stock,
            p.amazon_link, p.flipkart_link, p.etsy_link, p.meesho_link,
            p.weight, p.dimensions, p.hsn_code, p.seo_keywords, p.created_at
     FROM products p WHERE p.user_id = $1 ORDER BY p.created_at DESC`,
    [userId]
  )

  if (format === 'json') {
    return new NextResponse(JSON.stringify(products, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="products.json"',
      },
    })
  }

  // CSV
  const headers = [
    'name',
    'sku',
    'category',
    'sub_category',
    'description',
    'mrp',
    'selling_price',
    'purchase_price',
    'stock',
    'amazon_link',
    'flipkart_link',
    'etsy_link',
    'meesho_link',
    'weight',
    'dimensions',
    'hsn_code',
    'seo_keywords',
    'created_at',
  ]
  const csvRows = [
    headers.join(','),
    ...products.map((p) =>
      headers
        .map((h) => {
          const v = String((p as Record<string, unknown>)[h] ?? '')
          return v.includes(',') || v.includes('"') || v.includes('\n')
            ? `"${v.replace(/"/g, '""')}"`
            : v
        })
        .join(',')
    ),
  ]

  return new NextResponse(csvRows.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="products-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
