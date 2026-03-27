/*
  # Create Cases Table

  1. New Tables
    - `cases`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `link` (text, not null) - URL to the case resource
      - `thumbnail` (text) - Optional custom thumbnail URL
      - `case_type` (text, not null) - Type: videos, presentations, pdfs, images
      - `order_index` (integer) - For drag-and-drop ordering
      - `upload_date` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on cases table
    - Public can read all cases
    - Only authenticated admins can insert, update, delete cases
*/

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

CREATE POLICY "Anyone can read cases"
  ON cases
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert cases"
  ON cases
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Authenticated admins can update cases"
  ON cases
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Authenticated admins can delete cases"
  ON cases
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');