import { Cigarette, Wine, Moon } from 'lucide-react';
import type { SleepQuality } from '../lib/supabase';

export interface LifestyleState {
  hadBreakfast: boolean;
  cigarettes: number;
  drinksOfficial: number;
  drinksUnofficial: number;
  sleepQuality: SleepQuality;
}

export const defaultLifestyle: LifestyleState = {
  hadBreakfast: false,
  cigarettes: 0,
  drinksOfficial: 0,
  drinksUnofficial: 0,
  sleepQuality: '',
};

const sleepOptions: Array<{ value: SleepQuality; label: string }> = [
  { value: 'pas_ouf', label: 'Pas ouf' },
  { value: 'mieux', label: 'Il y a eu mieux' },
  { value: 'bien', label: 'Bien' },
  { value: 'super_bien', label: 'Super bien' },
];

interface LifestyleFieldsProps {
  value: LifestyleState;
  onChange: (next: LifestyleState) => void;
  variant?: 'card' | 'compact';
}

export function LifestyleFields({ value, onChange, variant = 'card' }: LifestyleFieldsProps) {
  const wrap = variant === 'card' ? 'bg-gray-50 dark:bg-gray-700 rounded-xl p-4' : '';

  return (
    <div className={`space-y-4 ${wrap}`}>
      <BreakfastField
        checked={value.hadBreakfast}
        onChange={(hadBreakfast) => onChange({ ...value, hadBreakfast })}
      />

      <NumberField
        icon={Cigarette}
        label="Combien de cigarettes as-tu fumé ?"
        value={value.cigarettes}
        onChange={(cigarettes) => onChange({ ...value, cigarettes })}
      />

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Wine size={18} className="text-purple-600 dark:text-purple-400" />
          <span className="text-gray-800 dark:text-gray-200 font-semibold text-sm">Combien de verres as-tu bu ?</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Officiel"
            value={value.drinksOfficial}
            onChange={(drinksOfficial) => onChange({ ...value, drinksOfficial })}
            bare
          />
          <NumberField
            label="Officieux"
            value={value.drinksUnofficial}
            onChange={(drinksUnofficial) => onChange({ ...value, drinksUnofficial })}
            bare
          />
        </div>
      </div>

      <SleepField
        value={value.sleepQuality}
        onChange={(sleepQuality) => onChange({ ...value, sleepQuality })}
      />
    </div>
  );
}

interface BreakfastFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function BreakfastField({ checked, onChange }: BreakfastFieldProps) {
  return (
    <label className="block bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-6 h-6 text-blue-600 rounded cursor-pointer"
        />
        <span className="text-gray-800 dark:text-gray-200 font-semibold text-lg">As-tu pris ton petit déjeuner ?</span>
      </div>
    </label>
  );
}

interface NumberFieldProps {
  icon?: typeof Cigarette;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  bare?: boolean;
}

function NumberField({ icon: Icon, label, value, onChange, bare }: NumberFieldProps) {
  return (
    <div className={bare ? '' : 'space-y-2'}>
      {label && (
        <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold text-sm">
          {Icon && <Icon size={18} className="text-orange-600 dark:text-orange-400" />}
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-bold text-lg flex items-center justify-center transition-colors"
        >
          −
        </button>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="w-16 text-center px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-bold text-lg flex items-center justify-center transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}

interface SleepFieldProps {
  value: SleepQuality;
  onChange: (value: SleepQuality) => void;
}

function SleepField({ value, onChange }: SleepFieldProps) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold text-sm">
        <Moon size={18} className="text-indigo-600 dark:text-indigo-400" />
        As-tu bien dormi la nuit dernière ?
      </label>
      <div className="grid grid-cols-2 gap-2">
        {sleepOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? '' : opt.value)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border-2 ${
              value === opt.value
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
