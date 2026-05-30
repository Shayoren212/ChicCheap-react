import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/home" className="navbar__logo">
          ChicCheap
        </Link>

        <nav className="navbar__icons" aria-label="ניווט ראשי">
          <Link
            to="/home"
            className={`navbar__icon-btn ${isActive('/home') ? 'navbar__icon-btn--active' : ''}`}
            aria-label="דף הבית"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12L12 3l9 9" />
              <path d="M9 21V12h6v9" />
              <path d="M3 12v9h18v-9" />
            </svg>
          </Link>

          <Link
            to="/notifications"
            className={`navbar__icon-btn ${isActive('/notifications') ? 'navbar__icon-btn--active' : ''}`}
            aria-label="התראות"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
          </Link>

          <Link
            to="/profile"
            className={`navbar__icon-btn ${isActive('/profile') ? 'navbar__icon-btn--active' : ''}`}
            aria-label="פרופיל"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
