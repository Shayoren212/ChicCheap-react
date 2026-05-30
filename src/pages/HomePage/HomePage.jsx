import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import FilterModal from '../../components/FilterModal/FilterModal'
import { Camera, SlidersHorizontal, Search, Heart } from 'lucide-react'
import './HomePage.css'

const CATEGORIES = [
  'כל הפריטים', 'שמלות', 'עליוניות', 'ג׳ינסים', 'נעליים', 'תיקים', 'אביזרים', 'וינטאג׳',
]

const DUMMY_PRODUCTS = [
  { id: '1', brand: 'MANGO',       title: 'מעיל ווֹל טוויד',       price: 239, originalPrice: 420, size: 'S',  condition: 'חדש',      tag: 'מציאה נדירה',  imageColor: '#d4c5b0' },
  { id: '2', brand: 'Zara',        title: 'חולצת כותנה מינימל',     price: 89,  originalPrice: null, size: 'M', condition: 'כמו חדש', tag: null,            imageColor: '#c2c9d6' },
  { id: '3', brand: 'H&M',         title: 'חצאית מידי פליסה',       price: 149, originalPrice: 220, size: 'S',  condition: 'חדש',      tag: 'ירידת מחיר',   imageColor: '#b5c9b8' },
  { id: '4', brand: 'ASOS',        title: 'שמלת ערב שחורה',         price: 185, originalPrice: null, size: 'M', condition: 'טוב',      tag: null,            imageColor: '#2c3e50' },
  { id: '5', brand: 'Yad2',        title: 'ז׳קט עור בורדו',         price: 180, originalPrice: null, size: 'L', condition: 'טוב',      tag: 'מציאה נדירה',  imageColor: '#7b3f3f' },
  { id: '6', brand: 'Shein',       title: 'סרבל קיץ פרחוני',        price: 49,  originalPrice: 89,  size: 'XS', condition: 'חדש',      tag: 'ירידת מחיר',   imageColor: '#e8c9c0' },
  { id: '7', brand: 'Pull&Bear',   title: 'מכנס קרגו בז׳',          price: 129, originalPrice: null, size: 'S', condition: 'כמו חדש', tag: null,            imageColor: '#c9bfa8' },
  { id: '8', brand: 'Massimo Dutti', title: 'חולצת משי קרם',        price: 220, originalPrice: 380, size: 'M',  condition: 'חדש',      tag: 'מציאה נדירה',  imageColor: '#e8e0d5' },
]

function ProductMasonryCard({ product, onClick, liked, onLike }) {
  return (
    <article className="masonry-card" onClick={onClick}>
      <div className="masonry-card__img" style={{ backgroundColor: product.imageColor }}>
        {product.tag && (
          <span className="masonry-card__tag">{product.tag}</span>
        )}
        <button
          className={`masonry-card__heart ${liked ? 'masonry-card__heart--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onLike(product.id) }}
          aria-label="שמור למועדפים"
        >
          <Heart size={16} fill={liked ? '#7b5455' : 'none'} />
        </button>
      </div>
      <div className="masonry-card__info">
        <p className="masonry-card__brand">{product.brand}</p>
        <p className="masonry-card__title">{product.title}</p>
        <div className="masonry-card__price-row">
          <span className="masonry-card__price">&#8362;{product.price}</span>
          {product.originalPrice && (
            <span className="masonry-card__original">&#8362;{product.originalPrice}</span>
          )}
        </div>
        <p className="masonry-card__meta">{product.size} · {product.condition}</p>
      </div>
    </article>
  )
}

function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery]               = useState('')
  const [activeCategory, setActiveCategory] = useState('כל הפריטים')
  const [results, setResults]           = useState(DUMMY_PRODUCTS)
  const [loading, setLoading]           = useState(false)
  const [filterOpen, setFilterOpen]     = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [liked, setLiked]               = useState(new Set())
  const fileInputRef = useRef(null)

  const handleSearch = (e) => {
    e.preventDefault()
    if (!query && !imagePreview) return
    setLoading(true)
    setTimeout(() => {
      setResults(DUMMY_PRODUCTS)
      setLoading(false)
    }, 900)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const toggleLike = (id) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="page home-page">
      <Navbar />

      <section className="home-hero">
        <div className="home-hero__bg" aria-hidden="true" />
        <div className="home-hero__overlay" aria-hidden="true" />

        <div className="home-hero__content">
          <h1 className="home-hero__title">מה את מחפשת?</h1>
          <p className="home-hero__sub">תאארי את הפריט שחלמת עליו — נמצא לך אותו במחיר הכי טוב ברשת</p>

          <form className="home-hero__form" onSubmit={handleSearch}>
            {imagePreview && (
              <div className="home-hero__img-preview">
                <img src={imagePreview} alt="תמונת חיפוש" />
                <button type="button" className="home-hero__remove-img" onClick={() => setImagePreview(null)}>x</button>
              </div>
            )}

            <div className="home-hero__search-bar">
              <Search size={18} className="home-hero__search-icon" />
              <input
                type="text"
                className="home-hero__input"
                placeholder="תארי את הפריט (למשל: מעיל וינטג׳ בז׳)..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="home-hero__camera-btn"
                onClick={() => fileInputRef.current?.click()}
                title="חיפוש לפי תמונה"
              >
                <Camera size={16} />
                <span>חיפוש חזותי</span>
              </button>
              <button
                type="button"
                className="home-hero__filter-btn"
                onClick={() => setFilterOpen(true)}
                title="סינון מתקדם"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>

            <button
              type="submit"
              className="home-hero__submit"
              disabled={loading || (!query && !imagePreview)}
            >
              {loading ? <span className="loading-spinner" /> : 'חפשי עכשיו'}
            </button>
          </form>
        </div>
      </section>

      <section className="home-categories">
        <div className="home-categories__scroll no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`home-category-pill ${activeCategory === cat ? 'home-category-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <main className="home-results page-inner">
        <div className="home-results__header">
          <h2 className="home-results__title">
            {activeCategory === 'כל הפריטים' ? 'גילויים עבורך' : activeCategory}
          </h2>
          <span className="home-results__count">{results.length} פריטים</span>
        </div>

        {loading ? (
          <div className="home-loading">
            <span className="loading-spinner" />
            <p>מחפשת את הכי זול ברשת...</p>
          </div>
        ) : (
          <div className="home-masonry">
            {results.map(product => (
              <ProductMasonryCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/product/${product.id}`)}
                liked={liked.has(product.id)}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </main>

      <FilterModal
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={(f) => console.log('filters:', f)}
      />

      <Footer />
    </div>
  )
}

export default HomePage
