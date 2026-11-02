import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MoodType = 'trop_bien' | 'bien' | 'bof' | 'cauchemar';
export type SleepQuality = '' | 'pas_ouf' | 'mieux' | 'bien' | 'super_bien';

export interface Mood {
  id: string;
  date: string;
  mood_type: MoodType;
  had_breakfast: boolean;
  why: string;
  cigarettes: number;
  drinks_official: number;
  drinks_unofficial: number;
  sleep_quality: SleepQuality;
  created_at: string;
  updated_at: string;
}
