import { useState, useEffect, useRef, useCallback } from 'react';
import { Smile, Meh, Frown, Skull, Calendar, Check, Loader2, AlertCircle } from 'lucide-react';
import type { MoodType } from '../lib/supabase';
import { LifestyleFields, defaultLifestyle, type LifestyleState } from './LifestyleFields';
import { ThemeToggle } from './ThemeToggle';
import { saveMood, getMoodByDate } from '../lib/moods';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface MoodSelectorProps {
  onViewCalendar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function MoodSelector({ onViewCalendar, theme, onToggleTheme }: MoodSelectorProps) {
  const [moodType, setMoodType] = useState<MoodType | null>(null);
  const [lifestyle, setLifestyle] = useState<LifestyleState>(defaultLifestyle);
  const [why, setWhy] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const loadedRef = useRef(false);

  const moods: Array<{ type: MoodType; label: string; icon: typeof Smile; color: string }> = [
    { type: 'trop_bien', label: 'Trop bien', icon: Smile, color: 'bg-green-500 hover:bg-green-600' },
    { type: 'bien', label: 'Bien', icon: Meh, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { type: 'bof', label: 'Bof', icon: Frown, color: 'bg-red-500 hover:bg-red-600' },
    { type: 'cauchemar', label: 'Un cauchemar', icon: Skull, color: 'bg-black hover:bg-gray-800' },
  ];

  // Load today's data on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const existing = await getMoodByDate(todayStr());
        if (cancelled || !existing) return;
        setMoodType(existing.mood_type);
        setLifestyle({
          hadBreakfast: existing.had_breakfast,
          cigarettes: existing.cigarettes,
          drinksOfficial: existing.drinks_official,
          drinksUnofficial: existing.drinks_unofficial,
          sleepQuality: existing.sleep_quality,
        });
        setWhy(existing.why || '');
      } catch (error) {
        console.error('Error loading today mood:', error);
      } finally {
        if (!cancelled) {
          loadedRef.current = true;
          setLoading(false);
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Auto-save whenever data changes (after initial load)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(async (mood: MoodType | null, life: LifestyleState, reason: string) => {
    setSaveStatus('saving');
    try {
      await saveMood(todayStr(), {
        moodType: mood,
        hadBreakfast: life.hadBreakfast,
        why: reason,
        cigarettes: life.cigarettes,
        drinksOfficial: life.drinksOfficial,
        drinksUnofficial: life.drinksUnofficial,
        sleepQuality: life.sleepQuality,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Error auto-saving:', error);
      setSaveStatus('error');
    }
  }, []);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => doSave(moodType, lifestyle, why), 600);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moodType, lifestyle, why, doSave]);

  const handleMoodClick = (type: MoodType) => {
    setMoodType(type);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-2">
          <SaveIndicator status={saveStatus} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-3 text-center">
          Comment s'est passée ta journée ?
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
          {moodType ? 'Tu peux changer ton humeur à tout moment' : "Choisis une humeur pour aujourd'hui"}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {moods.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => handleMoodClick(type)}
              className={`${color} ${moodType === type ? 'ring-4 ring-offset-2 ring-blue-400 dark:ring-offset-gray-800' : ''} text-white rounded-xl p-6 flex flex-col items-center justify-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
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

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return <div />;

  const config = {
    saving: { icon: Loader2, text: 'Enregistrement...', className: 'text-blue-600 dark:text-blue-400', spin: true },
    saved: { icon: Check, text: 'Enregistré', className: 'text-green-600 dark:text-green-400', spin: false },
    error: { icon: AlertCircle, text: 'Erreur de sauvegarde', className: 'text-red-600 dark:text-red-400', spin: false },
  }[status];

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${config.className}`}>
      <Icon size={16} className={config.spin ? 'animate-spin' : ''} />
      <span>{config.text}</span>
    </div>
  );
}
