import { useState } from 'react';
import { Smile, Meh, Frown, Skull, Calendar } from 'lucide-react';
import type { MoodType } from '../lib/supabase';
import { LifestyleFields, defaultLifestyle, type LifestyleState } from './LifestyleFields';
import { ThemeToggle } from './ThemeToggle';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType, lifestyle: LifestyleState, why: string) => void;
  onViewCalendar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function MoodSelector({ onMoodSelect, onViewCalendar, theme, onToggleTheme }: MoodSelectorProps) {
  const [lifestyle, setLifestyle] = useState<LifestyleState>(defaultLifestyle);
  const [why, setWhy] = useState('');
  const moods: Array<{ type: MoodType; label: string; icon: typeof Smile; color: string }> = [
    { type: 'trop_bien', label: 'Trop bien', icon: Smile, color: 'bg-green-500 hover:bg-green-600' },
    { type: 'bien', label: 'Bien', icon: Meh, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { type: 'bof', label: 'Bof', icon: Frown, color: 'bg-red-500 hover:bg-red-600' },
    { type: 'cauchemar', label: 'Un cauchemar', icon: Skull, color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">
          Comment s'est passée ta journée ?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          Choisis une humeur pour aujourd'hui
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {moods.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type, lifestyle, why)}
              className={`${color} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
            >
              <Icon size={48} strokeWidth={2} />
              <span className="text-xl font-semibold">{label}</span>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <LifestyleFields value={lifestyle} onChange={setLifestyle} />
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 space-y-2">
          <label className="block text-gray-800 dark:text-gray-200 font-semibold text-sm">Pourquoi ? ({why.length}/500)</label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value.slice(0, 500))}
            placeholder="Explique en quelques mots ton choix..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            rows={3}
          />
        </div>

        <button
          onClick={onViewCalendar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-4 flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        >
          <Calendar size={24} />
          <span className="text-lg font-semibold">Voir l'historique</span>
        </button>
      </div>
    </div>
  );
}
