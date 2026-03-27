/*
  # Create Analytics Tracking Tables

  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `section` (text, not null) - Which section/page was visited
      - `visited_at` (timestamptz) - Timestamp of the visit
      - `session_id` (text) - Browser session identifier
    
    - `item_clicks`
      - `id` (uuid, primary key)
      - `item_type` (text, not null) - Type of item (video, material, test, etc.)
      - `item_id` (text) - ID of the clicked item
      - `item_title` (text) - Title of the clicked item
      - `action` (text, not null) - Action performed (open, start, play, etc.)
      - `clicked_at` (timestamptz) - Timestamp of the click
      - `session_id` (text) - Browser session identifier

  2. Security
    - Enable RLS on both tables
    - Anyone (public) can insert tracking data
    - Only authenticated admins can read tracking data
*/

CREATE TABLE IF NOT EXISTS page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL,
  visited_at timestamptz DEFAULT now(),
  session_id text
);

CREATE TABLE IF NOT EXISTS item_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type text NOT NULL,
  item_id text,
  item_title text,
  action text NOT NULL,
  clicked_at timestamptz DEFAULT now(),
  session_id text
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert page_views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read page_views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Anyone can insert item_clicks"
  ON item_clicks
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Admins can read item_clicks"
  ON item_clicks
  FOR SELECT
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');