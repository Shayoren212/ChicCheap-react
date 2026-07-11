-- ============================================================
-- ChicCheap — Supabase Database Schema
-- Run this entire file in Supabase → SQL Editor
-- ============================================================


-- ── 1. PROFILES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name  TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ── 2. PRODUCTS ──────────────────────────────────────────────
-- Stores the catalogue (seeded below). Users don't create products.
CREATE TABLE IF NOT EXISTS products (
  id             TEXT PRIMARY KEY,
  brand          TEXT NOT NULL,
  title          TEXT NOT NULL,
  price          INTEGER NOT NULL,
  original_price INTEGER,
  size           TEXT,
  condition      TEXT,
  tag            TEXT,
  image_color    TEXT,
  source_type    TEXT CHECK (source_type IN ('brand', 'secondhand')),
  external_url   TEXT,
  external_label TEXT,
  contact_type   TEXT,
  contact_value  TEXT,
  contact_label  TEXT,
  description    TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);


-- ── 3. SAVED_ITEMS (wishlist) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS saved_items (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);


-- ── 4. NOTIFICATIONS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        TEXT NOT NULL,          -- price_drop | price_rise | back_in_stock | out_of_stock
  title       TEXT NOT NULL,
  body        TEXT,
  product_id  TEXT REFERENCES products(id) ON DELETE SET NULL,
  is_read     BOOLEAN DEFAULT FALSE,
  image_color TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: read own" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "profiles: insert own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "profiles: update own" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);


-- products — public read (catalogue visible to all logged-in users)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products: read all authenticated" ON products
  FOR SELECT USING (auth.role() = 'authenticated');


-- saved_items
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_items: read own" ON saved_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "saved_items: insert own" ON saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_items: delete own" ON saved_items
  FOR DELETE USING (auth.uid() = user_id);


-- notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications: read own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications: insert own" ON notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications: update own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notifications: delete own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);


-- ============================================================
-- SEED DATA — Products catalogue
-- ============================================================
INSERT INTO products (id, brand, title, price, original_price, size, condition, tag, image_color, source_type, external_url, external_label, description)
VALUES
  ('1', 'MANGO',         'מעיל ווֹל טוויד קרם',         239, 420, 'S',  'חדש עם תווית', 'מציאה נדירה', '#d4c5b0', 'brand',       'https://www.mango.com/il',      'צפי בפריט באתר MANGO',     'מעיל ווֹל קצר בסגנון טוויד קלאסי. בד: 60% צמר, 40% פוליאסטר.'),
  ('2', 'Zara',          'חולצת כותנה מינימל לבנה',       89, NULL, 'M',  'כמו חדש',      NULL,           '#c2c9d6', 'brand',       'https://www.zara.com/il',       'צפי בפריט באתר Zara',       'חולצת פשתן לבנה עם כפתורים, חצי שרוול.'),
  ('3', 'H&M',           'חצאית מידי פליסה ירוקה',        149, 220, 'S',  'חדש',           'ירידת מחיר',  '#b5c9b8', 'brand',       'https://www2.hm.com/il_il',     'צפי בפריט באתר H&M',        'חצאית מידי בקפלים מלאים. בד: 100% פוליאסטר ממוחזר.'),
  ('4', 'ASOS',          'שמלת ערב שחורה',                185, NULL, 'M',  'טוב',           NULL,           '#2c3e50', 'brand',       'https://www.asos.com',          'צפי בפריט באתר ASOS',       'שמלת ערב מידי, גזרה צמודה עם פתח בגב. בד: ג׳רסי.'),
  ('5', 'יד שנייה',      'ז׳קט עור בורדו וינטאג׳',        180, NULL, 'L',  'טוב',           'מציאה נדירה', '#7b3f3f', 'secondhand',  NULL,                            NULL,                         'ז׳קט עור אמיתי בצבע בורדו עמוק. עיצוב שנות ה-90, מצב מעולה.'),
  ('6', 'Shein',         'סרבל קיץ פרחוני מתוק',           49,  89, 'XS', 'חדש עם תווית', 'ירידת מחיר',  '#e8c9c0', 'brand',       'https://www.shein.com',         'צפי בפריט באתר Shein',      'סרבל קיץ עם הדפס פרחים עדין. גזרה מרווחת ונוחה.'),
  ('7', 'Pull&Bear',     'מכנס קרגו בז׳',                 129, NULL, 'S',  'כמו חדש',      NULL,           '#c9bfa8', 'brand',       'https://www.pullandbear.com/il','צפי בפריט באתר Pull&Bear',   'מכנס קרגו עם כיסים צדדיים. גזרה רחבה ונוחה.'),
  ('8', 'Massimo Dutti', 'חולצת משי קרם',                  220, 380, 'M',  'חדש',           'מציאה נדירה', '#e8e0d5', 'brand',       'https://www.massimodutti.com/il','צפי בפריט באתר Massimo Dutti','חולצה מרשת 100% משי טבעי. נקייה, קלאסית.')
ON CONFLICT (id) DO NOTHING;
