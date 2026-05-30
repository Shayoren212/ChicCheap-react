import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import './NotificationsPage.css'

const DUMMY_NOTIFICATIONS = [
  { id: '1', type: 'price_drop',    title: 'שמלה פרחונית ב-MANGO ירדה במחיר', body: 'מחיר עדכני ₪239 — ירידה של ₪181 ממחיר המקורי', productId: '1', isRead: false, imageColor: '#d4c5b0' },
  { id: '2', type: 'back_in_stock', title: 'חולצת פשתן Zara חזרה למלאי',       body: 'הפריט שסימנת חזר! מהרי לרכוש לפני שייגמר',     productId: '2', isRead: false, imageColor: '#c2c9d6' },
  { id: '3', type: 'out_of_stock',  title: 'ג׳קט דנים H&M אזל מהמלאי',        body: 'נמשיך לעקוב — נעדכן כשיחזור',                    productId: '3', isRead: true,  imageColor: '#2c3e50' },
  { id: '4', type: 'price_rise',    title: 'מכנסי קרגו ASOS עלו במחיר',        body: 'המחיר עלה ל-₪285. מחפשים לך חלופות זולות יותר', productId: '4', isRead: true,  imageColor: '#c9bfa8' },
  { id: '5', type: 'price_drop',    title: 'ז׳קט עור Pull&Bear ירד ב-40%',     body: 'מחיר עדכני ₪219 — הצעה מוגבלת בזמן',            productId: '5', isRead: false, imageColor: '#7b3f3f' },
]

const FILTERS = [
  { key: 'all',           label: 'הכל'      },
  { key: 'price_drop',    label: 'מכירות'   },
  { key: 'back_in_stock', label: 'מלאי חדש' },
  { key: 'wishlist',      label: 'משאלות'   },
]

const TYPE_META = {
  price_drop:    { badge: 'ירידת מחיר', badgeClass: 'badge--green' },
  price_rise:    { badge: 'עלייה במחיר', badgeClass: 'badge--red'  },
  back_in_stock: { badge: 'חזר למלאי',  badgeClass: 'badge--blue'  },
  out_of_stock:  { badge: 'אזל מהמלאי', badgeClass: 'badge--gray'  },
}

function NotificationsPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS)
  const [activeFilter, setActiveFilter]   = useState('all')

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'wishlist') return false
    return n.type === activeFilter
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const dismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="page notifications-page">
      <Navbar />

      <main className="notif-main page-inner">

        <header className="notif-header">
          <h1 className="notif-header__title">
            התראות
            {unreadCount > 0 && (
              <span className="notif-header__badge">{unreadCount}</span>
            )}
          </h1>
          <p className="notif-header__sub">
            עדכונים על פריטים שאת עוקבת אחריהם — מחירים, מלאי, ומבצעים
          </p>
        </header>

        <div className="notif-filters no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`notif-filter-chip ${activeFilter === f.key ? 'notif-filter-chip--active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state__icon">🔔</div>
            <h3 className="empty-state__title">אין התראות</h3>
            <p className="empty-state__text">כאשר מחיר פריט שעוקבת אחריו ישתנה — תראי כאן</p>
          </div>
        ) : (
          <ul className="notif-list fade-in" role="list">
            {filtered.map(n => {
              const meta = TYPE_META[n.type] || TYPE_META.price_drop
              return (
                <li key={n.id} className={`notif-row ${!n.isRead ? 'notif-row--unread' : ''}`}>
                  <div className="notif-row__img" style={{ backgroundColor: n.imageColor }} aria-hidden="true" />
                  <div className="notif-row__content">
                    <span className={`notif-badge ${meta.badgeClass}`}>{meta.badge}</span>
                    <h3 className="notif-row__title">{n.title}</h3>
                    <p className="notif-row__body">{n.body}</p>
                    <div className="notif-row__actions">
                      <button
                        className="notif-action notif-action--primary"
                        onClick={() => { markRead(n.id); navigate(`/product/${n.productId}`) }}
                      >
                        צפי עכשיו
                      </button>
                      <button
                        className="notif-action notif-action--ghost"
                        onClick={() => dismiss(n.id)}
                      >
                        הסר התראה
                      </button>
                    </div>
                  </div>
                  {!n.isRead && <span className="notif-row__dot" aria-label="לא נקרא" />}
                </li>
              )
            })}
          </ul>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default NotificationsPage
