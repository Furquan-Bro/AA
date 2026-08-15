import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Flag, 
  Tag, 
  AlignLeft, 
  CheckSquare, 
  Timer, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Priority, TodoItem, SubTask } from '../types';
import { getTodayDateString, getTomorrowDateString } from '../utils/date';

interface QuickAddProps {
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>) => void;
  categories: string[];
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const QuickAdd: React.FC<QuickAddProps> = ({
  onAddTodo,
  categories,
  inputRef: externalInputRef,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('none');
  const [category, setCategory] = useState<string>('General');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [estimatedPoms, setEstimatedPoms] = useState<number>(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const internalInputRef = useRef<HTMLInputElement>(null);
  const activeInputRef = externalInputRef || internalInputRef;

  // Smart natural language parsing on typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    // Parse inline tokens if user types special tokens
    // Priority: !high, !med, !low
    if (/\B!high\b|\B!h\b/i.test(value)) {
      setPriority('high');
    } else if (/\B!med\b|\B!medium\b|\B!m\b/i.test(value)) {
      setPriority('medium');
    } else if (/\B!low\b|\B!l\b/i.test(value)) {
      setPriority('low');
    }

    // Due dates: @today, @tomorrow
    if (/\B@today\b/i.test(value)) {
      setDueDate(getTodayDateString());
    } else if (/\B@tomorrow\b/i.test(value)) {
      setDueDate(getTomorrowDateString());
    }

    // Categories: #work, #personal, #projects, #study
    const catMatch = value.match(/#([a-zA-Z0-9_-]+)/);
    if (catMatch && catMatch[1]) {
      const parsedCat = catMatch[1];
      const matched = categories.find(c => c.toLowerCase() === parsedCat.toLowerCase());
      if (matched) {
        setCategory(matched);
      } else {
        // Capitalize first letter
        setCategory(parsedCat.charAt(0).toUpperCase() + parsedCat.slice(1));
      }
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) return;

    // Clean up parsed modifiers from title for clean display
    let cleanedTitle = title
      .replace(/\B!(high|medium|med|low|h|m|l)\b/gi, '')
      .replace(/\B@(today|tomorrow)\b/gi, '')
      .replace(/#([a-zA-Z0-9_-]+)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedTitle) {
      cleanedTitle = title.trim();
    }

    onAddTodo({
      title: cleanedTitle,
      priority,
      category,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      notes: notes.trim() || undefined,
      subtasks,
      estimatedPoms,
      completedPoms: 0,
    });

    // Reset form
    setTitle('');
    setPriority('none');
    setCategory('General');
    setDueDate('');
    setDueTime('');
    setNotes('');
    setSubtasks([]);
    setNewSubtaskTitle('');
    setIsExpanded(false);
  };

  const priorityColors = {
    none: 'border-neutral-200 dark:border-neutral-700 text-neutral-500',
    low: 'border-blue-300 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40',
    medium: 'border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/40',
    high: 'border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/40',
  };

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm transition-all focus-within:ring-2 focus-within:ring-neutral-900/10 dark:focus-within:ring-neutral-100/10 focus-within:border-neutral-400 dark:focus-within:border-neutral-600">
      <form onSubmit={handleSubmit} className="p-3 sm:p-4">
        {/* Main Input Row */}
        <div className="flex items-center gap-3">
          <div className="text-neutral-400 dark:text-neutral-500">
            <Plus className="w-5 h-5" />
          </div>
          <input
            id="input-quick-add-task"
            ref={activeInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={title}
            onChange={handleInputChange}
            placeholder="Add a new task... (e.g. Finish report !high #Work @today)"
            className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              id="btn-toggle-task-details"
              onClick={() => setIsExpanded(!isExpanded)}
              title="Toggle full details (Notes, Subtasks, Pomodoro)"
              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                isExpanded || notes || subtasks.length > 0 || dueDate
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-submit-quick-add"
              type="submit"
              disabled={!title.trim()}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <span>Add</span>
              <kbd className="hidden sm:inline-block text-[10px] opacity-70 bg-white/20 dark:bg-neutral-900/20 px-1 rounded">↵</kbd>
            </button>
          </div>
        </div>

        {/* Quick Toolbar (Always visible or compact) */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/60 flex flex-wrap items-center gap-2 text-xs">
          
          {/* Priority selector */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const order: Priority[] = ['none', 'low', 'medium', 'high'];
                const nextIdx = (order.indexOf(priority) + 1) % order.length;
                setPriority(order[nextIdx]);
              }}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-colors ${priorityColors[priority]}`}
              title="Click to cycle priority (!high, !med, !low)"
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="capitalize">{priority === 'none' ? 'Priority' : priority}</span>
            </button>
          </div>

          {/* Due date fast chips */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setDueDate(dueDate === getTodayDateString() ? '' : getTodayDateString())}
              className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                dueDate === getTodayDateString()
                  ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              <Calendar className="w-3 h-3 inline mr-1" />
              Today
            </button>
            <button
              type="button"
              onClick={() => setDueDate(dueDate === getTomorrowDateString() ? '' : getTomorrowDateString())}
              className={`px-2 py-1 rounded-md border text-xs font-medium transition-colors ${
                dueDate === getTomorrowDateString()
                  ? 'border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
              }`}
            >
              Tomorrow
            </button>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-md px-1.5 py-0.5 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
            />
          </div>

          {/* Category / Tag selector */}
          <div className="flex items-center gap-1 ml-auto">
            <Tag className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-700 dark:text-neutral-300 focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="dark:bg-neutral-900">
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Expanded Details drawer (Notes, Subtasks, Pomodoros) */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3">
            {/* Notes textarea */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1">
                Notes & Context
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add markdown notes, links, or context..."
                rows={2}
                className="w-full bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-lg p-2.5 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600"
              />
            </div>

            {/* Subtasks checklist */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Subtasks ({subtasks.length})
                </label>
              </div>

              {/* Subtask list */}
              {subtasks.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-200/70 dark:border-neutral-800/70 rounded-md text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-neutral-400" />
                        <span className="text-neutral-800 dark:text-neutral-200">{sub.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(sub.id)}
                        className="text-neutral-400 hover:text-rose-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add subtask input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a step or subtask (press Enter)..."
                  className="flex-1 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-md px-2.5 py-1 text-xs text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskTitle.trim()}
                  className="px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium disabled:opacity-40"
                >
                  Add Step
                </button>
              </div>
            </div>

            {/* Pomodoro target estimation */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <Timer className="w-3.5 h-3.5 text-amber-500" />
                <span>Estimated Pomodoro Sessions (25m each):</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setEstimatedPoms(count)}
                    className={`w-6 h-6 rounded-md text-xs font-medium transition-colors ${
                      estimatedPoms === count
                        ? 'bg-amber-500 text-white font-bold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

      </form>
    </div>
  );
};
