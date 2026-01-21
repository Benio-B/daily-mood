import { Smile, Meh, Frown, Skull, Calendar } from 'lucide-react';
import type { MoodType } from '../lib/supabase';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodType) => void;
  onViewCalendar: () => void;
}

export function MoodSelector({ onMoodSelect, onViewCalendar }: MoodSelectorProps) {
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
              onClick={() => onMoodSelect(type)}
              className={`${color} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
            >
              <Icon size={48} strokeWidth={2} />
              <span className="text-xl font-semibold">{label}</span>
            </button>
          ))}
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
