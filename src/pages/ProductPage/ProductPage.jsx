import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Heart, Share2, ArrowRight, MapPin, ShoppingBag } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './ProductPage.css'

/* ── Dummy catalog (fallback כשאין מוצר אמיתי) ── */
const DUMMY_PRODUCTS = {
  '1': {
    id: '1', brand: 'MANGO', title: 'מעיל ווֹל טוויד קרם', tag: 'מציאה נדירה',
    price: 239, originalPrice: 420, savings: 181,
    size: 'S', condition: 'חדש עם תווית', location: 'אונליין · משלוח חינם',
    seller: 'MANGO Israel', url: '#',
    description: 'מעיל ווֹל קצר בסגנון טוויד קלאסי. מתאים לעונת המעבר. בד: 60% צמר, 40% פוליאסטר. עיצוב כפתורים כפולים.',
    imageUrl: null,
    colors: ['#d4c5b0', '#2c3e50', '#7b3f3f'],
  },
  '2': {
    id: '2', brand: 'Zara', title: 'חולצת כותנה מינימל לבנה', tag: null,
    price: 89, originalPrice: null, savings: null,
    size: 'M', condition: 'כמו חדש', location: 'רשת חנויות + אונליין',
    seller: 'Zara Israel', url: '#',
    description: 'חולצת פשתן לבנה עם כפתורים, חצי שרוול. בד: 100% לן אורגני.',
    imageUrl: null,
    colors: ['#ffffff', '#c2c9d6', '#d4c5b0'],
  },
  '3': {
    id: '3', brand: 'H&M', title: 'חצאית מידי פליסה ירוקה', tag: 'ירידת מחיר',
    price: 149, originalPrice: 220, savings: 71,
    size: 'S', condition: 'חדש', location: 'רשת חנויות + אונליין',
    seller: 'H&M Israel', url: '#',
    description: 'חצאית מידי בקפלים מלאים. בד: 100% פוליאסטר ממוחזר.',
    imageUrl: null,
    colors: ['#b5c9b8', '#2c3e50', '#d4c5b0'],
  },
  '4': {
    id: '4', brand: 'ASOS', title: 'שמלת ערב שחורה', tag: null,
    price: 185, originalPrice: null, savings: null,
    size: 'M', condition: 'טוב', location: 'אונליין בלבד',
    seller: 'ASOS', url: '#',
    description: 'שמלת ערב מידי, גזרה צמודה עם פתח בגב. בד: ג׳רסי.',
    imageUrl: null,
    colors: ['#2c3e50', '#7b3f3f', '#b5c9b8'],
  },
  '5': {
    id: '5', brand: 'Pull&Bear', title: 'מכנס קרגו בז׳', tag: null,
    price: 129, originalPrice: null, savings: null,
    size: 'S', condition: 'כמו חדש', location: 'רשת חנויות + אונליין',
    seller: 'Pull&Bear Israel', url: '#',
    description: 'מכנס קרגו עם כיסים גדולים, בד כותנה עמיד.',
    imageUrl: null,
    colors: ['#c9bfa8', '#2c3e50', '#7b3f3f'],
  },
  '6': {
    id: '6', brand: 'Massimo Dutti', title: 'חולצת משי קרם', tag: 'מציאה נדירה',
    price: 220, originalPrice: 380, savings: 160,
    size: 'M', condition: 'חדש', location: 'רשת חנויות + אונליין',
    seller: 'Massimo Dutti', url: '#',
    description: 'חולצת משי באיכות פרמיום, גזרה ישרה ומינימליסטית.',
    imageUrl: null,
    colors: ['#e8e0d5', '#d4c5b0', '#c9bfa8'],
  },
}

const SIMILAR_IDS = ['2', '3', '5', '6']

/* ── בונה URL חיפוש לפריט בחנות (כשאין קישור ספציפי) ── */
function buildStoreSearchUrl(storeUrl, title) {
  if (!storeUrl || storeUrl === '#') return null
  const q = encodeURIComponent(title)
  if (storeUrl.includes('hm.com'))         return `https://www2.hm.com/he_il/search-results.html?q=${q}`
  if (storeUrl.includes('zara.com'))        return `https://www.zara.com/il/he/search?searchTerm=${q}`
  if (storeUrl.includes('mango.com'))       return `https://shop.mango.com/il/search?q=${q}`
  if (storeUrl.includes('nautica.com'))     return `https://www.nautica.com/search?q=${q}`
  if (storeUrl.includes('nike.com'))        return `https://www.nike.com/il/search/results/?q=${q}`
  if (storeUrl.includes('adidas.co.il'))    return `https://www.adidas.co.il/search?q=${q}`
  return storeUrl
}

/* ── יוצר תיאור אוטומטי ממידע המוצר ── */
function buildDescription(p) {
  const parts = [`${p.title} מאת ${p.brand}.`]
  if (p.condition) parts.push(`מצב: ${p.condition}.`)
  if (p.size)      parts.push(`מידה: ${p.size}.`)
  if (p.location && p.location !== 'אונליין') parts.push(`מיקום: ${p.location}.`)
  return parts.join(' ')
}

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  const rawProduct   = location.state?.product   // מוצר שהועבר מ-HomePage
  const dummyFallback = DUMMY_PRODUCTS[id] || DUMMY_PRODUCTS['1']

  /* ── בניית אובייקט מוצר ── */
  const product = rawProduct ? {
    id:            rawProduct.id,
    brand:         rawProduct.brand,
    title:         rawProduct.title,
    price:         rawProduct.price,
    originalPrice: rawProduct.originalPrice ?? null,
    savings:       rawProduct.originalPrice
                     ? Math.round(rawProduct.originalPrice - rawProduct.price) : null,
    size:          rawProduct.size        ?? null,
    condition:     rawProduct.condition   ?? 'חדש',
    location:      rawProduct.location    ?? 'אונליין',
    seller:        rawProduct.brand,
    url:           rawProduct.link        ?? '#',
    description:   buildDescription(rawProduct),
    tag:           rawProduct.tag         ?? null,
    imageUrl:      rawProduct.imageUrl    ?? null,
    sourceType:    rawProduct.sourceType  ?? 'brand',
    productType:   rawProduct.productType ?? '',
    colors:        ['#f5f0eb', '#e8e0d5', '#d4c5b0'],
  } : dummyFallback

  const [activeThumb, setActiveThumb] = useState(0)
  const [liked, setLiked]   = useState(false)
  const [tracked, setTracked] = useState(false)
  const [imgError, setImgError] = useState(false)

  /* ── פריטים דומים: מתוך תוצאות עמוד הבית (sessionStorage) ──
     סדר עדיפות: (1) אותה קטגוריה + טווח מחיר דומה, (2) אותה קטגוריה, (3) טווח מחיר, (4) כלשהו
  ── */
  const similar = (() => {
    try {
      const cached = sessionStorage.getItem('cc_results')
      if (cached) {
        const all = JSON.parse(cached)
        const others = all.filter(p => String(p.id) !== String(id))
        const priceMin = (product.price || 0) * 0.4
        const priceMax = (product.price || 9999) * 2.5
        const sameType = product.productType
          ? others.filter(p => p.productType === product.productType)
          : []
        const byPrice  = others.filter(p => p.price >= priceMin && p.price <= priceMax)
        const sameTypeSimilarPrice = sameType.filter(p => p.price >= priceMin && p.price <= priceMax)

        const seen = new Set()
        const result = []
        for (const p of [...sameTypeSimilarPrice, ...sameType, ...byPrice, ...others]) {
          if (!seen.has(p.id)) {
            seen.add(p.id)
            result.push(p)
          }
          if (result.length >= 4) break
        }
        return result
      }
    } catch {}
    // fallback: פריטים דמה
    return SIMILAR_IDS.filter(sid => sid !== id).slice(0, 3).map(sid => DUMMY_PRODUCTS[sid])
  })()

  /* ── סטטוס לב + מעקב מחיר: בדיקה מ-localStorage (מהיר) ואח"כ Supabase ── */
  useEffect(() => {
    // localStorage — מיידי
    const store = JSON.parse(localStorage.getItem('cc_liked_products') || '{}')
    if (store[product.id]) setLiked(true)

    if (!user) return

    // בדיקת liked מ-Supabase
    supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle()
      .then(({ data }) => { if (data) setLiked(true) })

    // בדיקת tracked מ-Supabase — האם המשתמשת כבר עוקבת אחרי הפריט הזה
    supabase
      .from('notifications')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .eq('type', 'price_drop')
      .maybeSingle()
      .then(({ data }) => { if (data) setTracked(true) })
  }, [user, product.id])

  // איפוס שגיאת תמונה כשמחליפים מוצר
  useEffect(() => { setImgError(false) }, [product.id])

  const toggleLike = async () => {
    const store = JSON.parse(localStorage.getItem('cc_liked_products') || '{}')

    if (liked) {
      // הסרה מ-localStorage
      delete store[product.id]
      localStorage.setItem('cc_liked_products', JSON.stringify(store))
      setLiked(false)
      if (user) {
        await supabase.from('saved_items').delete().eq('user_id', user.id).eq('product_id', product.id)
      }
    } else {
      // שמירה ב-localStorage עם נתוני הפריט המלאים
      store[product.id] = {
        id:         product.id,
        brand:      product.brand,
        title:      product.title,
        price:      product.price,
        imageUrl:   product.imageUrl ?? null,
        imageColor: product.colors?.[0] ?? '#d4c5b0',
        link:       product.url ?? '#',
      }
      localStorage.setItem('cc_liked_products', JSON.stringify(store))
      setLiked(true)
      if (user) {
        await supabase.from('saved_items').insert({ user_id: user.id, product_id: product.id })
      }
    }
  }

  const toggleTracked = async () => {
    if (!user) return
    const newTracked = !tracked
    setTracked(newTracked)
    if (newTracked) {
      // upsert למניעת כפילויות במקרה של לחיצה כפולה
      await supabase.from('notifications').upsert(
        {
          user_id:     user.id,
          type:        'price_drop',
          title:       `${product.brand} — ${product.title}`,
          body:        'עוקבת אחר שינויי מחיר. נעדכן אותך כשהמחיר ישתנה.',
          product_id:  id,
          is_read:     false,
          image_color: product.colors[0],
        },
        { onConflict: 'user_id,product_id,type', ignoreDuplicates: true }
      )
    } else {
      // ביטול מעקב — מחיקת ההתראה
      await supabase.from('notifications')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id)
        .eq('type', 'price_drop')
    }
  }

  /* ── גלרייה: תמונה אמיתית או ריבוע צבע ── */
  const hasImage = !!product.imageUrl && !imgError

  return (
    <div className="page product-page">
      <Navbar />

      <main className="product-main page-inner fade-in">

        {/* Breadcrumbs */}
        <nav className="product-breadcrumbs" aria-label="ניווט">
          <Link to="/home" className="product-breadcrumbs__link">בית</Link>
          <ArrowRight size={12} className="product-breadcrumbs__sep" />
          <span className="product-breadcrumbs__link">{product.brand}</span>
          <ArrowRight size={12} className="product-breadcrumbs__sep" />
          <span className="product-breadcrumbs__current">{product.title}</span>
        </nav>

        {/* Layout */}
        <div className="product-layout">

          {/* Gallery */}
          <div className="product-gallery">
            <div
              className="product-gallery__main"
              style={
                hasImage
                  ? { backgroundImage: `url(${product.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#f5f0eb' }
                  : { backgroundColor: product.colors[activeThumb] }
              }
            >
              {/* hidden img tag to detect load errors */}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt=""
                  style={{ display: 'none' }}
                  onError={() => setImgError(true)}
                />
              )}

              {product.tag && (
                <span className="product-gallery__tag">{product.tag}</span>
              )}
              <button
                className={`product-gallery__heart ${liked ? 'product-gallery__heart--active' : ''}`}
                onClick={toggleLike}
                aria-label={liked ? 'הסר ממועדפים' : 'הוסף למועדפים'}
              >
                <Heart size={20} fill={liked ? '#7b5455' : 'none'} />
              </button>
            </div>

            {/* Thumbnails — מוצגים רק כשאין תמונה אמיתית */}
            {!hasImage && (
              <div className="product-gallery__thumbs">
                {product.colors.map((color, i) => (
                  <button
                    key={i}
                    className={`product-gallery__thumb ${activeThumb === i ? 'product-gallery__thumb--active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setActiveThumb(i)}
                    aria-label={`תמונה ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <p className="product-info__brand">{product.brand}</p>
            <h1 className="product-info__title">{product.title}</h1>

            <div className="product-info__price-block">
              <span className="product-info__price">₪{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="product-info__original">₪{product.originalPrice}</span>
                  {product.savings && (
                    <span className="product-info__savings">חיסכון של ₪{product.savings}</span>
                  )}
                </>
              )}
            </div>

            <dl className="product-bento">
              {product.size && (
                <div className="product-bento__cell">
                  <dt className="product-bento__label">מידה</dt>
                  <dd className="product-bento__value">{product.size}</dd>
                </div>
              )}
              <div className={`product-bento__cell${!product.size ? '' : ''}`}>
                <dt className="product-bento__label">מצב</dt>
                <dd className="product-bento__value">{product.condition}</dd>
              </div>
              <div className="product-bento__cell product-bento__cell--wide">
                <dt className="product-bento__label">
                  <MapPin size={12} />
                  מיקום / משלוח
                </dt>
                <dd className="product-bento__value">{product.location}</dd>
              </div>
              <div className="product-bento__cell product-bento__cell--wide">
                <dt className="product-bento__label">
                  <ShoppingBag size={12} />
                  {product.sourceType === 'secondhand' ? 'מוכר/ת · יד2 מרקט' : 'מוכר/ת'}
                </dt>
                <dd className="product-bento__value">
                  {product.sourceType === 'secondhand' && product.url && product.url !== '#' ? (
                    <a href={product.url} target="_blank" rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>
                      {product.seller}{product.location && product.location !== 'אונליין' ? ` · ${product.location}` : ''}
                    </a>
                  ) : (
                    product.seller
                  )}
                </dd>
              </div>
            </dl>

            <p className="product-info__desc">{product.description}</p>

            <div className="product-info__ctas">
              {product.url && product.url.includes('/products/') ? (
                <a
                  href={product.url}
                  className="product-cta product-cta--primary"
                  target="_blank" rel="noopener noreferrer"
                >
                  {product.sourceType === 'secondhand' ? 'למודעה ביד2 מרקט ←' : 'לרכישה ←'}
                </a>
              ) : product.sourceType === 'secondhand' ? (
                <a
                  href="https://market.yad2.co.il"
                  className="product-cta product-cta--primary"
                  target="_blank" rel="noopener noreferrer"
                >
                  חיפוש ביד2 מרקט ←
                </a>
              ) : (() => {
                const searchUrl = buildStoreSearchUrl(product.url, product.title)
                return searchUrl ? (
                  <a
                    href={searchUrl}
                    className="product-cta product-cta--primary"
                    target="_blank" rel="noopener noreferrer"
                  >
                    {product.url?.includes('/products/') ? 'לרכישה ←' : `חיפוש ב${product.brand} ←`}
                  </a>
                ) : (
                  <span className="product-cta product-cta--primary" style={{ opacity: 0.4, cursor: 'default' }}>
                    קישור לא זמין
                  </span>
                )
              })()}
              <button className="product-cta product-cta--ghost" onClick={toggleTracked}>
                {tracked ? '✓ עוקבת אחרי המחיר' : 'עקבי אחרי המחיר'}
              </button>
              <button
                className="product-cta product-cta--icon"
                aria-label="שתפי"
                onClick={() => navigator.share?.({ title: product.title, url: window.location.href })}
              >
                <Share2 size={18} />
              </button>
            </div>

            {tracked && (
              <p className="product-info__track-note fade-in">
                נשלח התראה כשהמחיר ירד 🔔
              </p>
            )}
          </div>
        </div>

        {similar.length > 0 && (
          <section className="product-similar">
            <h2 className="product-similar__title">אולי תאהבי גם</h2>
            <div className="product-similar__grid">
              {similar.map(s => (
                <button
                  key={s.id}
                  className="product-similar__card"
                  onClick={() => navigate(`/product/${s.id}`, { state: { product: s } })}
                >
                  <div
                    className="product-similar__img"
                    style={
                      s.imageUrl
                        ? { backgroundImage: `url(${s.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: s.imageColor || s.colors?.[0] || '#d4c5b0' }
                    }
                  />
                  <p className="product-similar__brand">{s.brand}</p>
                  <p className="product-similar__title">{s.title}</p>
                  <p className="product-similar__price">₪{s.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default ProductPage
ct-similar__title">{s.title}</p>
                  <p className="product-similar__price">₪{s.price}</p>
                </button>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
    </div>
  )
}

export default ProductPage
