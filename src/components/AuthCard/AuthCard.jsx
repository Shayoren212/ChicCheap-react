import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthCard.css';
import { supabase } from '../../lib/supabase.js';

const GOOGLE_CLIENT_ID = '283982221235-3lh1k91bafhh1eribso8g92c4v9jhe3c.apps.googleusercontent.com'

export default function AuthCard({
  mode = 'login',
  onNavigate,
}) {
  const isRegister = mode === 'register';
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingConfirm, setPendingConfirm] = useState(false);
  const googleBtnRef = useRef(null);

  // Initialize Google Identity Services once on mount and render the button
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google?.accounts?.id || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: response.credential,
            });
            if (error) throw error;
            navigate('/home');
          } catch (err) {
            setError('שגיאה בכניסה עם גוגל: ' + err.message);
          }
        },
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        locale: 'iw',
        width: googleBtnRef.current.offsetWidth || 320,
      });
    };

    // GSI script might still be loading
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;

        // Insert profile — non-blocking (don't fail registration if this fails)
        if (data.user) {
          supabase.from('profiles').insert({
            user_id: data.user.id,
            full_name: fullName || email.split('@')[0],
          }).then(() => {});
        }

        // אם Supabase דורש אישור אימייל — session תהיה null
        if (!data.session) {
          setPendingConfirm(true);
          return;
        }

        navigate('/home');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        navigate('/home');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (isRegister) {
        setError(err.message?.includes('already') ? 'אימייל זה כבר רשום. נסי להתחבר.' : 'שגיאה בהרשמה: ' + err.message);
      } else {
        setError('אימייל או סיסמא שגויים');
      }
    } finally {
      setLoading(false);
    }
  };

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

          {pendingConfirm && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #86efac',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '12px',
              color: '#166534',
              fontSize: '14px',
              textAlign: 'right',
            }}>
              ✅ נשלח אימייל אישור לכתובת <strong>{email}</strong> — אשרי את הכתובת ואז התחברי.
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '12px',
              color: '#b91c1c',
              fontSize: '14px',
              textAlign: 'right',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
            {isRegister && (
              <input
                className="auth-input"
                type="text"
                placeholder="שם מלא"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            )}

            <input
              className="auth-input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <input
              className="auth-input"
              type="password"
              placeholder="********"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? '...' : isRegister ? 'הרשמה' : 'כניסה'}
            </button>
          </form>

          {/* Google renders its own button here — avoids FedCM/prompt issues */}
          <div
            ref={googleBtnRef}
            style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}
          />

          <p className="auth-switch">
            {isRegister ? 'כבר יש לך חשבון?' : 'אין לך חשבון עדיין?'}
            {' '}
            <button
              type="button"
              className="auth-switch__link"
              onClick={() => { setIsRegister(r => !r); setError(''); setPendingConfirm(false) }}
            >
              {isRegister ? 'כניסה' : 'הרשמה'}
            </button>
          </p>

        </div>
      </div>

      <div className="auth-right" aria-hidden="true">
        <div className="auth-right__img" />
      </div>
    </section>
  )
}
