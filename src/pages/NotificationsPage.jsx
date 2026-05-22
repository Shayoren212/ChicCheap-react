import { Bell, Search, UserRound } from 'lucide-react';

const alertItems = [
  {
    time: 'לפני שעתיים',
    tag: 'ירידת מחיר',
    title: 'Hermès - נעלי ריצה מעור',
    text: 'הפריט ששמרת ברשימת המשאלות זמין כעת ב־20% הנחה לזמן מוגבל.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
    action: 'צפה עכשיו'
  },
  {
    time: 'לפני 5 שעות',
    tag: 'חדש במלאי',
    title: 'Prada - תיק כתף קלאסי',
    text: 'התיק שחיפשת זמין כעת במלאי ביחידות בודדות. אל תחכי יותר מדי.',
    image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=500&q=80',
    action: 'הוסף לסל'
  },
  {
    time: 'אתמול',
    tag: 'קולקציה חדשה',
    title: "The Row - קולקציית סתיו 24׳",
    text: 'הקולקציה החדשה של המעצבים המועדפים עלייך נחתה באתר.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=500&q=80',
    action: 'גלה את הקולקציה'
  },
  {
    time: 'לפני יומיים',
    tag: 'מלאי מוגבל',
    title: 'Cartier - שעון Tank Must',
    text: 'נותרו רק 2 פריטים במלאי מהדגם ששמרת. הזדמנות אחרונה לרכישה.',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=500&q=80',
    action: 'המשך לרכישה'
  }
];

export default function NotificationsPage() {
  return (
    <section className="alerts-page" dir="rtl">
      <header className="alerts-topbar">
        <h1>ChicCheap</h1>

        <nav>
          <button>קולקציה</button>
          <button>מעצבים</button>
          <button>קיימות</button>
        </nav>

        <div className="alerts-icons">
          <UserRound size={20} />
          <Bell size={20} />
          <Search size={20} />
        </div>
      </header>

      <div className="alerts-heading">
        <h2>התראות ועדכונים</h2>
        <p>הישאר מעודכן בפריטים הנשקים ביותר, ירידות מחירים ועדכוני מלאי מהמותגים האהובים עליך.</p>
      </div>

      <div className="alerts-tabs">
        <button className="active">הכל</button>
        <button>מכירות</button>
        <button>מלאי חדש</button>
        <button>משאלות</button>
      </div>

      <div className="alerts-list">
        {alertItems.map(item => (
          <article className="alert-card" key={item.title}>
            <span className="alert-time">{item.time}</span>

            <img src={item.image} alt={item.title} />

            <div className="alert-content">
              <p>{item.tag}</p>
              <h3>{item.title}</h3>
              <span>{item.text}</span>
              <button>{item.action}</button>
            </div>
          </article>
        ))}
      </div>

      <button className="more-alerts">⌄<br />טען התראות נוספות</button>
    </section>
  );
}