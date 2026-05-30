import './Footer.css'

/**
 * Footer — shared bottom bar
 * Appears on: Login, Home, Product, Notifications pages
 */
function Footer() {
  return (
    <footer className="footer">
      <p className="footer__text">
        © 2025 ChicCheap &nbsp;|&nbsp;
        <a href="#" className="footer__link">מדיניות פרטיות</a>
        &nbsp;|&nbsp;
        <a href="#" className="footer__link">תנאי שימוש</a>
      </p>
    </footer>
  )
}

export default Footer
