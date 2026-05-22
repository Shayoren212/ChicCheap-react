import { useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import ProductCard from '../components/ProductCard/ProductCard.jsx';
import FilterModal from '../components/FilterModal/FilterModal.jsx';
import { products } from '../data/products.js';

export default function LandingPage({ onSelectProduct }) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <section className="stitch-home">
      <SearchBar onFilter={() => setFiltersOpen(true)} />

      <div className="home-row">
        <h2>Trending Now</h2>
        <button>View all</button>
      </div>

      <div className="category-pills">
        <span className="active">All Styles</span>
        <span>Sustainable</span>
        <span>Vintage</span>
      </div>

      <section className="stitch-grid">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onOpen={onSelectProduct}
          />
        ))}
      </section>

      <button className="floating-plus">+</button>

      {filtersOpen && <FilterModal onClose={() => setFiltersOpen(false)} />}
    </section>
  );
}