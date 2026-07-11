import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

/**
 * Navbar — shared top navigation bar
 * Appears on: Home, Notifications, Product, Profile pages
 * Layout (RTL): Logo | Home icon | Notifications icon | Profile icon | Logout
 */
function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = async () => {
    sessionStorage.removeItem('cc_results')
    sessionStorage.removeItem('cc_query')
    await signOut()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar__inner">
      {/* Logo */}
      <Link to="/home" className="navbar__logo">
        ChicCheap
      </Link>

      {/* Navigation Icons */}
      <nav className="navbar__icons" aria-label="ניווט ראשי">

        {/* Home */}
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

        {/* Notifications */}
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

        {/* Profile */}
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

        {/* Logout */}
        <button
          className="navbar__icon-btn"
          aria-label="התנתקות"
          onClick={handleLogout}
          title="התנתקות"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>

      </nav>
      </div>
    </header>
  )
}

export default Navbar
