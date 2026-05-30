import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { Heart, Bell, Settings, LogOut, ChevronLeft } from 'lucide-react'
import './ProfilePage.css'

const SAVED_ITEMS = [
  { id: '1', brand: 'MANGO',  title: 'מעיל ווֹל טוויד',   price: 239, color: '#d4c5b0' },
  { id: '5', brand: 'Yad2',   title: 'ז׳קט עור בורדו',    price: 180, color: '#7b3f3f' },
  { id: '3', brand: 'H&M',    title: 'חצאית מידי פליסה',  price: 149, color: '#b5c9b8' },
]

const NAV_TABS = [
  { key: 'wishlist', label: 'רשימת משאלות',  icon: Heart    },
  { key: 'alerts',   label: 'התראות פעילות', icon: Bell     },
  { key: 'settings', label: 'הגדרות',         icon: Settings },
]

function ProfilePage() {
  const navigate = useNavigate()

  const [username, setUsername]       = useState('שי אורן')
  const [email]                       = useState('shayoren212@gmail.com')
  const [activeTab, setActiveTab]     = useState('wishlist')
  const [newUsername, setNewUsername] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [saved, setSaved]             = useState(false)
  const [error, setError]             = useState('')

  const handleSave = (e) => {
    e.preventDefault()
    setError('')
    if (newPassword && newPassword !== confirmPass) {
      setError('הסיסמאות אינן תואמות')
      return
    }
    if (newUsername) setUsername(newUsername)
    setSaved(true)
    setNewUsername('')
    setNewPassword('')
    setConfirmPass('')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="page profile-page">
      <Navbar />

      <main className="profile-main fade-in">

        <div className="profile-hero">
          <div className="profile-hero__avatar" aria-hidden="true">
            {username.charAt(0)}
          </div>
          <div className="profile-hero__info">
            <h1 className="profile-hero__name">{username}</h1>
            <p className="profile-hero__email">{email}</p>
            <div className="profile-hero__stats">
              <span className="profile-stat"><strong>3</strong> פריטים שמורים</span>
              <span className="profile-stat__sep">·</span>
              <span className="profile-stat"><strong>5</strong> התראות פעילות</span>
            </div>
          </div>
        </div>

        <div className="page-inner profile-body">

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

          {activeTab === 'wishlist' && (
            <section className="profile-section fade-in">
              <div className="profile-saved-grid">
                {SAVED_ITEMS.map(item => (
                  <button
                    key={item.id}
                    className="profile-saved-card"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="profile-saved-card__img" style={{ backgroundColor: item.color }} />
                    <p className="profile-saved-card__brand">{item.brand}</p>
                    <p className="profile-saved-card__title">{item.title}</p>
                    <p className="profile-saved-card__price">&#8362;{item.price}</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {activeTab === 'alerts' && (
            <section className="profile-section fade-in">
              <div className="profile-alerts-list">
                {['מעיל ווֹל MANGO', 'חצאית H&M', 'סרבל Shein'].map((name, i) => (
                  <div key={i} className="profile-alert-row">
                    <div className="profile-alert-row__info">
                      <Bell size={16} className="profile-alert-row__icon" />
                      <div>
                        <p className="profile-alert-row__name">{name}</p>
                        <p className="profile-alert-row__sub">התראת ירידת מחיר פעילה</p>
                      </div>
                    </div>
                    <button className="profile-alert-row__remove" aria-label="הסר">x</button>
                  </div>
                ))}
              </div>
              <button className="profile-see-all" onClick={() => navigate('/notifications')}>
                לכל ההתראות
                <ChevronLeft size={16} />
              </button>
            </section>
          )}

          {activeTab === 'settings' && (
            <section className="profile-section fade-in">
              <form className="profile-form" onSubmit={handleSave}>
                <h2 className="profile-form__heading">עריכת פרופיל</h2>

                {saved && (
                  <div className="profile-form__success" role="status">הפרטים עודכנו בהצלחה</div>
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
                  <input id="uname" type="text" className="input-field" placeholder={username}
                    value={newUsername} onChange={e => setNewUsername(e.target.value)} />
                </div>

                <div className="profile-form__group">
                  <label className="input-label" htmlFor="pass">סיסמא חדשה</label>
                  <input id="pass" type="password" className="input-field" placeholder="לפחות 6 תווים"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </div>

                <div className="profile-form__group">
                  <label className="input-label" htmlFor="cpass">אימות סיסמא</label>
                  <input id="cpass" type="password" className="input-field" placeholder="אמתי את הסיסמא"
                    value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
                </div>

                <button type="submit" className="btn btn--primary btn--full">שמירת שינויים</button>
              </form>

              <div className="profile-danger-zone">
                <button className="profile-logout" onClick={() => navigate('/login')}>
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
