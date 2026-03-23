/*
  # Initial Schema for Chemistry Learning Platform

  1. New Tables
    - `materials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `type` (text) - pdf, doc, ppt, image, video
      - `chapter` (text)
      - `description` (text)
      - `upload_date` (date)
      - `size` (text)
      - `url` (text)
      - `link` (text)
      - `order_index` (integer) - for custom ordering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `thumbnail` (text)
      - `duration` (text)
      - `chapter` (text)
      - `upload_date` (date)
      - `views` (integer)
      - `url` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `custom_tests`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `type` (text) - handwritten or link
      - `content` (text)
      - `url` (text)
      - `chapter` (text)
      - `upload_date` (date)
      - `order_index` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for authenticated and anonymous users
    - Admin-only write access (checked via custom claims)
*/

-- Create materials table
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

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail text,
  duration text,
  chapter text NOT NULL,
  upload_date date DEFAULT CURRENT_DATE,
  views integer DEFAULT 0,
  url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create custom_tests table
CREATE TABLE IF NOT EXISTS custom_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  type text NOT NULL,
  content text,
  url text,
  chapter text NOT NULL,
  upload_date date DEFAULT CURRENT_DATE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_tests ENABLE ROW LEVEL SECURITY;

-- Public read access for everyone
CREATE POLICY "Anyone can view materials"
  ON materials FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view videos"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view custom tests"
  ON custom_tests FOR SELECT
  USING (true);

-- Admin-only write access (using custom claim in JWT)
CREATE POLICY "Admins can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update videos"
  ON videos FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete videos"
  ON videos FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can insert custom tests"
  ON custom_tests FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can update custom tests"
  ON custom_tests FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'admin'
  );

CREATE POLICY "Admins can delete custom tests"
  ON custom_tests FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'admin'
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS materials_chapter_idx ON materials(chapter);
CREATE INDEX IF NOT EXISTS materials_order_idx ON materials(order_index);
CREATE INDEX IF NOT EXISTS videos_chapter_idx ON videos(chapter);
CREATE INDEX IF NOT EXISTS videos_order_idx ON videos(order_index);
CREATE INDEX IF NOT EXISTS custom_tests_chapter_idx ON custom_tests(chapter);
CREATE INDEX IF NOT EXISTS custom_tests_order_idx ON custom_tests(order_index);