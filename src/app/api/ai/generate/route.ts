import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import OpenAI from 'openai'
import { query, queryOne } from '@/lib/db'

async function ensureProfileTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id     VARCHAR(255) PRIMARY KEY,
      store_name  VARCHAR(500),
      gst_number  VARCHAR(50),
      email       VARCHAR(255),
      phone       VARCHAR(50),
      address     TEXT,
      plan        VARCHAR(50) NOT NULL DEFAULT 'free',
      ai_credits  INTEGER NOT NULL DEFAULT 100,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

export async function POST(request: NextRequest) {
  const { userId } = auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { platform, productInput, features, tone } = await request.json()
  if (!productInput) return NextResponse.json({ error: 'Product input required' }, { status: 400 })

  await ensureProfileTable()

  // Get or create user profile
  let profile = await queryOne<{ ai_credits: number; plan: string }>(
    'SELECT ai_credits, plan FROM user_profiles WHERE user_id = $1',
    [userId]
  )
  if (!profile) {
    profile = await queryOne<{ ai_credits: number; plan: string }>(
      `INSERT INTO user_profiles (user_id) VALUES ($1) ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW() RETURNING ai_credits, plan`,
      [userId]
    )
  }

  const credits = profile?.ai_credits ?? 0
  if (credits <= 0) {
    return NextResponse.json({ error: 'AI credits exhausted. Upgrade plan.' }, { status: 429 })
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const platformGuides: Record<string, string> = {
    'Amazon India': 'Follow Amazon India listing guidelines: max 200 char title, 5 bullet points starting with caps, keyword-rich description.',
    Flipkart:       'Follow Flipkart listing guidelines: concise title, 5 feature highlights, benefit-focused description.',
    Meesho:         'Follow Meesho guidelines: simple Hindi-friendly language, highlight price-value, mention sizes/colors.',
    Etsy:           'Follow Etsy guidelines: storytelling description, handmade/unique angle, SEO tags.',
  }

  const prompt = `You are an expert Indian e-commerce product listing writer.
Platform: ${platform}
${platformGuides[platform] || ''}
Tone: ${tone}
Product: ${productInput}
Key Features: ${features || 'Not specified'}

Generate a complete product listing including:
1. Title (optimized for ${platform})
2. 5 Bullet Points / Key Features
3. Full Description (150-200 words)
4. 10 SEO Keywords (comma-separated)
5. Suggested Category

Format with clear section headers (✅ Title:, ✅ Bullet Points:, etc.)`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
  })

  const result = completion.choices[0]?.message?.content || 'Generation failed. Please try again.'

  // Decrement credits
  await query(
    'UPDATE user_profiles SET ai_credits = GREATEST(0, ai_credits - 1), updated_at = NOW() WHERE user_id = $1',
    [userId]
  )

  return NextResponse.json({ result, credits_remaining: credits - 1 })
}
