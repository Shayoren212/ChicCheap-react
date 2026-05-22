import { Camera, SlidersHorizontal, Search, UserRound } from 'lucide-react';

export default function SearchBar({ onFilter }) {
  return (
    <section className="stitch-hero">
      <div className="stitch-header">
        <h1>ChicCheap</h1>
        <button>
          <UserRound size={18} />
        </button>
      </div>

      <h2>What are you looking for?</h2>

      <div className="stitch-search-box">
        <Search size={16} />
        <input placeholder="Search by Text (e.g. vintage coat)" />
      </div>

      <div className="stitch-action-row">
        <button>
          <Camera size={16} />
          Visual Search
        </button>

        <button onClick={onFilter}>
          <SlidersHorizontal size={16} />
          Advanced Filters
        </button>
      </div>
    </section>
  );
}