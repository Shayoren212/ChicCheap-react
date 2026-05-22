import { Heart } from 'lucide-react';

export default function ProductCard({ product, onOpen }) {
  return (
    <article className="stitch-product" onClick={() => onOpen(product)}>
      <div className="product-photo">
        <img src={product.image} alt={product.title} />
        <button>
          <Heart size={14} />
        </button>
      </div>

      <p>{product.title}</p>
      <strong>${product.price}.00</strong>
      <span>{product.condition}</span>
    </article>
  );
}