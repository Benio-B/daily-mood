import { useState, useMemo } from 'react';
import { X, Smile, Frown, Skull } from 'lucide-react';
import type { MoodType } from '../lib/supabase';

interface MoodEditModalProps {
  date: string;
  onClose: () => void;
  onSave: (moodType: MoodType, hadBreakfast: boolean, why: string) => Promise<void>;
  currentMood?: MoodType;
  currentBreakfast?: boolean;
  currentWhy?: string;
}

export function MoodEditModal({ date, onClose, onSave, currentMood, currentBreakfast, currentWhy }: MoodEditModalProps) {
  const [verified, setVerified] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(currentMood || null);
  const [hadBreakfast, setHadBreakfast] = useState(currentBreakfast || false);
  const [why, setWhy] = useState(currentWhy || '');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);

  const challenge = useMemo(() => generateChallenge(), []);

  const moods: Array<{ type: MoodType; label: string; icon: typeof Smile; color: string }> = [
    { type: 'trop_bien', label: 'Trop bien', icon: Smile, color: 'bg-green-500 hover:bg-green-600' },
    { type: 'bien', label: 'Bien', icon: Smile, color: 'bg-yellow-500 hover:bg-yellow-600' },
    { type: 'bof', label: 'Bof', icon: Frown, color: 'bg-red-500 hover:bg-red-600' },
    { type: 'cauchemar', label: 'Un cauchemar', icon: Skull, color: 'bg-black hover:bg-gray-800' },
  ];

  const handleVerify = () => {
    if (checkAnswer(challenge, answer)) {
      setVerified(true);
    } else {
      setAnswer('');
      alert('Mauvaise réponse, essaye encore!');
    }
  };

  const handleSave = async () => {
    if (!selectedMood) return;
    setSaving(true);
    try {
      await onSave(selectedMood, hadBreakfast, why);
      onClose();
    } catch (error) {
      console.error('Error saving mood:', error);
      alert('Erreur en sauvegardant le mood');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = () => {
    const [year, month, day] = date.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return d.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {verified ? 'Ajouter un mood' : 'Vérification'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <p className="text-gray-600 mb-6 text-center">{formatDate()}</p>

        {!verified ? (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Comment ça se passe?</p>
              <p className="text-lg font-semibold text-gray-800">
                {challenge.question}
              </p>
            </div>

            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              placeholder="Votre réponse..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            <button
              onClick={handleVerify}
              disabled={!answer.trim()}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vérifier
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {moods.map(({ type, label, icon: Icon, color }) => (
                <button
                  key={type}
                  onClick={() => setSelectedMood(type)}
                  className={`${color} ${selectedMood === type ? 'ring-4 ring-offset-2 ring-blue-400' : ''} text-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`}
                >
                  <Icon size={32} strokeWidth={2} />
                  <span className="text-sm font-semibold text-center">{label}</span>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                checked={hadBreakfast}
                onChange={(e) => setHadBreakfast(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded cursor-pointer"
              />
              <span className="text-gray-800 font-medium">As-tu pris ton petit déjeuner?</span>
            </label>

            <div className="space-y-2">
              <label className="block text-gray-800 font-medium text-sm">Pourquoi? ({why.length}/500)</label>
              <textarea
                value={why}
                onChange={(e) => setWhy(e.target.value.slice(0, 500))}
                placeholder="Explique en quelques mots ton choix..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setVerified(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedMood || saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Challenge {
  question: string;
  answer: string;
}

function generateChallenge(): Challenge {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = Math.random() > 0.5 ? '+' : '-';

  const correctAnswer = operation === '+' ? num1 + num2 : num1 - num2;

  return {
    question: `${num1} ${operation} ${num2} = ?`,
    answer: correctAnswer.toString()
  };
}

function checkAnswer(challenge: Challenge, answer: string): boolean {
  return challenge.answer === answer.trim();
}