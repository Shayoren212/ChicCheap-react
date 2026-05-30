# ChicCheap — React Frontend

אפליקציה שמסייעת בביצוע קניות באופן זול ומשתלם.  
מצא את הלוק המושלם במחיר הכי טוב ברשת.

## הפעלה מקומית

```bash
npm install
npm run dev
```

האפליקציה תרוץ על `http://localhost:5173`

## מבנה הפרויקט

```
ChicCheap-react/
  DESIGN.md              ← Design System מ-Stitch
  src/
    main.jsx             ← נקודת כניסה
    App.jsx              ← Routing
    styles/
      globals.css        ← CSS Variables + Design Tokens
    components/
      Navbar/            ← Shared: ניווט עליון
      Footer/            ← Shared: תחתית עם זכויות ומדיניות
      ProductCard/       ← Reusable: כרטיס מוצר בתוצאות
      NotificationItem/  ← Reusable: שורת התראה
      FilterModal/       ← Section: פופ-אפ סינון
    pages/
      LoginPage/         ← /login
      RegisterPage/      ← /register
      HomePage/          ← /home
      NotificationsPage/ ← /notifications
      ProductPage/       ← /product/:id
      ProfilePage/       ← /profile
```

## Routing

| URL | עמוד |
|-----|------|
| `/login` | עמוד כניסה |
| `/register` | עמוד רישום |
| `/home` | עמוד בית (חיפוש + תוצאות) |
| `/notifications` | התראות ועדכונים |
| `/product/:id` | פרטי פריט |
| `/profile` | פרופיל משתמש |

## Design System

ראה `DESIGN.md` לפירוט מלא.  
כל צבעים, פונטים וריווח מנוהלים דרך CSS Variables ב-`src/styles/globals.css`.

**צבעים עיקריים:**
- Navy `#2C3E50` — כותרות וניווט
- Rose `#D4A5A5` — CTA וכפתורי רכישה
- Ivory `#F9F7F2` — רקע
- Sage `#A8C69F` — סטטוס ואייקונים

**פונטים:**
- EB Garamond — כותרות
- Manrope — גוף טקסט

## Tech Stack

- React 18
- React Router v6
- Vite
- CSS Variables (ללא Tailwind — ניהול עיצוב ב-globals.css)

> **הערה:** כל הנתונים כרגע הם Dummy Data. חיבור ל-Backend (Supabase) יבוא במודול הבא.
