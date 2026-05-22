// ProfilePage.jsx
import { User, Settings, Heart, LogOut, Package } from 'lucide-react';

export default function ProfilePage({ onLogout }) {
  // נתוני דוגמה למשתמש - בהמשך יחוברו ל-Database/Auth לשליפה דינמית
  const userProfile = {
    name: 'רוטם',
    email: 'rotem@ono.ac.il'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={titleStyle}>Profile</h1>
      </header>

      {/* כרטיס פרטי המשתמש הראשי */}
      <div style={userCardStyle}>
        <div style={avatarContainerStyle}>
          <User size={32} color="#162839" />
        </div>
        <div style={userInfoStyle}>
          <h2 style={userNameStyle}>{userProfile.name}</h2>
          <p style={userEmailStyle}>{userProfile.email}</p>
        </div>
      </div>

      {/* רשימת פעולות ואפשרויות ניהול חשבון */}
      <div style={actionsContainerStyle}>
        <button style={actionButtonStyle}>
          <div style={buttonContentStyle}>
            <Heart size={18} color="#7b5455" />
            <span>הפריטים השמורים שלי</span>
          </div>
        </button>
        
        <button style={actionButtonStyle}>
          <div style={buttonContentStyle}>
            <Package size={18} color="#162839" />
            <span>היסטוריית חיפושים והזמנות</span>
          </div>
        </button>

        <button style={actionButtonStyle}>
          <div style={buttonContentStyle}>
            <Settings size={18} color="#162839" />
            <span>הגדרות פרופיל ואבטחה</span>
          </div>
        </button>

        {/* כפתור התנתקות המשתמש מהמערכת באמצעות שימוש בצבע השגיאה המוגדר במערכת */}
        <button style={{ ...actionButtonStyle, color: '#ba1a1a', borderColor: '#ffdad6' }} onClick={onLogout}>
          <div style={buttonContentStyle}>
            <LogOut size={18} color="#ba1a1a" />
            <span>התנתקות מהחשבון</span>
          </div>
        </button>
      </div>
    </div>
  );
}

// אובייקטי עיצוב (Inline Styles) התואמים במדויק ל-DESIGN.md
const containerStyle = {
  backgroundColor: '#fbf9f4', // גוון השמנת (Cream Background)
  minHeight: '100vh',
  padding: '32px 20px',
  fontFamily: 'Manrope, sans-serif'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '32px'
};

const titleStyle = {
  fontFamily: '"EB Garamond", serif', // פונט סריפי יוקרתי לכותרות
  fontSize: '32px',
  fontWeight: '500',
  color: '#162839', // צבע הנייבי הראשי
  margin: 0
};

const userCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '20px',
  backgroundColor: '#ffffff', // קומפוננטה מורמת מקבלת רקע לבן חלק
  borderRadius: '8px', // רדיוס מוגדל לכרטיסי תוכן
  border: '1px solid #eae8e3',
  marginBottom: '32px'
};

const avatarContainerStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%', // אווטארים מעוגלים לחלוטין לפי האפיון
  backgroundColor: '#f5f3ee',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const userInfoStyle = {
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'right'
};

const userNameStyle = {
  margin: '0 0 4px 0',
  fontSize: '18px',
  fontWeight: '600',
  color: '#1b1c19'
};

const userEmailStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#43474c'
};

const actionsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const actionButtonStyle = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#ffffff',
  border: '1px solid #eae8e3',
  borderRadius: '4px', // לחצנים שומרים על קו ארכיטקטוני רך של 4px
  fontSize: '16px',
  color: '#162839',
  cursor: 'pointer',
  textAlign: 'right',
  transition: 'background-color 0.2s ease'
};

const buttonContentStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flexDirection: 'row'
};