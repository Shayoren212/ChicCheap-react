import { Camera, SlidersHorizontal, Search } from 'lucide-react';

export default function SearchBar({ onFilter, onSearch, onImageUpload }) {
  return (
    <section className="stitch-hero">
      <h2>מה את מחפשת?</h2>

      <div className="stitch-search-box">
        <Search size={16} />
        <input
          placeholder="תארי את הפריט (למשל: מעיל וינטג׳ בז׳)"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
      </div>

      <div className="stitch-action-row">
        <button onClick={onImageUpload}>
          <Camera size={16} />
          חיפוש לפי תמונה
        </button>

        <button onClick={onFilter}>
          <SlidersHorizontal size={16} />
          סינון מתקדם
        </button>
      </div>
    </section>
  );
}
