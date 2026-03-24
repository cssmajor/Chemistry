/*
  # Add Questions to Tests

  1. Changes to custom_tests table
    - Add `questions` column (jsonb) to store array of questions with answers
      Each question: { id: number, question: string, answer: string }
  
  2. Notes
    - Questions are stored as JSONB for flexibility
    - Admin can add multiple questions with their correct answers
*/

-- Add questions column to custom_tests table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'custom_tests' AND column_name = 'questions'
  ) THEN
    ALTER TABLE custom_tests ADD COLUMN questions jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;