import './GoogleLoginButton.css';

export default function GoogleLoginButton({ onClick }) {
  return (
    <button
      className="google-login-button"
      onClick={onClick}
      type="button"
    >
      <span className="google-icon">G</span>
      התחברות עם Google
    </button>
  );
}