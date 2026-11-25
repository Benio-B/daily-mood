import { useState } from 'react';
import { MoodSelector } from './components/MoodSelector';
import { MoodCalendar } from './components/MoodCalendar';
import { useTheme } from './lib/useTheme';

function App() {
  const [view, setView] = useState<'selector' | 'calendar'>('selector');
  const { theme, toggle } = useTheme();

  if (view === 'calendar') {
    return <MoodCalendar onBack={() => setView('selector')} theme={theme} onToggleTheme={toggle} />;
  }

  return <MoodSelector onViewCalendar={() => setView('calendar')} theme={theme} onToggleTheme={toggle} />;
}

export default App;
