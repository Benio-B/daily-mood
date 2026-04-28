import { supabase, type MoodType, type Mood } from './supabase';

export async function saveMood(date: string, moodType: MoodType, hadBreakfast: boolean, why: string): Promise<void> {
  const { error } = await supabase
    .from('moods')
    .upsert({
      date,
      mood_type: moodType,
      had_breakfast: hadBreakfast,
      why,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'date'
    });

  if (error) {
    throw error;
  }
}

export async function getMoods(): Promise<Mood[]> {
  const { data, error } = await supabase
    .from('moods')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export function getMoodColor(moodType: MoodType): string {
  const colors = {
    trop_bien: '#22c55e',
    bien: '#eab308',
    bof: '#ef4444',
    cauchemar: '#000000'
  };
  return colors[moodType];
}

export function getMoodLabel(moodType: MoodType): string {
  const labels = {
    trop_bien: 'Trop bien',
    bien: 'Bien',
    bof: 'Bof',
    cauchemar: 'Un cauchemar'
  };
  return labels[moodType];
}
