/*
  # Add why column to moods

  1. Modified Tables
    - `moods`
      - `why` (text) - User's explanation for their mood choice (max 200 characters)
      - Default: empty string

  2. Changes
    - Add new column `why` to store the reason for the mood choice
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'why'
  ) THEN
    ALTER TABLE moods ADD COLUMN why text DEFAULT '';
  END IF;
END $$;