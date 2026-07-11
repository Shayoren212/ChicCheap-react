import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY')
    if (!GEMINI_KEY) throw new Error('GEMINI_API_KEY secret is missing')

    const { imageBase64, mimeType = 'image/jpeg' } = await req.json()
    if (!imageBase64) throw new Error('No image provided')

    // הסרת prefix של data URL אם קיים (data:image/jpeg;base64,XXX → XXX)
    const base64Data = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64

    const prompt = `אתה מומחה אופנה. נתח את הבגד או האקססוריז בתמונה.
החזר JSON בדיוק בפורמט הזה בלי שום טקסט נוסף:
{
  "type": "סוג הפריט בעברית (חולצה / שמלה / מכנסיים / ג'ינסים / מעיל / נעליים / תיק / אביזר / חצאית)",
  "color": "הצבע העיקרי בעברית (ירוק / כחול / שחור / לבן / אדום / בז' / ורוד / סגול / כתום / אפור / חום / זהב)",
  "style": "סגנון בעברית (קז'ואל / ערב / ספורטיבי / וינטאג' / עסקי / יום יומי)",
  "query": "שאילתת חיפוש בעברית לאיתור פריט דומה — 3-4 מילים, למשל: חולצה ירוקה קז'ואל נשים"
}`

    // מפתחות AQ. הם auth keys חדשים — נדרש Authorization: Bearer
    // מפתחות AIzaSy ישנים עובדים עם ?key= בURL
    const isAuthKey = GEMINI_KEY.startsWith('AQ.')
    const geminiUrl = isAuthKey
      ? `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
      : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`
    const authHeaders: Record<string, string> = isAuthKey
      ? { 'Authorization': `Bearer ${GEMINI_KEY}`, 'x-goog-api-key': GEMINI_KEY }
      : {}

    const geminiRes = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders },
        body: JSON.stringify({
          contents: [{
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: prompt },
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200,
          }
        })
      }
    )

    if (!geminiRes.ok) {
      const errText = await geminiRes.text()
      throw new Error(`Gemini API error: ${errText}`)
    }

    const geminiData = await geminiRes.json()
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'

    // ניקוי markdown code blocks אם Gemini החזיר אותם
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    let analysis
    try {
      analysis = JSON.parse(cleaned)
    } catch {
      // fallback אם JSON לא תקין
      analysis = { type: 'בגד', color: '', style: '', query: 'ביגוד אופנה' }
    }

    return new Response(
      JSON.stringify({ success: true, analysis }),
      { headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('analyze-fashion-image error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } }
    )
  }
})
