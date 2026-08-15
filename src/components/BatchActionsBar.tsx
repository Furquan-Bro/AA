import React from 'react';
import { Check, Trash2, X, Flag, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { Priority } from '../types';

interface BatchActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBatchComplete: () => void;
  onBatchDelete: () => void;
  onBatchPriority: (priority: Priority) => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBatchComplete,
  onBatchDelete,
  onBatchPriority,
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-neutral-800 dark:border-neutral-200 text-xs sm:text-sm font-medium"
    >
      <div className="flex items-center gap-2 pr-2 border-r border-neutral-700 dark:border-neutral-300">
        <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center">
          {selectedCount}
        </span>
        <span>Selected</span>
      </div>

      <button
        onClick={onBatchComplete}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
      >
        <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
        <span>Complete</span>
      </button>

      <button
        onClick={() => onBatchPriority('high')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-rose-400 dark:text-rose-600"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>High Priority</span>
      </button>

      <button
        onClick={onBatchDelete}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/60 dark:hover:bg-rose-100 text-rose-400 dark:text-rose-600 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        <span>Delete</span>
      </button>

      <button
        onClick={onClearSelection}
        title="Deselect all"
        className="p-1 rounded-md text-neutral-400 hover:text-white dark:hover:text-neutral-900 transition-colors ml-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
