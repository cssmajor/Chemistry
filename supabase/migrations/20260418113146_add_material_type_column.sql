/*
  # Add material_type column to materials table

  1. Changes
    - `materials` table: add `material_type` column (text, default 'lecture')
      - Used to distinguish between lecture materials and lab work materials
      - Values: 'lecture' or 'labwork'
      - All existing rows default to 'lecture'

  2. Index
    - Add index on material_type for faster filtering queries
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'materials' AND column_name = 'material_type'
  ) THEN
    ALTER TABLE materials ADD COLUMN material_type text NOT NULL DEFAULT 'lecture';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS materials_material_type_idx ON materials(material_type);
