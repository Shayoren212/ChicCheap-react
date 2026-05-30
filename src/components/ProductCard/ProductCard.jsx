import { useNavigate } from 'react-router-dom'
import './ProductCard.css'

/**
 * ProductCard — reusable product result card
 * Props:
 *   product: { id, storeName, price, imageUrl, sourceUrl }
 */
function ProductCard({ product }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${product.id}`)
  }

  return (
    <article className="product-card card" onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}>

      {/* Product Image placeholder */}
      <div className="product-card__image-wrapper">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.storeName}
            className="product-card__image"
          />
        ) : (
          <div className="product-card__image-placeholder" aria-hidden="true">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-card__info">
        <p className="product-card__store">{product.storeName}</p>
        <p className="product-card__price">₪{product.price}</p>
      </div>

      {/* Expand Arrow */}
      <button
        className="product-card__arrow"
        aria-label="פרטים נוספים"
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18l-6-6 6-6"/>
        </svg>
      </button>
    </article>
  )
}

export default ProductCard
