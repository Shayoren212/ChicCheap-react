import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Heart, Bell, Settings, LogOut, ChevronLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import './ProfilePage.css'

const NAV_TABS = [
  { key: 'wishlist', label: 'רשימת משאלות', icon: Heart    },
  { key: 'alerts',   label: 'התראות פעילות', icon: Bell    },
  { key: 'settings', label: 'הגדרות',         icon: Settings },
]

const TYPE_META = {
  watching:      { badge: 'עוקבת',       badgeClass: 'badge--blue'  },
  price_drop:    { badge: 'ירידת מחיר',  badgeClass: 'badge--green' },
  price_rise:    { badge: 'עלייה במחיר', badgeClass: 'badge--red'   },
  back_in_stock: { badge: 'חזר למלאי',   badgeClass: 'badge--blue'  },
  out_of_stock:  { badge: 'אזל מהמלאי',  badgeClass: 'badge--gray'  },
}


function ProfilePage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const [username, setUsername]       = useState('')
  const [email, setEmail]             = useState('')
  const [activeTab, setActiveTab]     = useState('wishlist')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')
  const [savedItems, setSavedItems]   = useState([])
  const [notifications, setNotifications] = useState([])

  // count שמחושב מהנתונים
  const unreadCount = notifications.filter(n => !n.isRead).length

  useEffect(() => {
    const load = async () => {
      // רשימת משאלות מ-localStorage
      const store = JSON.parse(localStorage.getItem('cc_liked_products') || '{}')
      setSavedItems(Object.values(store))

      if (!user) {
        // לא מחובר — אין התראות מעקב מחיר
        setNotifications([])
        return
      }

      setEmail(user.email || '')
      supabase.from('profiles').select('full_name').eq('user_id', user.id).single()
        .then(({ data }) => setUsername(data?.full_name || user.email.split('@')[0]))

      // התראות מ-Supabase בלבד (פריטים שהמשתמש לחץ "עקבי אחרי המחיר")
      const { data } = await supabase.from('notifications').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(20)
      setNotifications(data ? data.map(n => ({
        id: n.id, type: n.type, title: n.title, body: n.body,
        productId: n.product_id, isRead: n.is_read,
        imageColor: n.image_color, imageUrl: null,
      })) : [])
    }
    load()
  }, [user])

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword && newPassword !== confirmPass) {
      setError('הסיסמאות אינן תואמות')
      return
    }
    try {
      // Update display name in profiles table
      if (newUsername) {
        const { error: profileErr } = await supabase
          .from('profiles')
          .update({ full_name: newUsername })
          .eq('user_id', user.id)
        if (profileErr) throw profileErr
        setUsername(newUsername)
      }

      // Update password via Supabase Auth
      if (newPassword) {
        const { error: passErr } = await supabase.auth.updateUser({ password: newPassword })
        if (passErr) throw passErr
      }

      setSaved(true)
      setNewUsername(''); setNewPassword(''); setConfirmPass('')
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('שגיאה בשמירה: ' + err.message)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="page profile-page">
      <Navbar />

      <main className="profile-main fade-in">

        {/* ── Hero banner ── */}
        <div className="profile-hero">
          <div className="profile-hero__avatar" aria-hidden="true">
            {username ? username.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{username}</h1>
            <p className="profile-hero__email">{email}</p>
            <div className="profile-hero__stats">
              <span className="profile-stat"><strong>{savedItems.length}</strong> פריטים שמורים</span>
              <span className="profile-stat__sep">·</span>
              <span className="profile-stat"><strong>{unreadCount}</strong> התראות פעילות</span>
            </div>
          </div>
        </div>

        <div className="page-inner profile-body">

          {/* ── Tab nav ── */}
          <nav className="profile-tabs" role="tablist">
            {NAV_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`profile-tab ${activeTab === key ? 'profile-tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          {/* ── Wishlist ── */}
          {activeTab === 'wishlist' && (
            <section className="profile-section fade-in" aria-label="רשימת משאלות">
              {savedItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🤍</div>
                  <h3 className="empty-state__title">רשימת המשאלות ריקה</h3>
                  <p className="empty-state__text">לחצי על הלב בכרטיס פריט כדי לשמור</p>
                </div>
              ) : (
                <div className="profile-saved-grid">
                  {savedItems.map(item => (
                    <button
                      key={item.id}
                      className="profile-saved-card"
                      onClick={() => navigate(`/product/${item.id}`, { state: { product: item } })}
                    >
                      <div
                        className="profile-saved-card__img"
                        style={item.imageUrl
                          ? { backgroundImage: `url(${item.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                          : { backgroundColor: item.imageColor || '#d4c5b0' }
                        }
                      />
                      <p className="profile-saved-card__brand">{item.brand}</p>
                      <p className="profile-saved-card__title">{item.title}</p>
                      <p className="profile-saved-card__price">₪{item.price}</p>
                    </button>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Alerts ── */}
          {activeTab === 'alerts' && (
            <section className="profile-section fade-in" aria-label="התראות פעילות">
              {notifications.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon">🔔</div>
                  <h3 className="empty-state__title">אין התראות פעילות</h3>
                  <p className="empty-state__text">לחצי "עקבי אחרי המחיר" בעמוד פריט כדי לקבל עדכונים על שינויי מחיר</p>
                </div>
              ) : (
                <ul className="profile-alerts-list" role="list">
                  {notifications.slice(0, 5).map(n => {
                    const meta = TYPE_META[n.type] || TYPE_META.price_drop
                    return (
                      <li
                        key={n.id}
                        className={`profile-alert-row ${!n.isRead ? 'profile-alert-row--unread' : ''}`}
                        onClick={() => navigate(`/product/${n.productId}`)}
                        role="button"
                        style={{ cursor: 'pointer' }}
                      >
                        <div
                          className="profile-alert-row__img"
                          style={{ backgroundColor: n.imageColor || '#d4c5b0' }}
                        />
                        <div className="profile-alert-row__info">
                          <span className={`notif-badge ${meta.badgeClass}`}>{meta.badge}</span>
                          <p className="profile-alert-row__name">{n.title}</p>
                          <p className="profile-alert-row__sub">{n.body}</p>
                        </div>
                        {!n.isRead && <span className="profile-alert-row__dot" />}
                      </li>
                    )
                  })}
                </ul>
              )}
              <button className="profile-see-all" onClick={() => navigate('/notifications')}>
                לכל ההתראות ({notifications.length})
                <ChevronLeft size={16} />
              </button>
            </section>
          )}

          {/* ── Settings ── */}
          {activeTab === 'settings' && (
            <section className="profile-section fade-in" aria-label="הגדרות">
              <form className="profile-form" onSubmit={handleSave}>
                <h2 className="profile-form__heading">עריכת פרופיל</h2>

                {saved && (
                  <div className="profile-form__success" role="status">✅ הפרטים עודכנו בהצלחה</div>
                )}
                {error && (
                  <div className="profile-form__error" role="alert">{error}</div>
                )}

                <div className="profile-form__group">
                  <label className="input-label">אימייל (לא ניתן לשינוי)</label>
                  <input className="input-field input-field--disabled" type="email" value={email} readOnly disabled />
                </div>

                <div className="profile-form__group">
                  <label className="input-label" htmlFor="uname">שם משתמש חדש</label>
                  <input
                    id="uname" type="text" className="input-field"
                    placeholder={username}
                    value={newUsername} onChange={e => setNewUsername(e.target.value)}
                  />
                </div>

                <div className="profile-form__group">
                  <label className="input-label" htmlFor="pass">סיסמא חדשה</label>
                  <input
                    id="pass" type="password" className="input-field"
                    placeholder="לפחות 6 תווים"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="profile-form__group">
                  <label className="input-label" htmlFor="cpass">אימות סיסמא</label>
                  <input
                    id="cpass" type="password" className="input-field"
                    placeholder="••••••••"
                    value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn--primary btn--full">שמירת שינויים</button>
              </form>

              <div className="profile-danger-zone">
                <button
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  התנתקות
                </button>
              </div>
            </section>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProfilePage
