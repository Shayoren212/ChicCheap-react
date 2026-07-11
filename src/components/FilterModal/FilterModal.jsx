import { useState, useEffect } from 'react'
import './FilterModal.css'

const CATEGORIES = ['כל הפריטים', 'שמלות', 'עליוניות', "ג'ינסים", 'נעליים', 'תיקים', 'אביזרים', "וינטאג'"]
const CONDITIONS = ['חדש', 'מצב מצוין', 'מצב טוב']
const SOURCES    = ['חנויות', 'יד שנייה / יד2 מרקט']
const MAX_PRICE  = 2000
const COLORS = [
  { label: 'שחור', hex: '#1a1a1a' },
  { label: 'לבן',  hex: '#f5f5f0' },
  { label: 'בז׳',  hex: '#d4c5b0' },
  { label: 'אדום', hex: '#c0392b' },
  { label: 'כחול', hex: '#2c5f8a' },
  { label: 'ירוק', hex: '#4a7c59' },
  { label: 'ורוד', hex: '#e8a0b0' },
  { label: 'חום',  hex: '#7b5c3f' },
]

/* ── Dual-handle range slider ── */
function DualRange({ minVal, maxVal, onChange }) {
  const pct = v => ((v / MAX_PRICE) * 100).toFixed(1) + '%'

  const handleMin = e => {
    const v = Math.min(Number(e.target.value), maxVal - 50)
    onChange(v, maxVal)
  }
  const handleMax = e => {
    const v = Math.max(Number(e.target.value), minVal + 50)
    onChange(minVal, v)
  }

  return (
    <div className="dual-range">
      {/* Colored fill track */}
      <div
        className="dual-range__fill"
        style={{ left: pct(minVal), width: `calc(${pct(maxVal)} - ${pct(minVal)})` }}
      />
      <input
        type="range" min="0" max={MAX_PRICE} step="10"
        value={minVal}
        onChange={handleMin}
        className="dual-range__input dual-range__input--min"
        aria-label="מחיר מינימום"
      />
      <input
        type="range" min="0" max={MAX_PRICE} step="10"
        value={maxVal}
        onChange={handleMax}
        className="dual-range__input dual-range__input--max"
        aria-label="מחיר מקסימום"
      />
    </div>
  )
}

function FilterModal({ isOpen, onClose, onApply, activeFilters }) {
  const [selectedColors, setSelectedColors]         = useState([])
  const [selectedCategory, setSelectedCategory]     = useState('כל הפריטים')
  const [selectedConditions, setSelectedConditions] = useState([])
  const [selectedSources, setSelectedSources]       = useState([])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)

  // שחזר סינון קודם בכל פתיחה
  useEffect(() => {
    if (!isOpen) return
    setSelectedColors(activeFilters?.colors ?? [])
    setSelectedCategory(activeFilters?.category ?? 'כל הפריטים')
    setSelectedConditions(activeFilters?.conditions ?? [])
    setSelectedSources(activeFilters?.sources ?? [])
    setMinPrice(activeFilters?.priceRange?.[0] ?? 0)
    setMaxPrice(activeFilters?.priceRange?.[1] ?? MAX_PRICE)
  }, [isOpen])

  if (!isOpen) return null

  const toggle = (list, setter, value) =>
    setter(list.includes(value) ? list.filter(v => v !== value) : [...list, value])

  const handleApply = () => {
    onApply({
      colors:     selectedColors,
      category:   selectedCategory,
      conditions: selectedConditions,
      sources:    selectedSources,
      priceRange: [minPrice, maxPrice],
    })
    onClose()
  }

  const handleReset = () => {
    setSelectedColors([])
    setSelectedCategory('כל הפריטים')
    setSelectedConditions([])
    setSelectedSources([])
    setMinPrice(0)
    setMaxPrice(MAX_PRICE)
    onApply({ colors: [], category: 'כל הפריטים', conditions: [], sources: [], priceRange: [0, MAX_PRICE] })
    onClose()
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

        {/* Body */}
        <div className="filter-modal__body no-scrollbar">

          {/* Price Range */}
          <section className="filter-section">
            <div className="filter-section__label-row">
              <p className="filter-section__label">טווח מחיר</p>
              <span className="filter-price-vals">₪{minPrice} – ₪{maxPrice === MAX_PRICE ? MAX_PRICE + '+' : maxPrice}</span>
            </div>
            <DualRange
              minVal={minPrice}
              maxVal={maxPrice}
              onChange={(min, max) => { setMinPrice(min); setMaxPrice(max) }}
            />
          </section>

          {/* Color */}
          <section className="filter-section">
            <p className="filter-section__label">צבע:</p>
            <div className="filter-color-swatches">
              {COLORS.map(c => (
                <button
                  key={c.label}
                  className={`filter-swatch ${selectedColors.includes(c.label) ? 'filter-swatch--active' : ''}`}
                  style={{ '--swatch-color': c.hex }}
                  onClick={() => toggle(selectedColors, setSelectedColors, c.label)}
                  title={c.label}
                  aria-label={c.label}
                />
              ))}
            </div>
          </section>

          {/* Category */}
          <section className="filter-section">
            <p className="filter-section__label">קטגוריה:</p>
            <div className="filter-chips filter-chips--wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${selectedCategory === cat ? 'filter-chip--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >{cat}</button>
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
                >{cond}</button>
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

        </div>

        {/* Footer */}
        <div className="filter-modal__footer">
          <button className="filter-btn filter-btn--reset" onClick={handleReset}>
            איפוס
          </button>
          <button className="filter-btn filter-btn--apply" onClick={handleApply}>
            הצג תוצאות
          </button>
        </div>

      </div>
    </div>
  )
}

export default FilterModal
