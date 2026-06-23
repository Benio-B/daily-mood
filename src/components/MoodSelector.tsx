import { useState } from 'react';
import { Smile, Meh, Frown, Skull, Calendar } from 'lucide-react';
import type { MoodType } from '../lib/supabase';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType, hadBreakfast: boolean, why: string) => void;
  onViewCalendar: () => void;
}

export function MoodSelector({ onMoodSelect, onViewCalendar }: MoodSelectorProps) {
  const [hadBreakfast, setHadBreakfast] = useState(false);
  const [why, setWhy] = useState('');
  const moods: Array<{ type: MoodType; label: string; icon: typeof Smile; color: string }> = [
    { type: 'trop_bien', label: 'Trop bien', icon: Smile, color: 'bg-green-500 hover:bg-green-600' },
    { type: 'bien', label: 'Bien', icon: Smile, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { type: 'bof', label: 'Bof', icon: Frown, color: 'bg-red-500 hover:bg-red-600' },
    { type: 'cauchemar', label: 'Un cauchemar', icon: Skull, color: 'bg-black hover:bg-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
          Comment s'est passée ta journée ?
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Choisis une humeur pour aujourd'hui
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {moods.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => onMoodSelect(type, hadBreakfast, why)}
              className={`${color} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
            >
              <Icon size={48} strokeWidth={2} />
              <span className="text-xl font-semibold">{label}</span>
            </button>
          ))}
        </div>

        <label className="block bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4 cursor-pointer hover:border-blue-300 hover:bg-blue-100 transition-colors">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={hadBreakfast}
              onChange={(e) => setHadBreakfast(e.target.checked)}
              className="w-6 h-6 text-blue-600 rounded cursor-pointer"
            />
            <span className="text-gray-800 font-semibold text-lg">As-tu pris ton petit déjeuner?</span>
          </div>
        </label>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2">
          <label className="block text-gray-800 font-semibold text-sm">Pourquoi? ({why.length}/500)</label>
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value.slice(0, 500))}
            placeholder="Explique en quelques mots ton choix..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
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