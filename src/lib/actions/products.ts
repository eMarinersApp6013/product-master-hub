'use server'

import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { query, queryOne } from '@/lib/db'
import type { Product } from '@/lib/types'

// ──────────────────────────────────────────────────────────────
// READ
// ──────────────────────────────────────────────────────────────

export async function getProducts(opts?: {
  search?: string
  category?: string
  platform?: string
  limit?: number
  offset?: number
}): Promise<{ products: Product[]; total: number }> {
  const { userId } = auth()
  if (!userId) return { products: [], total: 0 }

  const { search = '', category = '', platform = '', limit = 50, offset = 0 } = opts ?? {}

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

  let platformJoin = ''
  if (platform) {
    params.push(platform)
    platformJoin = `JOIN product_platforms pp ON pp.product_id = p.id AND pp.platform_name = $${params.length}`
  }

  const where = conditions.join(' AND ')

  const products = await query<Product>(
    `SELECT p.*,
            COALESCE(
              JSON_AGG(DISTINCT pl.platform_name) FILTER (WHERE pl.platform_name IS NOT NULL),
              '[]'
            ) AS platforms
     FROM products p
     ${platformJoin}
     LEFT JOIN product_platforms pl ON pl.product_id = p.id
     WHERE ${where}
     GROUP BY p.id
     ORDER BY p.created_at DESC
     LIMIT $${params.push(limit)} OFFSET $${params.push(offset)}`,
    params
  )

  const [{ count }] = await query<{ count: string }>(
    `SELECT COUNT(DISTINCT p.id)::text AS count
     FROM products p ${platformJoin}
     WHERE ${where}`,
    params.slice(0, params.length - 2)
  )

  return { products, total: Number(count) }
}

export async function getProduct(id: number): Promise<Product | null> {
  const { userId } = auth()
  if (!userId) return null

  return queryOne<Product>(
    `SELECT p.*,
            COALESCE(
              JSON_AGG(DISTINCT pl.platform_name) FILTER (WHERE pl.platform_name IS NOT NULL),
              '[]'
            ) AS platforms
     FROM products p
     LEFT JOIN product_platforms pl ON pl.product_id = p.id
     WHERE p.id = $1 AND p.user_id = $2
     GROUP BY p.id`,
    [id, userId]
  )
}

// ──────────────────────────────────────────────────────────────
// CREATE
// ──────────────────────────────────────────────────────────────

export type CreateProductInput = {
  name: string
  description?: string
  sku?: string
  category?: string
  sub_category?: string
  mrp?: number
  selling_price?: number
  purchase_price?: number
  wholesale_price?: number
  weight?: number
  dimensions?: string
  seo_keywords?: string
  hsn_code?: string
  stock?: number
  amazon_link?: string
  flipkart_link?: string
  etsy_link?: string
  meesho_link?: string
  platforms?: string[]
}

export async function createProduct(
  input: CreateProductInput
): Promise<{ success: boolean; product?: Product; error?: string }> {
  const { userId } = auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  try {
    const product = await queryOne<Product>(
      `INSERT INTO products (
         user_id, name, description, sku, category, sub_category,
         mrp, selling_price, purchase_price, wholesale_price,
         weight, dimensions, seo_keywords, hsn_code, stock,
         amazon_link, flipkart_link, etsy_link, meesho_link
       ) VALUES (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
       ) RETURNING *`,
      [
        userId,
        input.name,
        input.description ?? null,
        input.sku ?? null,
        input.category ?? null,
        input.sub_category ?? null,
        input.mrp ?? null,
        input.selling_price ?? null,
        input.purchase_price ?? null,
        input.wholesale_price ?? null,
        input.weight ?? null,
        input.dimensions ?? null,
        input.seo_keywords ?? null,
        input.hsn_code ?? null,
        input.stock ?? 0,
        input.amazon_link ?? null,
        input.flipkart_link ?? null,
        input.etsy_link ?? null,
        input.meesho_link ?? null,
      ]
    )

    if (!product) throw new Error('Insert returned nothing')

    // Insert platform links
    if (input.platforms?.length) {
      for (const platform of input.platforms) {
        await query(
          `INSERT INTO product_platforms (product_id, platform_name) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [product.id, platform]
        )
      }
    }

    revalidatePath('/products')
    return { success: true, product }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

// ──────────────────────────────────────────────────────────────
// UPDATE
// ──────────────────────────────────────────────────────────────

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
): Promise<{ success: boolean; error?: string }> {
  const { userId } = auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  const fields = Object.entries(input).filter(
    ([k, v]) => k !== 'platforms' && v !== undefined
  )
  if (!fields.length) return { success: true }

  const setClauses = fields.map(([k], i) => `${k} = $${i + 2}`)
  const values = fields.map(([, v]) => v)

  await query(
    `UPDATE products SET ${setClauses.join(', ')} WHERE id = $1 AND user_id = $${values.length + 2}`,
    [id, ...values, userId]
  )

  if (input.platforms !== undefined) {
    await query('DELETE FROM product_platforms WHERE product_id = $1', [id])
    for (const p of input.platforms ?? []) {
      await query(
        'INSERT INTO product_platforms (product_id, platform_name) VALUES ($1,$2) ON CONFLICT DO NOTHING',
        [id, p]
      )
    }
  }

  revalidatePath('/products')
  return { success: true }
}

// ──────────────────────────────────────────────────────────────
// DELETE
// ──────────────────────────────────────────────────────────────

export async function deleteProduct(
  id: number
): Promise<{ success: boolean; error?: string }> {
  const { userId } = auth()
  if (!userId) return { success: false, error: 'Not authenticated' }

  await query('DELETE FROM products WHERE id = $1 AND user_id = $2', [id, userId])
  revalidatePath('/products')
  return { success: true }
}

// ──────────────────────────────────────────────────────────────
// CATEGORIES (for filter dropdowns)
// ──────────────────────────────────────────────────────────────

export async function getCategories(): Promise<string[]> {
  const { userId } = auth()
  if (!userId) return []
  const rows = await query<{ category: string }>(
    'SELECT DISTINCT category FROM products WHERE user_id = $1 AND category IS NOT NULL ORDER BY 1',
    [userId]
  )
  return rows.map((r) => r.category)
}
