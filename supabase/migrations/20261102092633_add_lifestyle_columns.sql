/*
# Add lifestyle tracking columns to moods

1. Modified Tables
  - `moods`
    - `cigarettes` (integer, default 0) — number of cigarettes smoked that day
    - `drinks_official` (integer, default 0) — number of glasses drunk officially
    - `drinks_unofficial` (integer, default 0) — number of glasses drunk unofficially
    - `sleep_quality` (text, default '') — sleep quality: one of "pas_ouf", "mieux", "bien", "super_bien"

2. Changes
  - Add four new columns to track daily lifestyle habits alongside mood.
  - Cigarettes and drinks default to 0.
  - sleep_quality uses a CHECK constraint to enforce valid values, defaulting to empty string (no answer yet).
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'cigarettes'
  ) THEN
    ALTER TABLE moods ADD COLUMN cigarettes integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'drinks_official'
  ) THEN
    ALTER TABLE moods ADD COLUMN drinks_official integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'drinks_unofficial'
  ) THEN
    ALTER TABLE moods ADD COLUMN drinks_unofficial integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'moods' AND column_name = 'sleep_quality'
  ) THEN
    ALTER TABLE moods ADD COLUMN sleep_quality text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'moods_sleep_quality_check'
  ) THEN
    ALTER TABLE moods ADD CONSTRAINT moods_sleep_quality_check
      CHECK (sleep_quality IN ('', 'pas_ouf', 'mieux', 'bien', 'super_bien'));
  END IF;
END $$;
