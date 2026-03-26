/*
  # Make video fields optional

  1. Changes to videos table
    - Make `chapter` field nullable (it's currently required but no longer used)
    - Make `duration` field nullable (already nullable, but documenting)
  
  2. Rationale
    - Chapter and duration fields are no longer required in the UI
    - Making chapter nullable allows videos to be created without chapter association
    - This simplifies the video management workflow
*/

-- Make chapter field nullable
ALTER TABLE videos ALTER COLUMN chapter DROP NOT NULL;
