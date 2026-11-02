import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { Mood, MoodType } from '../lib/supabase';
import { getMoods, getMoodColor, getMoodLabel, saveMood } from '../lib/moods';
import { MoodEditModal } from './MoodEditModal';
import type { LifestyleState } from './LifestyleFields';
import { ThemeToggle } from './ThemeToggle';

interface MoodCalendarProps {
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function MoodCalendar({ onBack, theme, onToggleTheme }: MoodCalendarProps) {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayMonth, setDisplayMonth] = useState(() => {
    const today = new Date();
    return { month: today.getMonth(), year: today.getFullYear() };
  });
  const [viewMode, setViewMode] = useState<'month' | 'year'>('year');
  const [cols, setCols] = useState(16);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  useEffect(() => {
    loadMoods();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setCols(20);
      else if (width < 1024) setCols(16);
      else setCols(20);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadMoods = async () => {
    try {
      const data = await getMoods();
      setMoods(data);
    } catch (error) {
      console.error('Error loading moods:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = (month: number, year: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return { days, month, year };
  };

  const getMoodForDate = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return moods.find(mood => mood.date === dateStr);
  };

  const isWithinEditWindow = (day: number, month: number, year: number) => {
    const targetDate = new Date(year, month, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - targetDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  const handleDateClick = (day: number, month: number, year: number) => {
    if (isWithinEditWindow(day, month, year)) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      setEditingDate(dateStr);
    }
  };

  const handleSaveMood = async (moodType: MoodType, lifestyle: LifestyleState, why: string) => {
    if (!editingDate) return;
    await saveMood(editingDate, {
      moodType,
      hadBreakfast: lifestyle.hadBreakfast,
      why,
      cigarettes: lifestyle.cigarettes,
      drinksOfficial: lifestyle.drinksOfficial,
      drinksUnofficial: lifestyle.drinksUnofficial,
      sleepQuality: lifestyle.sleepQuality,
    });
    const updatedMoods = await getMoods();
    setMoods(updatedMoods);
  };

  const previousMonth = () => {
    setDisplayMonth(prev => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { month: prev.month - 1, year: prev.year };
    });
  };

  const nextMonth = () => {
    setDisplayMonth(prev => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { month: prev.month + 1, year: prev.year };
    });
  };

  const dayNamesLong = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  const exportTxt = () => {
    const sorted = [...moods].sort((a, b) => a.date.localeCompare(b.date));
    const lines = sorted.map(mood => {
      const [year, month, day] = mood.date.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      const dayName = dayNamesLong[date.getDay()];
      const monthName = monthNames[month - 1].toLowerCase();
      const label = getMoodLabel(mood.mood_type);
      const breakfast = mood.had_breakfast ? 'true' : 'false';
      const why = mood.why || '';
      return `${dayName} ${day} ${monthName} ${year} ; ${label} ; ${breakfast} ; ${why}`;
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'humeurs.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const { days } = generateCalendar(displayMonth.month, displayMonth.year);
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-300">Chargement...</div>
      </div>
    );
  }

  const YearView = () => {
    const currentYear = displayMonth.year;

    const getAllYearDays = () => {
      const allDays = [];
      for (let month = 0; month < 12; month++) {
        const lastDay = new Date(currentYear, month + 1, 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
          allDays.push({ day, month, year: currentYear });
        }
      }
      return allDays;
    };

    const yearDays = getAllYearDays();

    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setDisplayMonth({ month: 0, year: displayMonth.year - 1 })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-bold text-gray-800">{currentYear}</h3>
          <button
            onClick={() => setDisplayMonth({ month: 0, year: displayMonth.year + 1 })}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
        <div className="flex justify-center">
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(8px, 1fr))`, gap: '0', width: '100%', minWidth: '100%' }}>
            {yearDays.map(({ day, month, year }, index) => {
              const mood = getMoodForDate(day, month, year);
              const today = new Date();
              const isToday =
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear();
              const canEdit = isWithinEditWindow(day, month, year);

              return (
                <div
                  key={`${month}-${day}`}
                  onClick={() => handleDateClick(day, month, year)}
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    backgroundColor: mood ? getMoodColor(mood.mood_type) : '#e5e7eb',
                    cursor: canEdit ? 'pointer' : 'default',
                    opacity: canEdit ? 1 : 0.7
                  }}
                  title={mood ? `${day} ${monthNames[month]}: ${getMoodLabel(mood.mood_type)}` : `${day} ${monthNames[month]}`}
                  className={canEdit ? 'hover:opacity-80 transition-opacity' : ''}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const MonthView = () => {
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
          >
            <ChevronLeft size={24} />
          </button>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {monthNames[displayMonth.month]} {displayMonth.year}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const mood = getMoodForDate(day, displayMonth.month, displayMonth.year);
            const today = new Date();
            const isToday =
              day === today.getDate() &&
              displayMonth.month === today.getMonth() &&
              displayMonth.year === today.getFullYear();

            return (
              <div
                key={day}
                className="aspect-square flex items-center justify-center rounded-lg transition-all"
                style={{
                  backgroundColor: mood ? getMoodColor(mood.mood_type) : '#f3f4f6',
                  color: mood ? '#ffffff' : '#6b7280'
                }}
                title={mood ? getMoodLabel(mood.mood_type) : undefined}
              >
                <span className="font-semibold">{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 py-8">
      {editingDate && (() => {
        const [y, m, d] = editingDate.split('-').map((v, i) => i === 1 ? parseInt(v) - 1 : parseInt(v));
        const mood = getMoodForDate(d, m, y);
        return (
          <MoodEditModal
            date={editingDate}
            onClose={() => setEditingDate(null)}
            onSave={handleSaveMood}
            currentMood={mood?.mood_type}
            currentBreakfast={mood?.had_breakfast}
            currentWhy={mood?.why}
            currentCigarettes={mood?.cigarettes}
            currentDrinksOfficial={mood?.drinks_official}
            currentDrinksUnofficial={mood?.drinks_unofficial}
            currentSleepQuality={mood?.sleep_quality}
          />
        );
      })()}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarIcon size={28} className="text-blue-600 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {viewMode === 'month' ? `${monthNames[displayMonth.month]} ${displayMonth.year}` : 'Historique'}
              </h2>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={exportTxt}
                className="flex items-center gap-1.5 px-3 py-1 text-sm rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                title="Exporter en .txt"
              >
                <Download size={15} />
                Exporter
              </button>
              <button
                onClick={() => setViewMode('year')}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  viewMode === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Année
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 text-sm rounded-lg font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Mois
              </button>
            </div>
          </div>

          {viewMode === 'year' ? <YearView /> : <MonthView />}

          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Légende</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">Trop bien</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">Bien</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">Bof</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#000000' }} />
                <span className="text-xs text-gray-700 dark:text-gray-300">Un cauchemar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}