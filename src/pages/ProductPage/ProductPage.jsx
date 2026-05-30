import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Heart, Share2, ArrowRight, MapPin, ExternalLink, MessageCircle } from 'lucide-react'
import './ProductPage.css'

/**
 * sourceType:
 *   'brand'      — פריט מרשת (לינק לאתר הרשת)
 *   'secondhand' — פריט יד שנייה (WhatsApp / פייסבוק / יד2)
 */
const DUMMY_PRODUCTS = {
  '1': {
    id: '1', brand: 'MANGO', title: 'מעיל ווֹל טוויד קרם',
    tag: 'מציאה נדירה', price: 239, originalPrice: 420, savings: 181,
    size: 'S', condition: 'חדש עם תווית',
    location: 'אונליין · משלוח חינם', seller: 'MANGO Israel',
    sourceType: 'brand',
    externalUrl: 'https://www.mango.com/il',
    externalLabel: 'צפי בפריט באתר MANGO',
    description: 'מעיל ווֹל קצר בסגנון טוויד קלאסי. מתאים לעונת המעבר. בד: 60% צמר, 40% פוליאסטר.',
    colors: ['#d4c5b0', '#2c3e50', '#7b3f3f'],
  },
  '2': {
    id: '2', brand: 'Zara', title: 'חולצת כותנה מינימל לבנה',
    tag: null, price: 89, originalPrice: null, savings: null,
    size: 'M', condition: 'כמו חדש',
    location: 'רשת חנויות + אונליין', seller: 'Zara Israel',
    sourceType: 'brand',
    externalUrl: 'https://www.zara.com/il',
    externalLabel: 'צפי בפריט באתר Zara',
    description: 'חולצת פשתן לבנה עם כפתורים, חצי שרוול. בד: 100% לן אורגני.',
    colors: ['#ffffff', '#c2c9d6', '#d4c5b0'],
  },
  '3': {
    id: '3', brand: 'H&M', title: 'חצאית מידי פליסה ירוקה',
    tag: 'ירידת מחיר', price: 149, originalPrice: 220, savings: 71,
    size: 'S', condition: 'חדש',
    location: 'רשת חנויות + אונליין', seller: 'H&M Israel',
    sourceType: 'brand',
    externalUrl: 'https://www2.hm.com/il_il',
    externalLabel: 'צפי בפריט באתר H&M',
    description: 'חצאית מידי בקפלים מלאים. בד: 100% פוליאסטר ממוחזר.',
    colors: ['#b5c9b8', '#2c3e50', '#d4c5b0'],
  },
  '4': {
    id: '4', brand: 'ASOS', title: 'שמלת ערב שחורה',
    tag: null, price: 185, originalPrice: null, savings: null,
    size: 'M', condition: 'טוב',
    location: 'אונליין בלבד', seller: 'ASOS',
    sourceType: 'brand',
    externalUrl: 'https://www.asos.com',
    externalLabel: 'צפי בפריט באתר ASOS',
    description: 'שמלת ערב מידי, גזרה צמודה עם פתח בגב. בד: ג׳רסי.',
    colors: ['#2c3e50', '#7b3f3f', '#b5c9b8'],
  },
  '5': {
    id: '5', brand: 'יד שנייה', title: 'ז׳קט עור בורדו וינטאג׳',
    tag: 'מציאה נדירה', price: 180, originalPrice: null, savings: null,
    size: 'L', condition: 'טוב',
    location: 'תל אביב · איסוף עצמי', seller: 'שירי מ.',
    sourceType: 'secondhand',
    contactType: 'whatsapp',
    contactValue: '972501234567',
    contactLabel: 'שלחי הודעה לשירי',
    description: 'ז׳קט עור אמיתי בצבע בורדו עמוק. עיצוב שנות ה-90, מצב מעולה. איסוף מתל אביב בלבד.',
    colors: ['#7b3f3f', '#2c3e50', '#c9bfa8'],
  },
  '6': {
    id: '6', brand: 'Shein', title: 'סרבל קיץ פרחוני מתוק',
    tag: 'ירידת מחיר', price: 49, originalPrice: 89, savings: 40,
    size: 'XS', condition: 'חדש עם תווית',
    location: 'אונליין · משלוח', seller: 'Shein',
    sourceType: 'brand',
    externalUrl: 'https://www.shein.com',
    externalLabel: 'צפי בפריט באתר Shein',
    description: 'סרבל קיץ עם הדפס פרחים עדין. גזרה מרווחת ונוחה.',
    colors: ['#e8c9c0', '#b5c9b8', '#c2c9d6'],
  },
}

const SIMILAR_IDS = ['2', '3', '5', '6']

function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = DUMMY_PRODUCTS[id] || DUMMY_PRODUCTS['1']

  const [activeThumb, setActiveThumb] = useState(0)
  const [liked, setLiked]             = useState(false)
  const [tracked, setTracked]         = useState(false)

  const similar = SIMILAR_IDS.filter(sid => sid !== id).slice(0, 3).map(sid => DUMMY_PRODUCTS[sid])

  /* ── CTA based on source type ── */
  const renderCTA = () => {
    if (product.sourceType === 'brand') {
      return (
        <a
          href={product.externalUrl}
          className="product-cta product-cta--primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          {product.externalLabel}
        </a>
      )
    }

    if (product.contactType === 'whatsapp') {
      const msg = encodeURIComponent(`היי! ראיתי את המודעה שלך ב-ChicCheap — ${product.title} ב-₪${product.price}. האם הפריט עדיין זמין?`)
      return (
        <a
          href={`https://wa.me/${product.contactValue}?text=${msg}`}
          className="product-cta product-cta--whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <MessageCircle size={16} />
          {product.contactLabel}
        </a>
      )
    }

    if (product.contactType === 'facebook') {
      return (
        <a
          href={product.contactValue}
          className="product-cta product-cta--primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={16} />
          {product.contactLabel}
        </a>
      )
    }

    return null
  }

  return (
    <div className="page product-page">
      <Navbar />

      <main className="product-main page-inner fade-in">

        <nav className="product-breadcrumbs" aria-label="ניווט">
          <Link to="/home" className="product-breadcrumbs__link">בית</Link>
          <ArrowRight size={12} className="product-breadcrumbs__sep" />
          <span className="product-breadcrumbs__link">{product.brand}</span>
          <ArrowRight size={12} className="product-breadcrumbs__sep" />
          <span className="product-breadcrumbs__current">{product.title}</span>
        </nav>

        <div className="product-layout">

          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery__main" style={{ backgroundColor: product.colors[activeThumb] }}>
              {product.tag && (
                <span className="product-gallery__tag">{product.tag}</span>
              )}
              <button
                className={`product-gallery__heart ${liked ? 'product-gallery__heart--active' : ''}`}
                onClick={() => setLiked(!liked)}
                aria-label={liked ? 'הסר ממועדפים' : 'הוסף למועדפים'}
              >
                <Heart size={20} fill={liked ? '#7b5455' : 'none'} />
              </button>
            </div>
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
          </div>

          {/* Info panel */}
          <div className="product-info">
            <p className="product-info__brand">{product.brand}</p>
            <h1 className="product-info__title">{product.title}</h1>

            {/* Source badge */}
            <span className={`product-source-badge ${product.sourceType === 'secondhand' ? 'product-source-badge--secondhand' : 'product-source-badge--brand'}`}>
              {product.sourceType === 'secondhand' ? 'יד שנייה' : 'חנות רשמית'}
            </span>

            <div className="product-info__price-block">
              <span className="product-info__price">&#8362;{product.price}</span>
              {product.originalPrice && (
                <>
                  <span className="product-info__original">&#8362;{product.originalPrice}</span>
                  <span className="product-info__savings">חיסכון &#8362;{product.savings}</span>
                </>
              )}
            </div>

            <dl className="product-bento">
              <div className="product-bento__cell">
                <dt className="product-bento__label">מידה</dt>
                <dd className="product-bento__value">{product.size}</dd>
              </div>
              <div className="product-bento__cell">
                <dt className="product-bento__label">מצב</dt>
                <dd className="product-bento__value">{product.condition}</dd>
              </div>
              <div className="product-bento__cell product-bento__cell--wide">
                <dt className="product-bento__label">
                  <MapPin size={12} />
                  {product.sourceType === 'secondhand' ? 'מיקום' : 'זמינות'}
                </dt>
                <dd className="product-bento__value">{product.location}</dd>
              </div>
              <div className="product-bento__cell product-bento__cell--wide">
                <dt className="product-bento__label">
                  {product.sourceType === 'secondhand' ? 'מוכר/ת' : 'מקור'}
                </dt>
                <dd className="product-bento__value">{product.seller}</dd>
              </div>
            </dl>

            <p className="product-info__desc">{product.description}</p>

            {/* CTA row */}
            <div className="product-info__ctas">
              {renderCTA()}

              <button
                className="product-cta product-cta--ghost"
                onClick={() => setTracked(t => !t)}
              >
                {tracked ? 'עוקבת אחרי המחיר ✓' : 'עדכני אותי על שינויי מחיר'}
              </button>

              <button
                className="product-cta product-cta--icon"
                aria-label="שתפי"
                onClick={() => navigator.share && navigator.share({ title: product.title, url: window.location.href })}
              >
                <Share2 size={18} />
              </button>
            </div>

            {tracked && (
              <p className="product-info__track-note fade-in">
                נשלח לך התראה כשהמחיר ישתנה
              </p>
            )}

            {/* Disclaimer */}
            <p className="product-info__disclaimer">
              {product.sourceType === 'brand'
                ? 'הקישור מוביל לאתר הרשת הרשמי. ChicCheap אינה מוכרת את הפריט ישירות.'
                : 'זהו פריט יד שנייה. ChicCheap מקשרת בינך לבין המוכר/ת — הרכישה מתבצעת ישירות ביניכם.'}
            </p>
          </div>
        </div>

        {/* Similar products */}
        {similar.length > 0 && (
          <section className="product-similar">
            <h2 className="product-similar__title">אולי תאהבי גם</h2>
            <div className="product-similar__grid">
              {similar.map(s => (
                <button key={s.id} className="product-similar__card" onClick={() => navigate(`/product/${s.id}`)}>
                  <div className="product-similar__img" style={{ backgroundColor: s.colors[0] }} />
                  <p className="product-similar__brand">{s.brand}</p>
                  <p className="product-similar__price">&#8362;{s.price}</p>
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
