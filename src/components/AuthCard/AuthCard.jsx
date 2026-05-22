// AuthCard.jsx
import './AuthCard.css';
import GoogleLoginButton from '../GoogleLoginButton/GoogleLoginButton.jsx';

export default function AuthCard({
  mode = 'login',
  onNavigate,
  onLogin
}) {
  const isRegister = mode === 'register';

  return (
    <section className="auth-layout">
      <div className="auth-left">
        <div className="auth-content">
          <h1 className="auth-logo">ChicCheap</h1>

          <h2 className="auth-heading">
            גלו אופנה יוקרתית ויד שנייה שעובדת בשבילכם
          </h2>

          <p className="auth-description">
            הירשמו עכשיו כדי להתחיל את מסע הגילוי שלכם.
          </p>

          {isRegister && (
            <input
              className="auth-input"
              type="text"
              placeholder="שם מלא"
            />
          )}

          <input
            className="auth-input"
            type="email"
            placeholder="your@email.com"
          />

          <input
            className="auth-input"
            type="password"
            placeholder="********"
          />

          <button
            className="auth-submit"
            onClick={onLogin}
          >
            {isRegister ? 'הרשמה' : 'כניסה'}
          </button>

          {/* כפתור יחיד וממוקם בצורה נכונה במרכז הטופס */}
          <GoogleLoginButton
            onClick={() =>
              alert('Google Login יחובר בהמשך עם מערכת אימות אמיתית')
            }
          />

          <button
            className="auth-switch"
            onClick={() =>
              onNavigate(isRegister ? 'login' : 'register')
            }
          >
            {isRegister
              ? 'כבר יש לך חשבון? התחבר/י'
              : 'אין לך חשבון? הרשמה'}
          </button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-overlay">
          <h2>ChicCheap</h2>
          <p>
            הפלטפורמה לקהילה של אוהבי אופנה שמעריכים איכות,
            קיימות וסטייל ללא פשרות.
          </p>
        </div>
      </div>
    </section>
  );
}