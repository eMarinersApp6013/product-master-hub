import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query, queryOne } from '@/lib/db'

// GET /api/products/:id
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const product = await queryOne(
      `SELECT p.*,
              COALESCE(
                JSON_AGG(DISTINCT pl.platform_name) FILTER (WHERE pl.platform_name IS NOT NULL),
                '[]'
              ) AS platforms,
              COALESCE(
                JSON_AGG(DISTINCT ROW_TO_JSON(pi.*)) FILTER (WHERE pi.id IS NOT NULL),
                '[]'
              ) AS images
       FROM products p
       LEFT JOIN product_platforms pl ON pl.product_id = p.id
       LEFT JOIN product_images pi ON pi.product_id = p.id
       WHERE p.id = $1 AND p.user_id = $2
       GROUP BY p.id`,
      [params.id, userId]
    )

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/products/:id
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const allowedFields = [
      'name', 'sku', 'category', 'sub_category', 'description',
      'mrp', 'selling_price', 'purchase_price', 'wholesale_price',
      'weight', 'dimensions', 'seo_keywords', 'hsn_code', 'stock',
      'amazon_link', 'flipkart_link', 'etsy_link', 'meesho_link',
    ]

    const updates: string[] = []
    const values: unknown[] = []

    for (const field of allowedFields) {
      if (field in body) {
        values.push(body[field])
        updates.push(`${field} = $${values.length}`)
      }
    }

    if (!updates.length) return NextResponse.json({ error: 'No fields to update' }, { status: 400 })

    values.push(params.id, userId)
    const product = await queryOne(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`,
      values
    )

    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Update platforms if provided
    if (body.platforms !== undefined) {
      await query('DELETE FROM product_platforms WHERE product_id = $1', [params.id])
      for (const platform of (body.platforms as string[])) {
        await query(
          'INSERT INTO product_platforms (product_id, platform_name) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [params.id, platform]
        )
      }
    }

    return NextResponse.json({ product })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/products/:id
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await query('DELETE FROM products WHERE id = $1 AND user_id = $2', [params.id, userId])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
