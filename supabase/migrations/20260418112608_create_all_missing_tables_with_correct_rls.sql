/*
  # Create All Missing Tables with Correct RLS Policies

  1. New Tables
    - `materials` - Learning materials (PDFs, docs, presentations, links)
    - `videos` - Video lectures
    - `custom_tests` - Custom tests and quizzes with questions
    - `cases` - Project cases (videos, presentations, PDFs, images)
    - `page_views` - Analytics: tracks which sections users visit
    - `item_clicks` - Analytics: tracks which items users interact with

  2. Security
    - Enable RLS on all tables
    - Public SELECT access for content tables
    - Admin-only INSERT/UPDATE/DELETE using CORRECT JWT path: auth.jwt() -> 'app_metadata' ->> 'role'
    - Public INSERT for analytics tables (no auth needed to track)
    - Admin-only SELECT for analytics tables using correct JWT path

  3. Important Notes
    - The admin role is stored in app_metadata, NOT the JWT root level
    - Correct check: (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    - Wrong check (was used before): (auth.jwt() ->> 'role') = 'admin'
    - All previous RLS policies on games table also used wrong path - fixed here
*/

-- ============================================================
-- MATERIALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  chapter text NOT NULL,
  description text DEFAULT '',
  upload_date date DEFAULT CURRENT_DATE,
  size text,
  url text,
  link text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'materials' AND policyname = 'Anyone can view materials') THEN
    CREATE POLICY "Anyone can view materials" ON materials FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'materials' AND policyname = 'Admins can insert materials') THEN
    CREATE POLICY "Admins can insert materials" ON materials FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'materials' AND policyname = 'Admins can update materials') THEN
    CREATE POLICY "Admins can update materials" ON materials FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'materials' AND policyname = 'Admins can delete materials') THEN
    CREATE POLICY "Admins can delete materials" ON materials FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS materials_chapter_idx ON materials(chapter);
CREATE INDEX IF NOT EXISTS materials_order_idx ON materials(order_index);

-- ============================================================
-- VIDEOS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail text,
  duration text,
  chapter text NOT NULL DEFAULT '',
  upload_date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  url text NOT NULL DEFAULT '',
  link text,
  content_type text DEFAULT 'link',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Anyone can view videos') THEN
    CREATE POLICY "Anyone can view videos" ON videos FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can insert videos') THEN
    CREATE POLICY "Admins can insert videos" ON videos FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can update videos') THEN
    CREATE POLICY "Admins can update videos" ON videos FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can delete videos') THEN
    CREATE POLICY "Admins can delete videos" ON videos FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS videos_chapter_idx ON videos(chapter);
CREATE INDEX IF NOT EXISTS videos_order_idx ON videos(order_index);

-- ============================================================
-- CUSTOM_TESTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS custom_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL DEFAULT 'link',
  content text,
  url text,
  chapter text NOT NULL DEFAULT '',
  upload_date date DEFAULT CURRENT_DATE,
  order_index integer DEFAULT 0,
  questions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_tests ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_tests' AND policyname = 'Anyone can view custom tests') THEN
    CREATE POLICY "Anyone can view custom tests" ON custom_tests FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_tests' AND policyname = 'Admins can insert custom tests') THEN
    CREATE POLICY "Admins can insert custom tests" ON custom_tests FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_tests' AND policyname = 'Admins can update custom tests') THEN
    CREATE POLICY "Admins can update custom tests" ON custom_tests FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_tests' AND policyname = 'Admins can delete custom tests') THEN
    CREATE POLICY "Admins can delete custom tests" ON custom_tests FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS custom_tests_chapter_idx ON custom_tests(chapter);
CREATE INDEX IF NOT EXISTS custom_tests_order_idx ON custom_tests(order_index);

-- ============================================================
-- CASES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS cases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  link text NOT NULL,
  thumbnail text,
  case_type text NOT NULL CHECK (case_type IN ('videos', 'presentations', 'pdfs', 'images')),
  order_index integer DEFAULT 0,
  upload_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cases' AND policyname = 'Anyone can read cases') THEN
    CREATE POLICY "Anyone can read cases" ON cases FOR SELECT TO public USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cases' AND policyname = 'Authenticated admins can insert cases') THEN
    CREATE POLICY "Authenticated admins can insert cases" ON cases FOR INSERT TO authenticated
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cases' AND policyname = 'Authenticated admins can update cases') THEN
    CREATE POLICY "Authenticated admins can update cases" ON cases FOR UPDATE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
      WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cases' AND policyname = 'Authenticated admins can delete cases') THEN
    CREATE POLICY "Authenticated admins can delete cases" ON cases FOR DELETE TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

-- ============================================================
-- FIX GAMES TABLE RLS (was using wrong JWT path)
-- ============================================================
DROP POLICY IF EXISTS "Authenticated admins can insert games" ON games;
DROP POLICY IF EXISTS "Authenticated admins can update games" ON games;
DROP POLICY IF EXISTS "Authenticated admins can delete games" ON games;

CREATE POLICY "Authenticated admins can insert games" ON games FOR INSERT TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Authenticated admins can update games" ON games FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Authenticated admins can delete games" ON games FOR DELETE TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================================
-- ANALYTICS: PAGE_VIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  visited_at timestamptz DEFAULT now(),
  session_id text
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_views' AND policyname = 'Anyone can insert page_views') THEN
    CREATE POLICY "Anyone can insert page_views" ON page_views FOR INSERT TO public WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'page_views' AND policyname = 'Admins can read page_views') THEN
    CREATE POLICY "Admins can read page_views" ON page_views FOR SELECT TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;

-- ============================================================
-- ANALYTICS: ITEM_CLICKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS item_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type text NOT NULL,
  item_id text,
  item_title text,
  action text NOT NULL,
  clicked_at timestamptz DEFAULT now(),
  session_id text
);

ALTER TABLE item_clicks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'item_clicks' AND policyname = 'Anyone can insert item_clicks') THEN
    CREATE POLICY "Anyone can insert item_clicks" ON item_clicks FOR INSERT TO public WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'item_clicks' AND policyname = 'Admins can read item_clicks') THEN
    CREATE POLICY "Admins can read item_clicks" ON item_clicks FOR SELECT TO authenticated
      USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
  END IF;
END $$;
