import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import FilterModal from '../../components/FilterModal/FilterModal'
import { SlidersHorizontal, Search, Heart } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './HomePage.css'

/* ── קטגוריות ── */
const CATEGORIES = [
  'כל הפריטים', 'שמלות', 'עליוניות', 'ג׳ינסים', 'נעליים', 'תיקים', 'אביזרים', 'וינטאג׳',
]

/* ── מילות מפתח לסינון קטגוריות ── */
const CATEGORY_FILTERS = {
  'שמלות': {
    title:       ['שמלה', 'שמלת', 'dress', 'מקסי', 'מידי', 'מיני שמלה', 'חצאית',
                  'ג׳אמפסוט', "ג'אמפסוט", 'jumpsuit', 'אוברול', 'רומפר', 'romper'],
    productType: ['שמלות', 'שמלה', 'dress', 'חצאיות', 'Dresses', 'dresses'],
    exclude:     ['בגד ים', 'ביקיני', 'בגדי ים'],
  },
  'עליוניות': {
    title:       ['חולצה', 'חולצת', 'טי שרט', 'טישרט', 'סוודר', 'בלייזר', 'טופ', 'גופייה', 'גופית',
                  'ג׳מפר', 'קרדיגן', 'מעיל', "ג'קט", 'ג׳קט', "ז'קט",
                  'בלוזה', 'בלוז', 'פולו', 'polo',
                  'קפוצ׳ון', "קפוצ'ון", 'hoodie', 'סווטשירט', 'sweatshirt',
                  'וסט', 'vest', 'חליפה', 'top', 'shirt', 'tshirt', 't-shirt',
                  'כותפות', 'שכמייה', 'שכמיה'],
    productType: ['חולצות', 'עליוניות', 'סוודרים', 'בלייזרים', 'מעילים', 'ג׳קטים', 'גופיות',
                  'Tops', 'tops', 'Shirts', 'shirts', 'Sweaters', 'sweaters', 'Blouses', 'blouses',
                  'חולצה', 'top', 'shirt'],
    exclude:     ['בגד ים', 'ביקיני', 'שמלה', 'שמלת'],
  },
  "ג'ינסים": {
    title:       ['מכנס', 'מכנסי', 'מכנסיים', "ג'ינס", 'ג׳ינס', 'דנים', 'jeans', 'pants',
                  'שורט', 'ברמודה', 'טייץ', 'לגינס',
                  'טרנינג', 'jogger', 'קפריז', 'קפרי', 'culotte', 'קולוט',
                  'חצאית מכנס', 'חצאית-מכנס'],
    productType: ["ג'ינסים", 'ג׳ינסים', 'מכנסיים', 'מכנסי ג׳ינס', 'שורטים',
                  'Jeans', 'jeans', 'Pants', 'pants', 'Shorts', 'shorts', 'Leggings', 'leggings',
                  'מכנס', 'טייץ'],
    exclude:     ['בגד ים', 'ביקיני', 'בגדי ים', 'מכנסי ים', 'מכנס ים', 'שמלה'],
  },
  'נעליים': {
    title:       ['נעל', 'נעלי', 'סנדל', 'מגף', 'כפכף', 'sneaker', 'boot', 'shoe',
                  'סניקר', 'סניקרס', 'נעליים', 'קבקב', 'עקב', 'פלטפורמה', 'loafer', 'מוקסין'],
    productType: ['נעליים', 'נעלי ספורט', 'סנדלים', 'מגפיים', 'כפכפים',
                  'Shoes', 'shoes', 'Sneakers', 'sneakers', 'Boots', 'boots', 'Sandals', 'sandals',
                  'נעל'],
    exclude:     [],
  },
  'תיקים': {
    title:       ['תיק', 'ארנק', 'bag', 'clutch', 'purse',
                  'תרמיל', 'תיק גב', 'תיק יד', 'קלאץ׳', "קלאץ'", 'backpack', 'tote'],
    productType: ['תיקים', 'ארנקים', 'תיקי יד', 'תיקי גב',
                  'Bags', 'bags', 'Handbags', 'handbags', 'תיק'],
    exclude:     [],
  },
  'אביזרים': {
    title:       ['תכשיט', 'צמיד', 'שרשרת', 'עגיל', 'טבעת', 'כובע', 'חגורה', 'משקפ', 'גרביון', 'גרביוני',
                  'קשת', 'אביזר', 'סיכה', 'ברטה', 'כפפה', 'כפפות', 'צעיף', 'פנדנט', 'תליון'],
    productType: ['אביזרים', 'תכשיטים', 'Accessories', 'accessories', 'Jewelry', 'jewelry'],
    exclude:     ['חולצה', 'חולצת', 'שמלה', 'שמלת', 'מכנסי', "ג'ינס", 'ג׳ינס', 'מעיל', 'סוודר', 'מכנסיים',
                  'נעל', 'נעלי', 'סנדל', 'מגף', 'כפכף', 'תיק', 'ארנק'],
  },
  "וינטאג'": {
    title:       ['וינטאג', "וינטג'", 'vintage', 'רטרו', 'retro', 'secondhand', 'used'],
    productType: ["וינטאג'", "וינטג'", 'vintage', 'Vintage'],
    exclude:     [],
  },
}

/* ── מילים שמסמנות פריטים לא-אופנה ── */
const NON_FASHION_TITLE_WORDS = [
  // טיפוח שיער וגוף
  'פן', 'מייבש שיער', 'מחליק', 'מחליק שיער', 'מסלסל', 'מסלסל שיער', 'מברשת חימום',
  'מסרק', 'מברשת שיניים', 'שמפו', 'מרכך', 'ג\'ל שיער', 'ספריי שיער', 'לק ציפורניים',
  'קרם פנים', 'קרם לחות', 'סרום', 'פנדר', 'קרם גוף', 'אפילטור', 'מגלח', 'מגלחת', 'גילוח',
  'גוזז', 'גוזזת', 'מכשיר שיער', 'מכשיר טיפוח', 'מכשיר לשיער', 'מכשיר לגוף',
  'מסכה לפנים', 'סבון', 'שמן לגוף', 'ניחוח', 'בושם', 'פאה', 'ג׳ל שיניים', 'מים לפה',
  // אלקטרוניקה
  'Samsung', 'iPhone', 'Galaxy Watch', 'Apple Watch', 'שעון חכם',
  'אוזניות', 'רמקול', 'מחשב', 'טאבלט', 'מצלמה', 'טלפון', 'נגן', 'iPad', 'Airpods',
  // ספורט וצעצועים
  'אופניים', 'קורקינט', 'גלגיליות', 'קסדה', 'בובה', 'ברבי', 'פאזל', 'לגו',
  'כדורגל', 'כדורסל', 'מחבט', 'משקולות', 'הולה הופ',
  // בית ושונות
  'ספר', 'מנורה', 'כסא', 'שולחן', 'מטריה', 'מנוע', 'מכונת כביסה',
]

/* ── מיפוי צבעים עברית → מילות מפתח ── */
const COLOR_KEYWORDS = {
  'שחור': ['שחור', 'black', 'שחורה', 'שחורות', 'שחורים', 'בלאק'],
  'לבן':  ['לבן', 'לבנה', 'לבנות', 'white', 'אופוויט', 'off white', 'שמנת', 'cream', 'ivory'],
  'בז׳':  ['בז', 'בז׳', "בז'", 'beige', 'חמרה', 'camel', 'קאמל', 'sand', 'taupe', 'nude', 'פודרה'],
  'אדום': ['אדום', 'אדומה', 'red', 'wine', 'בורדו', 'bordeaux', 'טרקוטה', 'terracotta', 'coral'],
  'כחול': ['כחול', 'כחולה', 'blue', 'נייבי', 'navy', 'תכלת', "ג'ינס", 'ג׳ינס', 'דנים', 'denim'],
  'ירוק': ['ירוק', 'ירוקה', 'green', 'זית', 'olive', 'mint', 'חאקי', 'khaki', 'sage'],
  'ורוד': ['ורוד', 'ורודה', 'pink', 'ורד', 'rose', 'fuchsia', 'סלמון', 'salmon', 'blush', 'מאוב', 'mauve'],
  'חום':  ['חום', 'חומה', 'brown', 'קפה', 'coffee', 'chocolate', 'קרמל', 'caramel', 'tan', 'cognac'],
  'סגול': ['סגול', 'סגולה', 'purple', 'violet', 'plum', 'lilac', 'lavender'],
  'אפור': ['אפור', 'אפורה', 'gray', 'grey', 'כסף', 'silver', 'פחם', 'charcoal'],
  'כתום': ['כתום', 'כתומה', 'orange', 'חרדל', 'mustard', 'amber'],
  'זהב':  ['זהב', 'זהוב', 'gold', 'גולד', 'bronze', 'ברונז'],
}

/* ── קטלוג סטטי — מוצג מיד ללא המתנה לAPI ── */
const img = (id) => `https://images.unsplash.com/photo-${id}?w=500&h=620&auto=format&fit=crop&q=80`

const STATIC_PRODUCTS = [
  // BRAND
  { id: 'st-b01', brand: 'H&M',          title: 'שמלת מידי פרחונית קיץ',         price: 149, originalPrice: 199, tag: 'סייל',  condition: 'חדש',         productType: 'שמלות',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1595777457583-95e059d581b8'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b02', brand: 'ZARA',          title: 'שמלת ערב סאטן שחורה',          price: 279, originalPrice: null, tag: null,   condition: 'חדש',         productType: 'שמלות',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1490481651865-c94a68b7b4e0'), link: 'https://www.zara.com/il/' },
  { id: 'st-b03', brand: 'MANGO',         title: 'חליפת ספורט צהובה טרנדית',      price: 229, originalPrice: 299, tag: 'סייל',  condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1515886657613-9f3515b0c78f'), link: 'https://shop.mango.com/il' },
  { id: 'st-b04', brand: 'H&M',          title: 'חולצת כותנה בז׳ בייסיק',       price: 79,  originalPrice: null, tag: null,   condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1521572163474-6864f9cf17ab'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b05', brand: 'NAUTICA',       title: 'חולצת פולו כחול נייבי',        price: 189, originalPrice: 249, tag: 'סייל',  condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1576566588028-4147f3842f27'), link: 'https://www.nautica.com/' },
  { id: 'st-b06', brand: 'ZARA',          title: 'פונצ׳ו סרוג קרם/לבן',          price: 199, originalPrice: null, tag: null,   condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1434389677669-e08b4cac3105'), link: 'https://www.zara.com/il/' },
  { id: 'st-b07', brand: 'NAUTICA',       title: "מכנסי ג'ינס ישר כחול קלאסי",  price: 229, originalPrice: 299, tag: 'סייל',  condition: 'חדש',         productType: "ג'ינסים",   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1542272604-787c3835535d'), link: 'https://www.nautica.com/' },
  { id: 'st-b08', brand: 'MANGO',         title: 'מכנסי קוטל שחורים מחויטים',   price: 179, originalPrice: null, tag: null,   condition: 'חדש',         productType: "ג'ינסים",   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1541099649105-f69ad21f3246'), link: 'https://shop.mango.com/il' },
  { id: 'st-b09', brand: 'H&M',          title: 'שורט ג׳ינס קצר טרנדי',         price: 89,  originalPrice: 119, tag: 'סייל',  condition: 'חדש',         productType: "ג'ינסים",   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1473966968600-fa801b869a1a'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b10', brand: 'Nike',          title: 'נעלי ספורט Air Max לבן',       price: 549, originalPrice: 649, tag: 'סייל',  condition: 'חדש',         productType: 'נעליים',    sourceType: 'brand',      location: 'אונליין', imageUrl: img('1542291026-7eec264c27ff'), link: 'https://www.nike.com/il/' },
  { id: 'st-b11', brand: 'ZARA',          title: 'מגפוני צ׳לסי עור שחור',        price: 399, originalPrice: null, tag: null,   condition: 'חדש',         productType: 'נעליים',    sourceType: 'brand',      location: 'אונליין', imageUrl: img('1543163521-1bf539c55dd2'), link: 'https://www.zara.com/il/' },
  { id: 'st-b12', brand: 'Adidas',        title: 'נעלי סניקרס צבעוניות קולקציה', price: 199, originalPrice: 249, tag: 'סייל',  condition: 'חדש',         productType: 'נעליים',    sourceType: 'brand',      location: 'אונליין', imageUrl: img('1560769629-975ec94e6a86'), link: 'https://www.adidas.co.il/' },
  { id: 'st-b13', brand: 'MANGO',         title: 'תיק כתף עור קאמל',             price: 449, originalPrice: 599, tag: 'סייל',  condition: 'חדש',         productType: 'תיקים',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1548036328-c9fa89d128fa'), link: 'https://shop.mango.com/il' },
  { id: 'st-b14', brand: 'ZARA',          title: 'תיק קלאץ׳ שחור ערב',          price: 179, originalPrice: null, tag: null,   condition: 'חדש',         productType: 'תיקים',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1584917865442-de89df76afd3'), link: 'https://www.zara.com/il/' },
  { id: 'st-b15', brand: 'H&M',          title: 'שרשרת זהב עדינה לאי',          price: 49,  originalPrice: 69,  tag: 'סייל',  condition: 'חדש',         productType: 'אביזרים',   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1599643478518-a784e5dc4c8f'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b16', brand: 'NAUTICA',       title: 'כובע קש קיץ טבעי',             price: 89,  originalPrice: null, tag: null,   condition: 'חדש',         productType: 'אביזרים',   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1535632066927-ab7c9ab60908'), link: 'https://www.nautica.com/' },
  { id: 'st-b17', brand: 'MANGO',         title: "ז'קט בלייזר קרם אוברסייז",    price: 349, originalPrice: 449, tag: 'סייל',  condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1594938298870-d89f05e3fd07'), link: 'https://shop.mango.com/il' },
  { id: 'st-b18', brand: 'H&M',          title: 'מעיל טרנץ׳ כחול קלאסי',        price: 299, originalPrice: 399, tag: 'סייל',  condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1539109136881-3be0616acf4b'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b19', brand: 'NAUTICA',       title: 'גופיית ריב לבנה קלאסית',       price: 69,  originalPrice: null, tag: null,   condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1485462537746-965f3b9a2de9'), link: 'https://www.nautica.com/' },
  { id: 'st-b20', brand: 'ZARA',          title: 'שמלת מיני רומנטית ורודה',      price: 199, originalPrice: null, tag: null,   condition: 'חדש',         productType: 'שמלות',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1468495264291-4b4fd01f2b4b'), link: 'https://www.zara.com/il/' },
  { id: 'st-b21', brand: 'H&M',          title: 'שמלת מידי אדומה בוהו שיק',     price: 169, originalPrice: 219, tag: 'סייל',  condition: 'חדש',         productType: 'שמלות',     sourceType: 'brand',      location: 'אונליין', imageUrl: img('1568252542512-9fe8fe9c87bb'), link: 'https://www2.hm.com/he_il/' },
  { id: 'st-b22', brand: 'NAUTICA',       title: "ג'ינס סקיני מותן גבוה",       price: 249, originalPrice: null, tag: null,   condition: 'חדש',         productType: "ג'ינסים",   sourceType: 'brand',      location: 'אונליין', imageUrl: img('1571513722275-4b41929f27e3'), link: 'https://www.nautica.com/' },
  { id: 'st-b23', brand: 'MANGO',         title: 'חולצת שיפון מנוקדת קיץ',      price: 119, originalPrice: 159, tag: 'סייל',  condition: 'חדש',         productType: 'עליוניות',  sourceType: 'brand',      location: 'אונליין', imageUrl: img('1529374255736-c983c1b9be87'), link: 'https://shop.mango.com/il' },
  { id: 'st-b24', brand: 'Adidas',        title: 'נעלי Stan Smith לבן ירוק',    price: 429, originalPrice: 499, tag: 'סייל',  condition: 'חדש',         productType: 'נעליים',    sourceType: 'brand',      location: 'אונליין', imageUrl: img('1549298916-b41d501d3772'), link: 'https://www.adidas.co.il/' },

]

const BATCH_SIZE = 10

/* ── Fisher-Yates shuffle ── */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── שילוב 50/50: brand + secondhand לסירוגין ── */
/* מסיר כפילויות לפי id — כל מוצר מופיע פעם אחת בלבד */
function dedup(items) {
  const seen = new Set()
  return items.filter(p => {
    if (!p?.id || seen.has(String(p.id))) return false
    seen.add(String(p.id))
    return true
  })
}

function interleave50_50(brandItems, yad2Items) {
  const b = shuffle(brandItems)
  const y = shuffle(yad2Items)
  const result = []
  const len = Math.max(b.length, y.length)
  for (let i = 0; i < len; i++) {
    if (b[i]) result.push(b[i])
    if (y[i]) result.push(y[i])
  }
  return dedup(result)
}

/* ── שליפת כל פריטי הביגוד מיד2 מרקט (Shopify) ── */
async function fetchYad2AllFashion(query = '', colorWordsForBodyMatch = []) {
  try {
    const url = query.trim()
      ? `https://market.yad2.co.il/products.json?limit=250&q=${encodeURIComponent(query.trim())}`
      : 'https://market.yad2.co.il/products.json?limit=250'
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    if (!res.ok) return []
    const data = await res.json()
    const all = data.products || []

    let fashion = all.filter(p => {
      const hasFashionTag = p.tags?.some(t => t === 'tlc_ביגוד' || t.startsWith('tlc_ביגוד '))
      if (!hasFashionTag) return false
      if (!p.images?.[0]?.src) return false   // סנן פריטים ללא תמונה
      if (NON_FASHION_TITLE_WORDS.some(w => p.title?.includes(w))) return false
      return true
    })

    fashion = shuffle(fashion)

    // מיון לפי רלוונטיות ל-query (כותרת > body_html > שאר)
    const colorBodyMatchSet = new Set()
    if (query.trim()) {
      const norm = s => (s || '').replace(/[''׳`]/g, "'")
      const words = norm(query.trim()).split(/\s+/)
      const titleMatch = p => words.some(w => norm(p.title)?.includes(w))
      const bodyMatch  = p => words.some(w => norm(p.body_html)?.includes(w))
      // סמן פריטים שמילות הצבע הספציפיות מופיעות ב-body_html אבל לא בכותרת
      // (כדי שלא יסוננו ע"י applyFiltersAndShow למרות שהם רלוונטיים)
      if (colorWordsForBodyMatch.length > 0) {
        const norm2 = s => (s || '').toLowerCase()
        fashion.forEach(p => {
          const inTitle = colorWordsForBodyMatch.some(w => norm2(p.title)?.includes(norm2(w)))
          const inBody  = colorWordsForBodyMatch.some(w => norm2(p.body_html)?.includes(norm2(w)))
          if (!inTitle && inBody) colorBodyMatchSet.add(p.id)
        })
      }
      fashion = [
        ...fashion.filter(titleMatch),                                    // כותרת מתאימה
        ...fashion.filter(p => !titleMatch(p) && bodyMatch(p)),           // רק body_html מתאים
        ...fashion.filter(p => !titleMatch(p) && !bodyMatch(p)),          // לא מתאים — בסוף
      ]
    }

    return fashion.map(item => {
      const city      = item.tags?.find(t => t.startsWith('city='))?.replace('city=', '') ?? ''
      const condition = item.tags?.find(t => t.startsWith('condition='))?.replace('condition=', '') ?? 'יד שנייה'
      const sizeTag   = item.tags?.find(t => t.startsWith('attr-Size:') || t.startsWith('attr-Measurement:'))
      const size      = sizeTag ? sizeTag.split(':').pop() : null
      const colorTag  = item.tags?.find(t => t.startsWith('attr-Color:') || t.startsWith('color='))
      const itemColor = colorTag ? colorTag.split(/[:=]/).pop().trim() : null

      return {
        id:          `yad2-${item.id}`,
        brand:       'יד2 מרקט',
        title:       item.title ?? '',
        price:       parseFloat(item.variants?.[0]?.price ?? '0'),
        originalPrice: item.variants?.[0]?.compare_at_price ? parseFloat(item.variants[0].compare_at_price) : null,
        size, condition, color: itemColor, tag: null,
        imageUrl:    item.images?.[0]?.src ?? null,
        imageColor:  null,
        link:        `https://market.yad2.co.il/products/${item.handle}`,
        sourceType:  'secondhand',
        location:    city,
        productType: item.product_type ?? '',
        rawTags:          item.tags ?? [],
        _colorBodyMatch:  colorBodyMatchSet.has(item.id), // צבע ב-body_html בלבד (לא בכותרת ולא בתגיות)
      }
    })
  } catch {
    return []
  }
}

/* ── שליפה מכל חנות Shopify ── */
async function fetchShopifyStore(domain, brandName, colors = [], typeKeywords = []) {
  try {
    const colorWords = colors.flatMap(c => COLOR_KEYWORDS[c] || [c])
    const [r1, r2] = await Promise.allSettled([
      fetch(`https://${domain}/products.json?limit=250`, { headers: { Accept: 'application/json' } }),
      fetch(`https://${domain}/products.json?limit=250&page=2`, { headers: { Accept: 'application/json' } }),
    ])
    const pages = await Promise.all([
      r1.status === 'fulfilled' && r1.value.ok ? r1.value.json() : Promise.resolve({ products: [] }),
      r2.status === 'fulfilled' && r2.value.ok ? r2.value.json() : Promise.resolve({ products: [] }),
    ])
    const all = [...(pages[0].products || []), ...(pages[1].products || [])]

    return all
      .filter(item => {
        const titleLow = (item.title ?? '').toLowerCase()
        if (typeKeywords.length > 0 && !typeKeywords.some(kw => titleLow.includes(kw.toLowerCase()))) return false
        if (colorWords.length > 0) {
          const colorOpt = item.options?.find(o => ['color','Color','צבע','colour'].includes(o.name))
          const vals = colorOpt?.values ?? item.variants?.map(v => v.option1) ?? []
          if (!vals.some(v => colorWords.some(cw => (v ?? '').toLowerCase().includes(cw.toLowerCase())))) return false
        }
        return true
      })
      .map(item => {
        const av = item.variants?.find(v => v.available) ?? item.variants?.[0]
        const price = parseFloat(av?.price ?? '0')
        const origPrice = av?.compare_at_price ? parseFloat(av.compare_at_price) : null

        // מצא את ה-option שהוא צבע (לא גודל) לפי שם
        const COLOR_OPT_NAMES = ['color', 'Color', 'Colour', 'colour', 'צבע', 'Colour']
        const colorOptIdx = item.options?.findIndex(o => COLOR_OPT_NAMES.includes(o.name)) ?? -1
        const getOptVal = (v, idx) => idx === 0 ? v.option1 : idx === 1 ? v.option2 : idx === 2 ? v.option3 : v.option1
        const colorVal = colorOptIdx >= 0 ? getOptVal(av, colorOptIdx) : av?.option1
        // כל ערכי הצבע של המוצר (לכל הוריאנטים) — לבדיקת פילטר צבע
        const allColors = colorOptIdx >= 0
          ? [...new Set(item.variants?.map(v => getOptVal(v, colorOptIdx)).filter(Boolean))]
          : []

        const sizeOptIdx = item.options?.findIndex(o => ['size','Size','מידה','גודל'].includes(o.name)) ?? -1
        const sizeVal = sizeOptIdx >= 0 ? getOptVal(av, sizeOptIdx) : (colorOptIdx === 0 ? av?.option2 : av?.option1)

        return {
          id:            `${brandName}-${item.id}`,
          brand:         item.vendor || brandName,
          title:         item.title ?? '',
          price,
          originalPrice: origPrice,
          color:         colorVal ?? '',
          allColors,
          size:          sizeVal ?? null,
          condition:     'חדש',
          tag:           origPrice && price < origPrice ? 'סייל' : null,
          imageUrl:      item.images?.[0]?.src ?? null,
          imageColor:    null,
          link:          `https://${domain}/products/${item.handle}`,
          sourceType:    'brand',
          location:      'אונליין',
          productType:   item.product_type ?? '',
          rawTags:       [],
        }
      })
  } catch {
    return []
  }
}

/* ── שליפה מכל החנויות במקביל ── */
async function fetchAllBrandStores(colors = [], typeKeywords = []) {
  const stores = [
    { domain: 'www.renuar.co.il',         brand: 'Renuar'    },
    { domain: 'www.twentyfourseven.co.il', brand: 'TFS'       },
    { domain: 'www.kenvelo.co.il',         brand: 'Kenvelo'   },
    { domain: 'www.honigman.co.il',        brand: 'Honigman'  },
    { domain: 'www.golf-co.co.il',         brand: 'Golf & Co' },
  ]
  const results = await Promise.allSettled(
    stores.map(s => fetchShopifyStore(s.domain, s.brand, colors, typeKeywords))
  )
  return shuffle(results.flatMap(r => r.status === 'fulfilled' ? r.value : []))
}

/* ── כרטיס מוצר ── */
function ProductMasonryCard({ product, onClick, liked, onLike }) {
  return (
    <article className="masonry-card" onClick={onClick}>
      <div
        className="masonry-card__img"
        style={{
          backgroundColor: product.imageColor || '#e8e0d8',
          ...(product.imageUrl
            ? { backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : {}
          )
        }}
      >
        {product.tag && <span className="masonry-card__tag">{product.tag}</span>}
        <button
          className={`masonry-card__heart ${liked ? 'masonry-card__heart--active' : ''}`}
          onClick={e => { e.stopPropagation(); onLike(product.id) }}
          aria-label="שמור למועדפים"
        >
          <Heart size={16} fill={liked ? '#7b5455' : 'none'} />
        </button>
      </div>
      <div className="masonry-card__info">
        <p className="masonry-card__brand">{product.brand}</p>
        <p className="masonry-card__title">{product.title}</p>
        <div className="masonry-card__price-row">
          <span className="masonry-card__price">₪{product.price}</span>
          {product.originalPrice && (
            <span className="masonry-card__original">₪{product.originalPrice}</span>
          )}
        </div>
        <p className="masonry-card__meta">
          {[product.size, product.condition].filter(Boolean).join(' · ')}
        </p>
      </div>
    </article>
  )
}

/* ══════════════════════════════════════
   דף הבית
═══════════════════════════════════════ */
function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [query, setQuery]                 = useState('')
  const [activeCategory, setActiveCategory] = useState('כל הפריטים')
  const [results, setResults]             = useState(STATIC_PRODUCTS)
  const [loading, setLoading]             = useState(false)
  const [loadingMore, setLoadingMore]     = useState(false)
  const [filterOpen, setFilterOpen]       = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const [liked, setLiked]                 = useState(new Set())
  const [noResultsMsg, setNoResultsMsg]   = useState('')

  const baseResultsRef = useRef(STATIC_PRODUCTS)
  const yad2BufferRef  = useRef([])
  const sentinelRef    = useRef(null)

  /* ── IntersectionObserver: גלילה ──
     loadingMoreRef משמש ל-guard בתוך ה-callback כדי שה-observer לא יירשם מחדש בכל שינוי state
  ── */
  const loadingMoreRef = useRef(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && yad2BufferRef.current.length > 0 && !loadingMoreRef.current) {
          loadingMoreRef.current = true
          setLoadingMore(true)

          // setTimeout(0) מאפשר ל-React לרנדר את הספינר לפני שנוסיף תוצאות
          setTimeout(() => {
            const batch = yad2BufferRef.current.slice(0, BATCH_SIZE)
            yad2BufferRef.current = yad2BufferRef.current.slice(BATCH_SIZE)
            setResults(prev => {
              const next = dedup([...prev, ...batch])
              baseResultsRef.current = next
              return next
            })
            setLoadingMore(false)
            loadingMoreRef.current = false
          }, 0)
        }
      },
      { rootMargin: '400px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, []) // רישום פעם אחת בלבד — ה-guard מנוהל ע"י ref

  /* ── טעינה ראשונית ── */
  useEffect(() => {
    // החזרה מדף פריט — שחזר cache
    const fromProduct = sessionStorage.getItem('cc_from_product')
    if (fromProduct) {
      sessionStorage.removeItem('cc_from_product')
      try {
        const cached = sessionStorage.getItem('cc_results')
        if (cached) {
          const products = JSON.parse(cached)
          baseResultsRef.current = products
          yad2BufferRef.current = []
          setResults(products)
          return
        }
      } catch {}
    }

    // הצג מיד פריטי מותגים סטטיים — ללא המתנה
    const staticBrands = shuffle(STATIC_PRODUCTS)
    baseResultsRef.current = staticBrands
    setResults(staticBrands)
    sessionStorage.setItem('cc_results', JSON.stringify(staticBrands))

    // שלב א׳: יד2 בלבד — בקשה אחת מהירה (~2-3 שניות)
    // כשמגיע → מציג מיד 50/50 מותגים סטטיים + יד2 אמיתי, ללא רענון כפול
    fetchYad2AllFashion('').then(yad2Items => {
      if (yad2Items.length === 0) return
      const merged = interleave50_50(STATIC_PRODUCTS, yad2Items)
      // הצג לפחות כמה שמוצג כרגע (לא פחות) — מונע את הרענון הכפול
      const showCount = Math.max(baseResultsRef.current.length, 20)
      baseResultsRef.current = merged
      yad2BufferRef.current  = merged.slice(showCount)
      setResults(merged.slice(0, showCount))
      sessionStorage.setItem('cc_results', JSON.stringify(merged))
    }).catch(() => {})

    // שלב ב׳: מותגים אמיתיים — איטי יותר, רק מעדכן buffer ללא רענון תצוגה
    fetchAllBrandStores([]).then(brandItems => {
      if (brandItems.length === 0) return
      const currentYad2 = baseResultsRef.current.filter(p => p.sourceType === 'secondhand')
      const merged = interleave50_50(brandItems, currentYad2)
      const currentShown = baseResultsRef.current.length
      // אין setResults — שמור לחיפוש/גלילה הבאים
      baseResultsRef.current = merged
      yad2BufferRef.current  = merged.slice(currentShown)
      sessionStorage.setItem('cc_results', JSON.stringify(merged))
    }).catch(() => {})
  }, [])

  /* ── טעינת פריטים שמורים ── */
  useEffect(() => {
    if (!user) return
    supabase
      .from('saved_items')
      .select('product_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (data) setLiked(new Set(data.map(r => r.product_id)))
      })
  }, [user])

  /* ── חיפוש טקסט ── */
  const handleSearch = (e) => {
    e?.preventDefault()
    if (!query.trim()) return
    setActiveCategory('כל הפריטים')
    setNoResultsMsg('')
    yad2BufferRef.current = []

    // 1. הצג מיד תוצאות סטטיות — ללא ספינר
    const norm = s => (s || '').replace(/[''׳`]/g, "'").toLowerCase()
    const words = norm(query.trim()).split(/\s+/).filter(Boolean)
    const staticMatches = STATIC_PRODUCTS.filter(p =>
      words.some(w => norm(p.title).includes(w) || norm(p.brand).includes(w))
    )
    const quick = staticMatches.length > 0 ? staticMatches : STATIC_PRODUCTS
    baseResultsRef.current = quick
    setResults(quick.slice(0, 20))

    // 2. APIs ברקע — מעדכנים כשמגיעים (שניהם יחד)
    const queryColors = Object.keys(COLOR_KEYWORDS).filter(c => query.includes(c))
    let brandItems = [], yad2Items = [], brandDone = false, yad2Done = false

    const applyApiResults = () => {
      if (!brandDone || !yad2Done) return
      const allProducts = interleave50_50(
        brandItems.length > 0 ? brandItems : STATIC_PRODUCTS,
        yad2Items, // רק יד2 אמיתיים — ללא fallback לסטטיים מזויפים
      )
      const INITIAL_DISPLAY = 20
      baseResultsRef.current = allProducts
      yad2BufferRef.current  = allProducts.slice(INITIAL_DISPLAY)
      setResults(allProducts.slice(0, INITIAL_DISPLAY))
      sessionStorage.setItem('cc_results', JSON.stringify(allProducts))
      sessionStorage.setItem('cc_query', query)
    }

    fetchAllBrandStores(queryColors)
      .then(items => { brandItems = items; brandDone = true; applyApiResults() })
      .catch(() => { brandDone = true; applyApiResults() })

    fetchYad2AllFashion(query)
      .then(items => { yad2Items = items; yad2Done = true; applyApiResults() })
      .catch(() => { yad2Done = true; applyApiResults() })
  }

  /* ── סינון לפי קטגוריה ── */
  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setNoResultsMsg('')
    if (cat === 'כל הפריטים') {
      const INITIAL_DISPLAY = 20
      const all = baseResultsRef.current
      yad2BufferRef.current = all.slice(INITIAL_DISPLAY)
      setResults(all.slice(0, INITIAL_DISPLAY))
      return
    }

    yad2BufferRef.current = []
    const filter = CATEGORY_FILTERS[cat]
    if (!filter) { setResults(baseResultsRef.current); return }

    const normalize = s => (s || '').replace(/[''׳`]/g, "'").toLowerCase()
    const filtered = baseResultsRef.current.filter(p => {
      const titleN = normalize(p.title)
      const typeN  = normalize(p.productType ?? '')
      if (filter.exclude?.some(ex => titleN.includes(normalize(ex)))) return false
      if (filter.title.some(kw => titleN.includes(normalize(kw)))) return true
      if (filter.productType.length > 0 && filter.productType.some(kw => typeN.includes(normalize(kw)) || normalize(kw).includes(typeN) && typeN.length > 2)) return true
      return false
    })

    if (filtered.length > 0) {
      setResults(filtered)
    } else {
      setResults(baseResultsRef.current.slice(0, 20))
      setNoResultsMsg(`לא נמצאו פריטים בקטגוריה "${cat}" — מציג את כל הפריטים`)
      setActiveCategory('כל הפריטים')
    }
  }

  /* ── like / unlike ── */
  const toggleLike = async (id) => {
    const isLiked = liked.has(id)
    setLiked(prev => {
      const next = new Set(prev)
      isLiked ? next.delete(id) : next.add(id)
      return next
    })
    const store = JSON.parse(localStorage.getItem('cc_liked_products') || '{}')
    if (isLiked) {
      delete store[id]
    } else {
      const product = baseResultsRef.current.find(p => p.id === id)
      if (product) {
        store[id] = { id: product.id, brand: product.brand, title: product.title, price: product.price,
          imageUrl: product.imageUrl ?? null, imageColor: product.imageColor ?? null,
          link: product.link ?? '#', sourceType: product.sourceType ?? 'brand' }
      }
    }
    localStorage.setItem('cc_liked_products', JSON.stringify(store))

    if (!user) return
    if (isLiked) {
      await supabase.from('saved_items').delete().eq('user_id', user.id).eq('product_id', id)
    } else {
      await supabase.from('saved_items').insert({ user_id: user.id, product_id: id })
    }
  }

  /* ── מספר עמודות responsive ── */
  const [colCount, setColCount] = useState(() => {
    if (typeof window === 'undefined') return 4
    if (window.innerWidth >= 1024) return 4
    if (window.innerWidth >= 640) return 3
    return 2
  })

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setColCount(4)
      else if (window.innerWidth >= 640) setColCount(3)
      else setColCount(2)
    }
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const splitToColumns = (items) => {
    const columns = Array.from({ length: colCount }, () => [])
    items.forEach((item, i) => columns[i % colCount].push(item))
    return columns
  }

  /* ── JSX ── */
  return (
    <div className="page home-page">
      <Navbar />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__overlay" aria-hidden="true" />

        <div className="home-hero__content">
          <h1 className="home-hero__title">מה את מחפשת?</h1>
          <p className="home-hero__sub">תאארי את הפריט שחלמת עליו — נמצא לך אותו במחיר הכי טוב ברשת</p>

          <form className="home-hero__form" onSubmit={handleSearch}>
            <div className="home-hero__search-bar">
              <Search size={18} className="home-hero__search-icon" />
              <input
                type="text"
                className="home-hero__input"
                placeholder="תארי את הפריט (למשל: מעיל בז׳ קז׳ואל)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button
                type="button"
                className={`home-hero__filter-btn ${activeFilters ? 'home-hero__filter-btn--active' : ''}`}
                onClick={() => setFilterOpen(true)}
                title="סינון מתקדם"
              >
                <SlidersHorizontal size={18} />
                {activeFilters && <span className="home-hero__filter-dot" />}
              </button>
            </div>

            <button type="submit" className="home-hero__submit" disabled={loading || !query.trim()}>
              {loading ? <span className="loading-spinner" /> : 'חפשי עכשיו'}
            </button>
          </form>
        </div>
      </section>

      {/* Results */}
      <main className="home-results page-inner">
        <div className="home-results__header">
          <h2 className="home-results__title">
            {activeCategory === 'כל הפריטים' ? 'גילויים עבורך' : activeCategory}
          </h2>
          <span className="home-results__count">{results.length} פריטים</span>
        </div>

        {noResultsMsg && (
          <div className="home-no-results-msg" role="status">
            ℹ️ {noResultsMsg}
          </div>
        )}

        {loading ? (
          <div className="home-loading">
            <span className="loading-spinner" />
            <p>מחפשת את הכי זול ברשת...</p>
          </div>
        ) : (
          <>
            <div
              className="home-masonry"
              style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
            >
              {splitToColumns(results).map((col, ci) => (
                <div key={ci} className="masonry-col">
                  {col.map(product => (
                    <ProductMasonryCard
                      key={product.id}
                      product={product}
                      onClick={() => {
                        sessionStorage.setItem('cc_from_product', '1')
                        navigate(`/product/${product.id}`, { state: { product } })
                      }}
                      liked={liked.has(product.id)}
                      onLike={toggleLike}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div ref={sentinelRef} style={{ height: 1 }} />

            {loadingMore && (
              <div className="home-loading" style={{ padding: '1rem 0' }}>
                <span className="loading-spinner" />
              </div>
            )}
          </>
        )}
      </main>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        activeFilters={activeFilters}
        onApply={(f) => {
          setNoResultsMsg('')
          yad2BufferRef.current = []

          // פונקציה שמחילה את כל הפילטרים על pool נתון ומעדכנת את התצוגה
          const applyFiltersAndShow = (pool) => {

            const normalize = s => (s || '').replace(/[''׳`]/g, "'").toLowerCase()

            // מחיר
            let filtered = pool.filter(p =>
              (p.price ?? 0) >= f.priceRange[0] && (p.price ?? 9999) <= f.priceRange[1]
            )

            // צבע
            if (f.colors?.length > 0) {
              const colorWords = f.colors.flatMap(c => COLOR_KEYWORDS[c] || [c])
              const check = str => colorWords.some(w => (str ?? '').toLowerCase().includes(w.toLowerCase()))
              const isColorMatch = p =>
                p._colorMatch ||                           // סומן מ-API (כבר סוּנן לפי צבע)
                p._colorBodyMatch ||                       // צבע מופיע ב-body_html של פריט יד2
                (p.color && check(p.color)) ||
                p.allColors?.some(c => check(c)) ||
                check(p.title) ||
                p.rawTags?.some(t => check(t))
              const byColor = filtered.filter(isColorMatch)
              if (byColor.length > 0) filtered = byColor
            }

            // קטגוריה
            if (f.category && f.category !== 'כל הפריטים') {
              setActiveCategory(f.category)
              const catFilter = CATEGORY_FILTERS[f.category]
              if (catFilter) {
                const byCat = filtered.filter(p => {
                  const titleN = normalize(p.title)
                  const typeN  = normalize(p.productType ?? '')
                  if (catFilter.exclude?.some(ex => titleN.includes(normalize(ex)))) return false
                  if (catFilter.title.some(kw => titleN.includes(normalize(kw)))) return true
                  if (catFilter.productType.length > 0 && catFilter.productType.some(kw => typeN.includes(normalize(kw)) || normalize(kw).includes(typeN) && typeN.length > 2)) return true
                  return false
                })
                if (byCat.length > 0) {
                  filtered = byCat
                } else {
                  setNoResultsMsg(`לא נמצאו פריטים בקטגוריה "${f.category}" — מציג תוצאות קרובות`)
                  setActiveCategory('כל הפריטים')
                }
              }
            }

            // מצב
            if (f.conditions?.length > 0) {
              const condMap = {
                'חדש':       ['חדש', 'חדש עם תווית', 'new', 'חדש באריזה'],
                'מצב מצוין': ['כמו חדש', 'מצב מצוין'],
                'מצב טוב':   ['טוב', 'מצב טוב', 'משומש'],
              }
              const allowed = f.conditions.flatMap(c => condMap[c] || [c])
              const byCond = filtered.filter(p => !p.condition || allowed.some(a => p.condition?.includes(a)))
              if (byCond.length > 0) filtered = byCond
            }

            // מקור — מחייב תמיד, ללא fallback
            if (f.sources?.length > 0 && f.sources.length < 2) {
              const wantsSecondhand = f.sources.includes('יד שנייה / יד2 מרקט')
              const wantsBrand      = f.sources.includes('חנויות')
              if (wantsSecondhand && !wantsBrand) {
                filtered = filtered.filter(p => p.sourceType === 'secondhand')
              } else if (wantsBrand && !wantsSecondhand) {
                filtered = filtered.filter(p => p.sourceType === 'brand')
              }
            }

            // fallback סופי
            if (filtered.length === 0) {
              filtered = baseResultsRef.current.slice(0, 20)
              setNoResultsMsg('לא נמצאו תוצאות מדויקות — מציג את כל הפריטים')
              setActiveCategory('כל הפריטים')
              setActiveFilters(null)
            } else {
              const hasActive = f.colors?.length > 0 || (f.category && f.category !== 'כל הפריטים') ||
                f.conditions?.length > 0 || f.sources?.length > 0 ||
                f.priceRange[0] > 0 || f.priceRange[1] < 2000
              setActiveFilters(hasActive ? f : null)
            }

            setResults(filtered)
          }

          // 1. הצג מיד עם מה שיש ב-pool הנוכחי
          applyFiltersAndShow(baseResultsRef.current)

          // 2. שלוף מכל המקורות ברשת — תמיד, לכל סינון
          const wantsSecondhand = !f.sources?.length || f.sources.includes('יד שנייה / יד2 מרקט')
          const wantsBrand      = !f.sources?.length || f.sources.includes('חנויות')

          // בנה query ליד2 מקטגוריה + צבע
          const CAT_YAD2 = {
            'שמלות': 'שמלה', 'עליוניות': 'חולצה', "ג'ינסים": "ג'ינס",
            'נעליים': 'נעליים', 'תיקים': 'תיק', 'אביזרים': 'תכשיט', "וינטאג'": 'וינטג',
          }
          const catQ      = f.category && f.category !== 'כל הפריטים' ? (CAT_YAD2[f.category] || f.category) : ''
          const colorQ    = f.colors?.length > 0 ? f.colors[0] : ''
          const yad2Q     = [catQ, colorQ].filter(Boolean).join(' ')
          // מילות הצבע הספציפיות — לסימון פריטי יד2 שמוזכר בהם הצבע ב-body_html
          const activeColorWords = f.colors?.length > 0
            ? f.colors.flatMap(c => COLOR_KEYWORDS[c] || [c])
            : []

          let brandItems = [], yad2FreshItems = []
          let brandDone = !wantsBrand, yad2Done = !wantsSecondhand

          const applyWhenReady = () => {
            if (!brandDone || !yad2Done) return
            // פריטי מותג מה-API כבר סוננו לפי צבע — סמן אותם כ"מאושרים" למניעת סינון כפול
            const trustedBrands = f.colors?.length > 0
              ? brandItems.map(p => ({ ...p, _colorMatch: true }))
              : brandItems
            const realBrands = trustedBrands.length > 0 ? trustedBrands : STATIC_PRODUCTS
            // פריטי יד2 שמילות הצבע מופיעות ב-body_html (לא בכותרת) — סמן כמאושרים
            const trustedYad2 = f.colors?.length > 0
              ? yad2FreshItems.map(p => p._colorBodyMatch ? { ...p, _colorMatch: true } : p)
              : yad2FreshItems
            const merged = wantsBrand && wantsSecondhand
              ? interleave50_50(realBrands, trustedYad2)
              : wantsBrand
                ? shuffle(realBrands)
                : shuffle(trustedYad2)
            if (merged.length > 0) {
              baseResultsRef.current = merged
              applyFiltersAndShow(merged)
            }
          }

          if (wantsBrand) {
            fetchAllBrandStores(f.colors ?? [])
              .then(items => { brandItems = items; brandDone = true; applyWhenReady() })
              .catch(() => { brandDone = true; applyWhenReady() })
          }
          if (wantsSecondhand) {
            fetchYad2AllFashion(yad2Q, activeColorWords)
              .then(items => { yad2FreshItems = items; yad2Done = true; applyWhenReady() })
              .catch(() => { yad2Done = true; applyWhenReady() })
          }
        }}
      />

      <Footer />
    </div>
  )
}

export default HomePage
