/*
  # Add breakfast tracking to moods

  1. Modified Tables
    - `moods`
      - `had_breakfast` (boolean) - Whether the user had breakfast that day
      - Default: false

  2. Changes
    - Add new column `had_breakfast` to track breakfast correlation with mood
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'had_breakfast'
  ) THEN
    ALTER TABLE moods ADD COLUMN had_breakfast boolean DEFAULT false;
  END IF;
END $$;