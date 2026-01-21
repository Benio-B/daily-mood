/*
  # Create moods tracking table

  1. New Tables
    - `moods`
      - `id` (uuid, primary key)
      - `date` (date, unique) - The date of the mood entry
      - `mood_type` (text) - One of: "trop_bien", "bien", "bof", "cauchemar"
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `moods` table
    - Add policy for anyone to read all moods (single user app)
    - Add policy for anyone to insert moods
    - Add policy for anyone to update moods
*/

CREATE TABLE IF NOT EXISTS moods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL,
  mood_type text NOT NULL CHECK (mood_type IN ('trop_bien', 'bien', 'bof', 'cauchemar')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view moods"
  ON moods FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert moods"
  ON moods FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update moods"
  ON moods FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete moods"
  ON moods FOR DELETE
  USING (true);