// FilterModal.jsx
import { useState } from 'react';

export default function FilterModal({ onClose }) {
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const brands = ['Zara', 'Mango', 'Nike', 'Prada', 'Local'];
  
  // הגדרת State לניהול טווח המחירים בזמן אמת
  const [price, setPrice] = useState(450);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Advanced filters">
      <aside className="filter-modal">
        <div className="modal-header">
          <h2>Filters</h2>
          <button onClick={onClose}>×</button>
        </div>
        
        <label>Category</label>
        <div className="chip-grid">
          {['Tops', 'Bottoms', 'Shoes', 'Accessories'].map(item => (
            <button key={item}>{item}</button>
          ))}
        </div>
        
        <label>Size</label>
        <div className="chip-grid small">
          {sizes.map(item => (
            <button key={item}>{item}</button>
          ))}
        </div>
        
        <label>Popular brands</label>
        <div className="chip-grid">
          {brands.map(item => (
            <button key={item}>{item}</button>
          ))}
        </div>
        
        {/* הצגת המחיר המשתנה דינמית מעל ה-Slider */}
        <label>Price range: ${price}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0 24px 0' }}>
          <span style={{ fontSize: '13px', color: '#7f8c8d', fontFamily: 'Manrope' }}>$0</span>
          <input 
            type="range" 
            min="0" 
            max="1000" 
            value={price} 
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#162839' }} 
          />
          <span style={{ fontSize: '13px', color: '#7f8c8d', fontFamily: 'Manrope' }}>$1000</span>
        </div>
        
        <div className="modal-actions">
          <button className="secondary-button" onClick={onClose}>Clear</button>
          <button className="primary-button" onClick={onClose}>Apply filters</button>
        </div>
      </aside>
    </div>
  );
}