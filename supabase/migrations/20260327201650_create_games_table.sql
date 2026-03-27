/*
  # Create Games Table

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text)
      - `link` (text, not null) - URL to the game
      - `order_index` (integer) - For drag-and-drop ordering
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on games table
    - Public can read all games
    - Only authenticated admins can insert, update, delete games
*/

CREATE TABLE IF NOT EXISTS games (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  link text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read games"
  ON games
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated admins can insert games"
  ON games
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Authenticated admins can update games"
  ON games
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin')
  WITH CHECK ((auth.jwt()->>'role')::text = 'admin');

CREATE POLICY "Authenticated admins can delete games"
  ON games
  FOR DELETE
  TO authenticated
  USING ((auth.jwt()->>'role')::text = 'admin');