import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Coffee, 
  Flame,
  Volume2,
  VolumeX,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TodoItem } from '../types';
import { soundEffects } from '../utils/audio';

interface FocusModalProps {
  task: TodoItem | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteTask: (id: string) => void;
  onIncrementPoms: (id: string) => void;
}

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMER_DURATIONS: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusModal: React.FC<FocusModalProps> = ({
  task,
  isOpen,
  onClose,
  onCompleteTask,
  onIncrementPoms,
}) => {
  const [timerMode, setTimerMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATIONS.pomodoro);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(TIMER_DURATIONS[timerMode]);
    setIsRunning(false);
  }, [timerMode, task]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            soundEffects.playTimerFinish();
            if (task && timerMode === 'pomodoro') {
              onIncrementPoms(task.id);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timerMode, task, onIncrementPoms]);

  if (!isOpen || !task) return null;

  const totalDuration = TIMER_DURATIONS[timerMode];
  const progressPercent = ((totalDuration - timeLeft) / totalDuration) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const toggleRun = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_DURATIONS[timerMode]);
  };

  const handleCompleteAndClose = () => {
    onCompleteTask(task.id);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-neutral-900 text-white border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center"
        >
          {/* Close button */}
          <button
            id="btn-close-focus-modal"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-800/80 rounded-xl mb-6">
            <button
              onClick={() => setTimerMode('pomodoro')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timerMode === 'pomodoro'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Focus (25m)
            </button>
            <button
              onClick={() => setTimerMode('shortBreak')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Short Break (5m)
            </button>
            <button
              onClick={() => setTimerMode('longBreak')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timerMode === 'longBreak'
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Long Break (15m)
            </button>
          </div>

          {/* Active Task Title */}
          <div className="mb-4 max-w-sm">
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-500 mb-1 block">
              Current Focus
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug line-clamp-2">
              {task.title}
            </h2>
            {task.category && (
              <span className="inline-block mt-1 text-xs text-neutral-400 font-mono">
                #{task.category}
              </span>
            )}
          </div>

          {/* Minimalist Circular Timer Display */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="w-56 h-56 rounded-full border-4 border-neutral-800 flex flex-col items-center justify-center relative shadow-inner">
              {/* Progress Ring Indicator */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="104"
                  className="text-amber-500"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 104}
                  strokeDashoffset={2 * Math.PI * 104 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>

              <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight text-white select-none">
                {formattedTime}
              </div>
              <span className="text-xs text-neutral-400 mt-2 font-medium">
                {isRunning ? 'Flow state active' : 'Paused'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={handleReset}
              title="Reset Timer"
              className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              id="btn-toggle-timer"
              onClick={toggleRun}
              className={`px-8 py-3.5 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 shadow-lg transition-all ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                  : 'bg-white hover:bg-neutral-100 text-neutral-900'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START FOCUS</span>
                </>
              )}
            </button>

            <button
              onClick={handleCompleteAndClose}
              title="Mark Task Completed & Close"
              className="p-3 rounded-full bg-neutral-800 hover:bg-emerald-600 hover:text-white text-emerald-400 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>

          {/* Task notes if present */}
          {task.notes && (
            <p className="mt-6 text-xs text-neutral-400 bg-neutral-800/50 px-4 py-2 rounded-lg border border-neutral-800 max-w-sm">
              {task.notes}
            </p>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
