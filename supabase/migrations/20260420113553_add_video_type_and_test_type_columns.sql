/*
  # Add missing type columns to videos and custom_tests tables

  1. Changes to `videos` table
    - Add `video_type` column (text, default 'lecture')
      Distinguishes lecture videos from lab work videos.
      Values: 'lecture' | 'labwork'

  2. Changes to `custom_tests` table
    - Add `test_type` column (text, default 'lecture')
      Distinguishes lecture tests from lab work tests.
      Values: 'lecture' | 'labwork'
    - Add `file_link` column (text, nullable)
      Stores the external URL for 'link' type tests (e.g. Google Forms).
      The component uses `file_link` as the column name, separate from `url`.

  3. Indexes
    - Add index on videos(video_type) for fast tab filtering
    - Add index on custom_tests(test_type) for fast tab filtering

  4. Notes
    - Both columns default to 'lecture' so all existing rows remain valid
    - The chapter column already has a default of '' so insert without chapter is safe
*/

-- videos: add video_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE videos ADD COLUMN video_type text NOT NULL DEFAULT 'lecture';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS videos_video_type_idx ON videos(video_type);

-- custom_tests: add test_type
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'test_type'
  ) THEN
    ALTER TABLE custom_tests ADD COLUMN test_type text NOT NULL DEFAULT 'lecture';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS custom_tests_test_type_idx ON custom_tests(test_type);

-- custom_tests: add file_link (separate from url, used for external test links)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'file_link'
  ) THEN
    ALTER TABLE custom_tests ADD COLUMN file_link text;
  END IF;
END $$;
