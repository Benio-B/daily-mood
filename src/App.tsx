import { useState } from 'react';
import { MoodSelector } from './components/MoodSelector';
import { MoodCalendar } from './components/MoodCalendar';
import { saveMood } from './lib/moods';
import type { MoodType } from './lib/supabase';
import type { LifestyleState } from './components/LifestyleFields';
import { useTheme } from './lib/useTheme';

function App() {
  const [view, setView] = useState<'selector' | 'calendar'>('selector');
  const [saving, setSaving] = useState(false);
  const { theme, toggle } = useTheme();

  const handleMoodSelect = async (mood: MoodType, lifestyle: LifestyleState, why: string) => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await saveMood(today, {
        moodType: mood,
        hadBreakfast: lifestyle.hadBreakfast,
        why,
        cigarettes: lifestyle.cigarettes,
        drinksOfficial: lifestyle.drinksOfficial,
        drinksUnofficial: lifestyle.drinksUnofficial,
        sleepQuality: lifestyle.sleepQuality,
      });
      setView('calendar');
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Erreur lors de la sauvegarde de l\'humeur');
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Enregistrement...</div>
      </div>
    );
  }

  if (view === 'calendar') {
    return <MoodCalendar onBack={() => setView('selector')} theme={theme} onToggleTheme={toggle} />;
  }

  return <MoodSelector onMoodSelect={handleMoodSelect} onViewCalendar={() => setView('calendar')} theme={theme} onToggleTheme={toggle} />;
}

export default App;
