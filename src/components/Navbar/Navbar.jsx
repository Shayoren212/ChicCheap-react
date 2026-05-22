// Navbar.jsx
import { Bell, Home, Search, SlidersHorizontal, UserRound, LogOut } from 'lucide-react';

export default function Navbar({ currentPage, onNavigate, onLogout }) {
  const links = [
    { page: 'landing', label: 'Home', icon: Home },
    { page: 'about', label: 'About', icon: Search },
    { page: 'notifications', label: 'Alerts', icon: Bell },
    { page: 'profile', label: 'Profile', icon: UserRound }
  ];

  return (
    <>
      <header className="top-navbar">
        <button
          className="brand"
          onClick={() => onNavigate('landing')}
          aria-label="ChicCheap home"
        >
          ChicCheap
        </button>

        {/* הצגת כפתורי הניווט הנוספים ב-Header רק כאשר לא נמצאים בעמוד התראות */}
        {currentPage !== 'notifications' && (
          <>
            <button className="filter-pill" onClick={() => onNavigate('landing')}>
              <SlidersHorizontal size={16} />
              Smart fashion finder
            </button>

            <button className="logout-button" onClick={onLogout}>
              <LogOut size={16} />
              Logout
            </button>
          </>
        )}
      </header>

      <nav className="bottom-navbar" aria-label="Main navigation">
        {links.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            className={currentPage === page ? 'active' : ''}
            onClick={() => onNavigate(page)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}