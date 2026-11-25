/*
# Make mood_type nullable to support progressive day logging

1. Modified Tables
  - `moods`
    - `mood_type` (text) — changed from NOT NULL to nullable.

2. Changes
  - Users can now save their day data (breakfast, cigarettes, drinks, sleep, why)
    before choosing a mood. The mood can be set later.
  - The CHECK constraint on mood_type is kept (still validates values when present).

3. Rationale
  - The home page now auto-saves every field as the user fills it in throughout the
    day. Requiring a mood would block those incremental saves.
*/

ALTER TABLE moods ALTER COLUMN mood_type DROP NOT NULL;
