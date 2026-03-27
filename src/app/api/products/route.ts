import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

// GET /api/products - list products with pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const search   = searchParams.get('search')   || ''
    const category = searchParams.get('category') || ''
    const page     = parseInt(searchParams.get('page')  || '1')
    const limit    = parseInt(searchParams.get('limit') || '20')
    const offset   = (page - 1) * limit

    const params: unknown[] = [userId]
    const conditions: string[] = ['p.user_id = $1']

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`(p.name ILIKE $${params.length} OR p.sku ILIKE $${params.length})`)
    }
    if (category) {
      params.push(category)
      conditions.push(`p.category = $${params.length}`)
    }

    const where = conditions.join(' AND ')

    const products = await query(
      `SELECT p.*,
              COALESCE(
                JSON_AGG(DISTINCT pl.platform_name) FILTER (WHERE pl.platform_name IS NOT NULL),
                '[]'
              ) AS platforms
       FROM products p
       LEFT JOIN product_platforms pl ON pl.product_id = p.id
       WHERE ${where}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    )

    const [countRow] = await query<{ count: number }>(
      `SELECT COUNT(*)::int AS count FROM products p WHERE ${where}`,
      params
    )

    return NextResponse.json({
      products,
      total: countRow?.count ?? 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/products - create product
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Ensure user exists in our DB
    await query(
      `INSERT INTO users (clerk_id, email, store_name, plan, ai_count)
       VALUES ($1, '', '', 'free', 0)
       ON CONFLICT (clerk_id) DO NOTHING`,
      [userId]
    )

    const body = await request.json()
    const {
      name, sku, category, sub_category, description,
      mrp, selling_price, purchase_price, wholesale_price,
      weight, dimensions, seo_keywords, hsn_code, stock,
      amazon_link, flipkart_link, etsy_link, meesho_link,
      platforms = [],
    } = body

    const product = await queryOne<{ id: number }>(
      `INSERT INTO products (
        user_id, name, sku, category, sub_category, description,
        mrp, selling_price, purchase_price, wholesale_price,
        weight, dimensions, seo_keywords, hsn_code, stock,
        amazon_link, flipkart_link, etsy_link, meesho_link
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING *`,
      [userId, name, sku, category, sub_category, description,
       mrp, selling_price, purchase_price, wholesale_price,
       weight, dimensions, seo_keywords, hsn_code, stock ?? 0,
       amazon_link, flipkart_link, etsy_link, meesho_link]
    )

    if (product && platforms.length > 0) {
      for (const platform of platforms) {
        await query(
          'INSERT INTO product_platforms (product_id, platform_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [product.id, platform]
        )
      }
    }

    return NextResponse.json({ product }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/products]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
