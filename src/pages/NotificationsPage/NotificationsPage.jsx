import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './NotificationsPage.css'

const TYPE_META = {
  watching:      { badge: 'עוקבת',       badgeClass: 'badge--blue'  },
  price_drop:    { badge: 'ירידת מחיר',  badgeClass: 'badge--green' },
  price_rise:    { badge: 'עלייה במחיר', badgeClass: 'badge--red'   },
  back_in_stock: { badge: 'חזר למלאי',   badgeClass: 'badge--blue'  },
  out_of_stock:  { badge: 'אזל מהמלאי',  badgeClass: 'badge--gray'  },
}

const FILTERS = [
  { key: 'all',      label: 'הכל'       },
  { key: 'watching', label: 'עוקבת'     },
  { key: 'price_drop', label: 'מכירות'  },
]

/* ממיר שורת Supabase לאובייקט התראה */
function mapSupabaseNotif(n) {
  return {
    id:         n.id,
    type:       n.type,
    title:      n.title,
    body:       n.body,
    productId:  n.product_id,
    isRead:     n.is_read,
    imageColor: n.image_color || '#d4c5b0',
    imageUrl:   null,
    product:    null,
  }
}

function NotificationsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [activeFilter, setActiveFilter]   = useState('all')

  useEffect(() => {
    const load = async () => {
      if (!user) {
        // לא מחובר — אין התראות (מעקב מחיר דורש חשבון)
        setNotifications([])
        setLoading(false)
        return
      }

      // שליפת התראות מ-Supabase בלבד (פריטים שהמשתמש לחץ "עקבי אחרי המחיר")
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      setNotifications(data ? data.map(mapSupabaseNotif) : [])
      setLoading(false)
    }

    load()
  }, [user])

  const filtered = notifications.filter(n => {
    if (activeFilter === 'all') return true
    return n.type === activeFilter
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  const dismiss = async (id) => {
    await supabase.from('notifications').delete().eq('id', id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="page notifications-page">
      <Navbar />

      <main className="notif-main page-inner">

        {/* ── Header ── */}
        <header className="notif-header">
          <div className="notif-header__title-row">
            <h1 className="notif-header__title">
              התראות
              {unreadCount > 0 && (
                <span className="notif-header__badge">{unreadCount}</span>
              )}
            </h1>
          </div>
          <p className="notif-header__sub">
            פריטים שעוקבת אחריהם — תקבלי עדכון כשהמחיר ישתנה
          </p>
        </header>

        {/* ── Filter chips ── */}
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

        {/* ── List ── */}
        {loading ? (
          <div className="home-loading"><span className="loading-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state fade-in">
            <div className="empty-state__icon">🔔</div>
            <h3 className="empty-state__title">
              {!user ? 'יש להתחבר כדי לראות התראות' : activeFilter === 'all' ? 'אין התראות פעילות' : 'אין התראות מסוג זה'}
            </h3>
            <p className="empty-state__text">
              {!user ? 'התחברי לחשבון ואז לחצי "עקבי אחרי המחיר" בעמוד הפריט' : 'לחצי "עקבי אחרי המחיר" בעמוד פריט כדי לקבל עדכונים על שינויי מחיר'}
            </p>
          </div>
        ) : (
          <ul className="notif-list fade-in" role="list">
            {filtered.map(n => {
              const meta = TYPE_META[n.type] || TYPE_META.watching
              return (
                <li
                  key={n.id}
                  className={`notif-row ${!n.isRead ? 'notif-row--unread' : ''}`}
                >
                  {/* תמונה */}
                  <div
                    className="notif-row__img"
                    style={
                      n.imageUrl
                        ? { backgroundImage: `url(${n.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                        : { backgroundColor: n.imageColor || '#d4c5b0' }
                    }
                    aria-hidden="true"
                  />

                  {/* Content */}
                  <div className="notif-row__content">
                    <span className={`notif-badge ${meta.badgeClass}`}>{meta.badge}</span>
                    <h3 className="notif-row__title">{n.title}</h3>
                    <p className="notif-row__body">{n.body}</p>
                    <div className="notif-row__actions">
                      <button
                        className="notif-action notif-action--primary"
                        onClick={() => {
                          markRead(n.id)
                          if (n.product) navigate(`/product/${n.productId}`, { state: { product: n.product } })
                          else navigate(`/product/${n.productId}`)
                        }}
                      >
                        צפי עכשיו
                      </button>
                      <button
                        className="notif-action notif-action--ghost"
                        onClick={() => dismiss(n.id)}
                      >
                        הסר
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
