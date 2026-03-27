import { NextResponse } from 'next/server'

export async function GET() {
  const headers = [
    'name', 'sku', 'category', 'sub_category', 'description',
    'mrp', 'selling_price', 'purchase_price', 'stock',
    'amazon_link', 'flipkart_link', 'etsy_link', 'meesho_link',
    'weight', 'hsn_code', 'seo_keywords',
  ]

  const examples = [
    [
      'Cotton Kurti Blue',
      'KRT-001',
      'Ethnic Wear',
      'Kurtis',
      'Beautiful cotton kurti in blue color. Suitable for casual and semi-formal occasions.',
      '799',
      '649',
      '320',
      '50',
      '', '', '', '',
      '0.3',
      '62114',
      'cotton kurti,blue kurti,women kurta,casual wear',
    ],
    [
      'Silk Saree Red',
      'SAR-002',
      'Ethnic Wear',
      'Sarees',
      'Pure silk saree with golden zari border. Perfect for weddings and festivals.',
      '3499',
      '2999',
      '1800',
      '20',
      '', '', '', '',
      '0.8',
      '50072',
      'silk saree,wedding saree,red saree,zari border',
    ],
  ]

  const csv = [
    headers.join(','),
    ...examples.map(row =>
      row.map(v => v.includes(',') || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v).join(',')
    ),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="productvault-import-template.csv"',
    },
  })
}
