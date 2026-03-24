/*
  # Update Tests Schema for Question Options and Additional Materials

  1. Changes to custom_tests table
    - Update `questions` column structure to include:
      - question: string (the question text)
      - options: array of strings (answer options)
      - correct_option: number (index of correct answer)
      - additional_materials_link: string (optional link to related materials)
  
  2. Notes
    - Questions stored as JSONB with structure:
      {
        id: number,
        question: string,
        options: string[],
        correct_option: number,
        additional_materials_link?: string
      }
    - No chapter association - tests are independent
    - Admin has full control over questions, options, and correct answers
*/

-- The questions column already exists, this migration documents the expected structure
-- No schema changes needed, just documentation of the JSON structure
