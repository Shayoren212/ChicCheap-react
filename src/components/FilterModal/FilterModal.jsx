import { useState } from 'react'
import './FilterModal.css'

/**
 * FilterModal — pop-up overlay for filtering search results
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   onApply: (filters) => void
 */

const CATEGORIES = ['בגדים', 'נעליים', 'תכשיטים', 'אביזרים']
const ITEM_TYPES  = ['חולצות', 'שמלות', 'מכנסיים', 'ג\'קטים', 'חצאיות', 'קרדיגנים', 'טי-שרט', 'קפוצ\'ונים']
const COLORS      = ['שחור', 'לבן', 'אדום', 'כחול', 'ירוק', 'צהוב', 'ורוד', 'חום']
const SIZES       = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'one size']
const CONDITIONS  = ['חדש', 'מצב מצוין', 'מצב טוב']
const SOURCES     = ['חנויות', 'יד שנייה', 'פייסבוק מרקטפלייס', 'אינסטגרם', 'eBay']

function FilterModal({ isOpen, onClose, onApply }) {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTypes, setSelectedTypes]       = useState([])
  const [selectedColors, setSelectedColors]     = useState([])
  const [selectedSizes, setSelectedSizes]       = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedSources, setSelectedSources]   = useState([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(2000)

  if (!isOpen) return null

  const toggle = (list, setter, value) => {
    setter(list.includes(value)
      ? list.filter(v => v !== value)
      : [...list, value])
  }

  const handleApply = () => {
    onApply({
      category: selectedCategory,
      types: selectedTypes,
      colors: selectedColors,
      sizes: selectedSizes,
      conditions: selectedConditions,
      sources: selectedSources,
      priceRange: [minPrice, maxPrice],
    })
    onClose()
  }

  const handleReset = () => {
    setSelectedCategory('')
    setSelectedTypes([])
    setSelectedColors([])
    setSelectedSizes([])
    setSelectedConditions([])
    setSelectedSources([])
    setMinPrice(0)
    setMaxPrice(2000)
  }

  return (
    <div className="filter-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="סינון תוצאות">
      <div className="filter-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="filter-modal__header">
          <h2 className="filter-modal__title">סינון ומיון</h2>
          <button className="filter-modal__close" onClick={onClose} aria-label="סגור">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="filter-modal__body no-scrollbar">

          {/* Category */}
          <section className="filter-section">
            <p className="filter-section__label">קטגוריה:</p>
            <div className="filter-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Item Type */}
          <section className="filter-section">
            <p className="filter-section__label">סוג פריט:</p>
            <div className="filter-chips filter-chips--grid">
              {ITEM_TYPES.map(t => (
                <button
                  key={t}
                  className={`filter-chip ${selectedTypes.includes(t) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedTypes, setSelectedTypes, t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </section>

          {/* Color */}
          <section className="filter-section">
            <p className="filter-section__label">צבע:</p>
            <div className="filter-chips filter-chips--grid">
              {COLORS.map(c => (
                <button
                  key={c}
                  className={`filter-chip ${selectedColors.includes(c) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedColors, setSelectedColors, c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          {/* Size */}
          <section className="filter-section">
            <p className="filter-section__label">מידה:</p>
            <div className="filter-chips">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`filter-chip ${selectedSizes.includes(s) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedSizes, setSelectedSizes, s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          {/* Condition */}
          <section className="filter-section">
            <p className="filter-section__label">מצב הפריט:</p>
            <div className="filter-chips">
              {CONDITIONS.map(cond => (
                <button
                  key={cond}
                  className={`filter-chip ${selectedConditions.includes(cond) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedConditions, setSelectedConditions, cond)}
                >
                  {cond}
                </button>
              ))}
            </div>
          </section>

          {/* Source */}
          <section className="filter-section">
            <p className="filter-section__label">מקור:</p>
            <div className="filter-chips filter-chips--wrap">
              {SOURCES.map(src => (
                <button
                  key={src}
                  className={`filter-chip ${selectedSources.includes(src) ? 'filter-chip--active' : ''}`}
                  onClick={() => toggle(selectedSources, setSelectedSources, src)}
                >
                  {src}
                </button>
              ))}
            </div>
          </section>

          {/* Price Range */}
          <section className="filter-section">
            <p className="filter-section__label">טווח מחיר: ₪{minPrice} – ₪{maxPrice}</p>
            <div className="filter-price-range">
              <input
                type="range" min="0" max="2000" step="10"
                value={minPrice}
                onChange={e => setMinPrice(Number(e.target.value))}
                className="filter-range-input"
                aria-label="מחיר מינימום"
              />
              <input
                type="range" min="0" max="2000" step="10"
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="filter-range-input"
                aria-label="מחיר מקסימום"
              />
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="filter-modal__footer">
          <button className="btn btn--secondary btn--sm" onClick={handleReset}>
            איפוס
          </button>
          <button className="btn btn--primary" onClick={handleApply}>
            הצג תוצאות
          </button>
        </div>

      </div>
    </div>
  )
}

export default FilterModal
