/*
  # Add content type fields to materials and videos

  1. Changes
    - Add `material_type` column to materials table
      - Values: 'lecture' or 'labwork'
      - Defaults to 'lecture' for existing records
    - Add `video_type` column to videos table
      - Values: 'lecture' or 'labwork'
      - Defaults to 'lecture' for existing records
  
  2. Notes
    - Uses IF NOT EXISTS to prevent errors on repeated runs
    - Sets default values to maintain compatibility with existing data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'material_type'
  ) THEN
    ALTER TABLE materials ADD COLUMN material_type text DEFAULT 'lecture' NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'videos' AND column_name = 'video_type'
  ) THEN
    ALTER TABLE videos ADD COLUMN video_type text DEFAULT 'lecture' NOT NULL;
  END IF;
END $$;