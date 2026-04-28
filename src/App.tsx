import { useState } from 'react';
import { MoodSelector } from './components/MoodSelector';
import { MoodCalendar } from './components/MoodCalendar';
import { saveMood } from './lib/moods';
import type { MoodType } from './lib/supabase';

function App() {
  const [view, setView] = useState<'selector' | 'calendar'>('selector');
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = async (mood: MoodType, hadBreakfast: boolean, why: string) => {
    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      await saveMood(today, mood, hadBreakfast, why);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Enregistrement...</div>
      </div>
    );
  }

  if (view === 'calendar') {
    return <MoodCalendar onBack={() => setView('selector')} />;
  }

  return <MoodSelector onMoodSelect={handleMoodSelect} onViewCalendar={() => setView('calendar')} />;
}

export default App;
