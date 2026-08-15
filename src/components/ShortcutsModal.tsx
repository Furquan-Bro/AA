import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', description: 'Focus Quick Add input for a new task' },
    { key: '⌘ / Ctrl + K', description: 'Focus search bar or global search' },
    { key: 'D', description: 'Toggle Dark / Light / System theme' },
    { key: 'Esc', description: 'Close modals / cancel editing / blur inputs' },
    { key: 'Enter (in Add Task)', description: 'Save and submit task' },
    { key: '!high / !med / !low', description: 'Inline modifier for task priority' },
    { key: '#work / #personal', description: 'Inline modifier for task category/tag' },
    { key: '@today / @tomorrow', description: 'Inline modifier for due date' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-neutral-900 dark:text-neutral-100"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                <Keyboard className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base tracking-tight">Keyboard Productivity</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 text-xs">
            {shortcuts.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200/50 dark:border-neutral-800/50"
              >
                <span className="text-neutral-600 dark:text-neutral-400 font-medium">
                  {item.description}
                </span>
                <kbd className="px-2 py-1 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-mono font-semibold shadow-2xs whitespace-nowrap">
                  {item.key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
