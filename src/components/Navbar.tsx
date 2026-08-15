import React from 'react';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Github, 
  ExternalLink 
} from 'lucide-react';
import { ThemeMode, ProductivityStats } from '../types';

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenShortcuts: () => void;
  onOpenDeployGuide: () => void;
  stats: ProductivityStats;
  onOpenFocusMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  onOpenShortcuts,
  onOpenDeployGuide,
  stats,
}) => {
  const toggleThemeNext = () => {
    if (theme === 'dark') onThemeChange('light');
    else if (theme === 'light') onThemeChange('system');
    else onThemeChange('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4 text-neutral-300" />;
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    return <Monitor className="w-4 h-4 text-neutral-400" />;
  };

  const completionRate = stats.totalActive + stats.totalCompleted > 0
    ? Math.round((stats.totalCompleted / (stats.totalActive + stats.totalCompleted)) * 100)
    : 0;

  return (
    <header className="w-full border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/75 dark:bg-neutral-900/75 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand & Productivity indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-white dark:text-neutral-900 font-bold text-sm shadow-sm transition-transform active:scale-95">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-white">
                TaskFlow
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/60 dark:border-neutral-700/60">
                Minimal
              </span>
            </div>
            <p className="hidden sm:block text-xs text-neutral-500 dark:text-neutral-400">
              Focus &bull; Execute &bull; Flow
            </p>
          </div>
        </div>

        {/* Center/Right Productivity Metrics */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Daily streak & completion badge */}
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700/60 text-xs text-neutral-600 dark:text-neutral-300">
            <div className="flex items-center gap-1.5" title="Tasks completed today">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium">{stats.completedToday} today</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
            <div className="flex items-center gap-1.5" title="Daily completion rate">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{completionRate}% done</span>
            </div>
            {stats.streakDays > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                <div className="flex items-center gap-1 text-orange-500 font-semibold" title="Day streak">
                  <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                  <span>{stats.streakDays}d</span>
                </div>
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Sound toggle */}
            <button
              id="btn-toggle-sound"
              onClick={onToggleSound}
              title={soundEnabled ? 'Mute audio feedback' : 'Enable audio feedback'}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            </button>

            {/* Shortcuts help */}
            <button
              id="btn-shortcuts-guide"
              onClick={onOpenShortcuts}
              title="Keyboard Shortcuts (Press ? or Cmd+K)"
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Keyboard className="w-4 h-4" />
            </button>

            {/* Deploy / GitHub guide */}
            <button
              id="btn-deploy-guide"
              onClick={onOpenDeployGuide}
              title="Deploy & GitHub Export Guide"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Deploy / Export</span>
            </button>

            {/* Theme switcher */}
            <button
              id="btn-theme-switcher"
              onClick={toggleThemeNext}
              title={`Current theme: ${theme}. Click to switch.`}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {getThemeIcon()}
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
