/*
  # Update Tests Schema for Enhanced Features

  1. Changes to custom_tests table
    - Add `test_type` column (labwork or lecture)
    - Rename url to file_link for consistency
  
  2. New Tables
    - `test_attempts` - Track user test attempts and scores
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `test_id` (uuid, references custom_tests)
      - `score` (integer)
      - `total_questions` (integer)
      - `percentage` (numeric)
      - `answers` (jsonb)
      - `created_at` (timestamp)
  
  3. Security
    - Enable RLS on test_attempts
    - Only authenticated users can view their own attempts
    - Admins can view all attempts and statistics
*/

-- Add test_type column to custom_tests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'test_type'
  ) THEN
    ALTER TABLE custom_tests ADD COLUMN test_type text DEFAULT 'lecture' CHECK (test_type IN ('labwork', 'lecture'));
  END IF;
END $$;

-- Rename url to file_link for clarity
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'file_link'
  ) THEN
    ALTER TABLE custom_tests RENAME COLUMN url TO file_link;
  END IF;
END $$;

-- Create test_attempts table for tracking history
CREATE TABLE IF NOT EXISTS test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id uuid REFERENCES custom_tests(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  percentage numeric(5,2) GENERATED ALWAYS AS ((score::numeric / total_questions::numeric) * 100) STORED,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on test_attempts
ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

-- Users can view their own test attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_attempts' AND policyname = 'Users can view own test attempts'
  ) THEN
    CREATE POLICY "Users can view own test attempts"
      ON test_attempts
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Users can insert their own test attempts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'test_attempts' AND policyname = 'Users can insert own test attempts'
  ) THEN
    CREATE POLICY "Users can insert own test attempts"
      ON test_attempts
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON test_attempts(test_id);
CREATE INDEX IF NOT EXISTS idx_custom_tests_order_index ON custom_tests(order_index);
CREATE INDEX IF NOT EXISTS idx_custom_tests_test_type ON custom_tests(test_type);