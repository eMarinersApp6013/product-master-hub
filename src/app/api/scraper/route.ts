import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { url } = await request.json()
  if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 })

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Use OpenAI to extract product details from the URL
  // Since we can't actually browse URLs in this API, we use AI to parse the URL structure
  // and extract whatever product info we can, then suggest the user verify
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `You are a product data extraction assistant. Given a product URL, extract and infer product information.
Return ONLY a valid JSON object with these fields (use null for unknown):
{
  "name": "product name",
  "category": "category",
  "description": "brief description",
  "mrp": number or null,
  "selling_price": number or null,
  "sku": "SKU if visible in URL or null",
  "platform_source": "Amazon/Flipkart/Meesho/Etsy/Other"
}
Do not return anything except the JSON object.`
      },
      {
        role: 'user',
        content: `Extract product information from this URL: ${url}\n\nNote: Infer what you can from the URL structure, product ID, and domain.`
      }
    ],
    max_tokens: 300,
    response_format: { type: 'json_object' },
  })

  let product: Record<string, unknown> = {}
  try {
    const text = completion.choices[0]?.message?.content || '{}'
    product = JSON.parse(text)
  } catch {
    product = { name: 'Unknown Product', description: 'Could not extract details', platform_source: 'Unknown' }
  }

  // Remove null values
  Object.keys(product).forEach(k => { if (product[k] === null) delete product[k] })

  return NextResponse.json({ product, url })
}
