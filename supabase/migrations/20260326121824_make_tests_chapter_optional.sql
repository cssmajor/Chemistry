/*
  # Make chapter field optional in custom_tests table

  1. Changes
    - Alter `chapter` column in `custom_tests` table to allow NULL values
    - This allows tests to be saved without requiring a chapter assignment
  
  2. Rationale
    - Tests may not always belong to a specific chapter
    - Makes the form more flexible for admin users
*/

-- Make chapter column nullable
ALTER TABLE custom_tests ALTER COLUMN chapter DROP NOT NULL;
