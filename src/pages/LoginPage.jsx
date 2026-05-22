import AuthCard from '../components/AuthCard/AuthCard.jsx';
import GoogleLoginButton from '../components/GoogleLoginButton/GoogleLoginButton.jsx';

export default function LoginPage({ onNavigate, onLogin }) {
  return (
    <>
      <AuthCard mode="login" onNavigate={onNavigate} onLogin={onLogin} />

      <div style={{ maxWidth: '420px', margin: '16px auto' }}>
       <GoogleLoginButton
  onClick={() => alert('בשלב הבא נחבר התחברות Google אמיתית. כרגע לא ניתן להיכנס בלי אימות אמיתי.')}
/> 
      </div>
    </>
  );
}