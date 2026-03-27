import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const title    = searchParams.get('title')    || 'Product Catalog'
  const category = searchParams.get('category') || ''
  const template = searchParams.get('template') || 'modern'

  const params: unknown[] = [userId]
  let where = 'WHERE p.user_id = $1'
  if (category) { params.push(category); where += ` AND p.category = $${params.length}` }

  const products = await query<{
    name: string; sku?: string; category?: string; description?: string
    mrp?: number; selling_price?: number; stock?: number
  }>(
    `SELECT name, sku, category, description, mrp, selling_price, stock FROM products p ${where} ORDER BY created_at DESC LIMIT 100`,
    params
  )

  // Generate HTML catalog and return as PDF via html-to-pdf or plain HTML
  // Since pdfkit is available, generate a proper PDF
  const PDFDocument = (await import('pdfkit')).default

  const doc = new PDFDocument({ margin: 40, size: 'A4', autoFirstPage: true })

  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  const templateColors: Record<string, { bg: string; header: string; accent: string; text: string }> = {
    modern:   { bg: '#FFFFFF', header: '#1a1a2e', accent: '#6366F1', text: '#1a202c' },
    elegant:  { bg: '#1a1a2e', header: '#0f0f1e', accent: '#C9A84C', text: '#e2e8f0' },
    minimal:  { bg: '#FAFAFA', header: '#374151', accent: '#10B981', text: '#111827' },
    festive:  { bg: '#FFF9F0', header: '#C53030', accent: '#F59E0B', text: '#1a202c' },
  }
  const colors = templateColors[template] || templateColors.modern

  // Cover page
  doc.rect(0, 0, 595, 842).fill(colors.header)
  doc.fillColor(colors.accent).fontSize(36).font('Helvetica-Bold')
     .text(title, 40, 300, { align: 'center', width: 515 })
  doc.fillColor(colors.bg).fontSize(14).font('Helvetica')
     .text(`${products.length} Products`, 40, 360, { align: 'center', width: 515 })
  doc.fillColor(colors.bg).fontSize(10)
     .text(`Generated on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, 40, 800, { align: 'center', width: 515 })

  // Products
  const perPage = template === 'minimal' ? 6 : template === 'elegant' ? 2 : 4
  const cols = template === 'minimal' ? 3 : 2
  const colW = 515 / cols
  const rowH = template === 'minimal' ? 120 : 180

  let x = 40, y = 80, count = 0

  for (const prod of products) {
    if (count % perPage === 0) {
      doc.addPage()
      doc.rect(0, 0, 595, 842).fill(colors.bg)
      // Page header
      doc.rect(0, 0, 595, 50).fill(colors.header)
      doc.fillColor(colors.accent).fontSize(10).font('Helvetica-Bold')
         .text(title, 40, 17, { width: 515, align: 'center' })
      x = 40; y = 70
    }

    const col = count % cols
    const px  = 40 + col * colW
    const py  = y

    // Product card
    doc.rect(px + 2, py + 2, colW - 10, rowH - 10).fill(colors.header === colors.bg ? '#F7FAFC' : colors.header)
    doc.fillColor(colors.accent).fontSize(11).font('Helvetica-Bold')
       .text(prod.name || 'Product', px + 8, py + 10, { width: colW - 20 })
    doc.fillColor(template === 'elegant' ? '#a0aec0' : '#718096').fontSize(8).font('Helvetica')
    if (prod.sku)      doc.text(`SKU: ${prod.sku}`,          px + 8, py + 28, { width: colW - 20 })
    if (prod.category) doc.text(`Category: ${prod.category}`, px + 8, py + 40, { width: colW - 20 })
    if (prod.description) {
      doc.text(prod.description.slice(0, 80) + (prod.description.length > 80 ? '…' : ''), px + 8, py + 54, { width: colW - 20 })
    }
    // Price
    if (prod.selling_price || prod.mrp) {
      doc.fillColor(colors.accent).fontSize(13).font('Helvetica-Bold')
         .text(`₹${Number(prod.selling_price || prod.mrp).toLocaleString('en-IN')}`, px + 8, py + rowH - 35)
      if (prod.mrp && prod.selling_price && prod.mrp > prod.selling_price) {
        doc.fillColor('#a0aec0').fontSize(9).font('Helvetica')
           .text(`MRP: ₹${Number(prod.mrp).toLocaleString('en-IN')}`, px + 80, py + rowH - 32)
      }
    }
    if (prod.stock !== undefined && prod.stock !== null) {
      doc.fillColor(prod.stock > 0 ? '#10B981' : '#EF4444').fontSize(8).font('Helvetica')
         .text(prod.stock > 0 ? `In Stock (${prod.stock})` : 'Out of Stock', px + 8, py + rowH - 18)
    }

    if ((count + 1) % cols === 0) y += rowH
    count++
  }

  if (products.length === 0) {
    doc.addPage()
    doc.fillColor(colors.text).fontSize(16).font('Helvetica')
       .text('No products found. Add products to your catalog first.', 40, 400, { align: 'center', width: 515 })
  }

  doc.end()

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(title)}.pdf"`,
    },
  })
}
