import { ArrowLeft, Bell, ExternalLink, Heart, ShieldCheck } from 'lucide-react';

export default function ProductPage({ product, onNavigate }) {
  if (!product) return null;

  return (
    <section className="product-page">
      <button className="back-link" onClick={() => onNavigate('landing')}>
        <ArrowLeft size={16} />
        Back to results
      </button>

      <article className="stitch-product-detail">
        <div className="detail-image-wrap">
          <img src={product.image} alt={product.title} />
          <button className="detail-heart">
            <Heart size={18} />
          </button>
        </div>

        <div className="detail-info-panel">
          <p className="detail-tag">{product.condition}</p>

          <h1>{product.title}</h1>

          <p className="detail-meta">
            {product.store} · {product.location}
          </p>

          <div className="detail-price">
            ${product.price}.00
            <span>${product.oldPrice}.00</span>
          </div>

          <div className="match-box">
            <strong>{product.match}% match</strong>
            <p>Matched by shape, color palette, category and price.</p>
          </div>

          <div className="detail-actions">
            <button className="primary-button">
              <ExternalLink size={17} />
              Go to store
            </button>

            <button className="secondary-button">
              <Bell size={17} />
              Track price
            </button>
          </div>

          <div className="trust-box">
            <ShieldCheck size={18} />
            Includes store, price, delivery area, condition and stock status.
          </div>
        </div>
      </article>
    </section>
  );
}