import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ─── Secondhand mock generator ───────────────────────────────────────────────
// Facebook Marketplace and Yad2 don't expose public APIs,
// so we generate realistic secondhand listings with Unsplash fashion images.
const SECONDHAND_IMAGES = [
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
  'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
]

function buildSecondhandMock(query: string) {
  const sources    = ['פייסבוק מרקטפלייס', 'יד שנייה', 'פייסבוק מרקטפלייס', 'יד שנייה']
  const conditions = ['כמו חדש', 'מצב מצוין', 'מצב טוב', 'כמו חדש']
  const sizes      = ['XS', 'S', 'M', 'L']
  const locations  = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון']
  const prices     = [45, 80, 120, 65]
  const seed       = query.split('').reduce((a, c) => a + c.charCodeAt(0), 0)

  return Array.from({ length: 4 }, (_, i) => ({
    id:            `secondhand-${i}`,
    brand:         sources[i],
    title:         `${query} — יד שנייה`,
    price:         prices[i],
    originalPrice: null,
    size:          sizes[i],
    condition:     conditions[i],
    tag:           i === 0 ? 'מציאה נדירה' : null,
    imageUrl:      SECONDHAND_IMAGES[(seed + i) % SECONDHAND_IMAGES.length],
    imageColor:    null,
    link:          '#',
    sourceType:    'secondhand',
    location:      locations[i],
  }))
}

// ─── Main handler ─────────────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    const { query } = await req.json()
    if (!query) throw new Error('query is required')

    const SERPAPI_KEY = Deno.env.get('SERPAPI_KEY')
    if (!SERPAPI_KEY) throw new Error('SERPAPI_KEY secret not set')

    // ── Call SerpAPI Google Shopping ──────────────────────────────────────────
    // מחפש ב-Google Shopping שכולל: זארה, נייק, אדידס, ברשקה, סטרדיווריוס, H&M, פקטורי54 ועוד
    const serpUrl = `https://serpapi.com/search.json?engine=google_shopping` +
      `&q=${encodeURIComponent(query)}` +
      `&gl=il&hl=iw&num=40&api_key=${SERPAPI_KEY}`

    const serpRes  = await fetch(serpUrl)
    const serpData = await serpRes.json()

    const brandProducts = ((serpData.shopping_results as any[]) || [])
      .slice(0, 30)
      .map((item: any, i: number) => ({
        id:            `brand-${i}-${Date.now()}`,
        brand:         item.source ?? 'חנות',
        title:         item.title   ?? '',
        price:         item.extracted_price ?? parseFloat((item.price ?? '0').replace(/[^\d.]/g, '')) ?? 0,
        originalPrice: item.extracted_old_price ?? null,
        size:          null,
        condition:     'חדש',
        tag:           item.on_sale ? 'ירידת מחיר' : null,
        imageUrl:      item.thumbnail ?? null,
        imageColor:    null,
        link:          item.link ?? '#',
        sourceType:    'brand',
        location:      'אונליין',
      }))

    // ── Combine brand + secondhand ────────────────────────────────────────────
    const secondhandProducts = buildSecondhandMock(query)
    const products = [...brandProducts, ...secondhandProducts]

    return new Response(
      JSON.stringify({ products }),
      { headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
    )
  }
})
