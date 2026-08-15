import React, { useState } from 'react';
import { 
  Check, 
  Flag, 
  Calendar, 
  Clock, 
  Pin, 
  MoreVertical, 
  Trash2, 
  Copy, 
  Edit3, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Timer, 
  AlignLeft,
  X,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TodoItem, Priority, SubTask } from '../types';
import { formatDueDate } from '../utils/date';

interface TodoItemCardProps {
  todo: TodoItem;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TodoItem>) => void;
  onDuplicate: (todo: TodoItem) => void;
  onStartFocus: (todo: TodoItem) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  selectionMode?: boolean;
}

export const TodoItemCard: React.FC<TodoItemCardProps> = ({
  todo,
  onToggleComplete,
  onDelete,
  onUpdate,
  onDuplicate,
  onStartFocus,
  isSelected = false,
  onToggleSelect,
  selectionMode = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editNotes, setEditNotes] = useState(todo.notes || '');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');

  const dueDateInfo = formatDueDate(todo.dueDate, todo.dueTime);

  const completedSubtasksCount = todo.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = todo.subtasks.length;

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      onUpdate(todo.id, {
        title: editTitle.trim(),
        notes: editNotes.trim() || undefined,
      });
    }
    setIsEditing(false);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const newSub: SubTask = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      title: newSubtask.trim(),
      completed: false,
    };
    onUpdate(todo.id, { subtasks: [...todo.subtasks, newSub] });
    setNewSubtask('');
    if (!isExpanded) setIsExpanded(true);
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    const updatedSubtasks = todo.subtasks.filter((s) => s.id !== subtaskId);
    onUpdate(todo.id, { subtasks: updatedSubtasks });
  };

  const priorityStyles: Record<Priority, { label: string; badge: string; dot: string }> = {
    high: {
      label: 'High',
      badge: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80',
      dot: 'bg-rose-500',
    },
    medium: {
      label: 'Medium',
      badge: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80',
      dot: 'bg-amber-500',
    },
    low: {
      label: 'Low',
      badge: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/80',
      dot: 'bg-blue-400',
    },
    none: {
      label: '',
      badge: '',
      dot: 'bg-transparent',
    },
  };

  const dueDateBadgeColor = {
    overdue: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
    today: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    tomorrow: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
    upcoming: 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
    none: '',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className={`group relative w-full bg-white dark:bg-neutral-900 border rounded-xl transition-all shadow-xs ${
        isSelected
          ? 'border-neutral-900 dark:border-neutral-100 ring-1 ring-neutral-900 dark:ring-neutral-100'
          : todo.completed
          ? 'border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-950/40 opacity-70'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm'
      }`}
    >
      {/* Pinned bookmark ribbon */}
      {todo.pinned && (
        <div className="absolute -top-1.5 right-3 text-amber-500 z-10" title="Pinned task">
          <Pin className="w-3.5 h-3.5 fill-amber-500" />
        </div>
      )}

      {/* Main Task Row */}
      <div className="p-3 sm:p-4 flex items-start gap-3">
        {/* Selection Checkbox (when in multi-select mode) */}
        {selectionMode && onToggleSelect && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(todo.id)}
            className="mt-1 w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
        )}

        {/* Custom Animated Complete Checkbox */}
        <button
          id={`btn-toggle-complete-${todo.id}`}
          onClick={() => onToggleComplete(todo.id)}
          aria-label={todo.completed ? 'Mark uncompleted' : 'Mark completed'}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
            todo.completed
              ? 'bg-neutral-900 border-neutral-900 dark:bg-neutral-100 dark:border-neutral-100 text-white dark:text-neutral-900'
              : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-400 bg-transparent'
          }`}
        >
          {todo.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                autoFocus
                className="w-full text-sm font-medium bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-1 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Edit notes or details..."
                rows={2}
                className="w-full text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded p-2 text-neutral-900 dark:text-neutral-100 focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-2.5 py-1 text-xs font-semibold bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-2.5 py-1 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Task Title */}
              <div className="flex items-start justify-between gap-2">
                <span
                  onDoubleClick={() => setIsEditing(true)}
                  className={`text-sm sm:text-base font-medium break-words select-text transition-all leading-snug ${
                    todo.completed
                      ? 'line-through text-neutral-400 dark:text-neutral-500'
                      : 'text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {todo.title}
                </span>
              </div>

              {/* Badges & Meta Row */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {/* Category Pill */}
                {todo.category && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60">
                    #{todo.category}
                  </span>
                )}

                {/* Priority Badge */}
                {todo.priority !== 'none' && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priorityStyles[todo.priority].badge}`}
                  >
                    <Flag className="w-3 h-3" />
                    <span>{priorityStyles[todo.priority].label}</span>
                  </span>
                )}

                {/* Due date badge */}
                {dueDateInfo.status !== 'none' && (
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${dueDateBadgeColor[dueDateInfo.status]}`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>{dueDateInfo.text}</span>
                  </span>
                )}

                {/* Subtask progress count badge */}
                {totalSubtasks > 0 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200/60 dark:border-neutral-700/60 transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    <span>
                      {completedSubtasksCount}/{totalSubtasks} subtasks
                    </span>
                  </button>
                )}

                {/* Pomodoro indicator */}
                {todo.estimatedPoms && todo.estimatedPoms > 0 ? (
                  <div
                    className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-mono"
                    title={`${todo.completedPoms || 0}/${todo.estimatedPoms} pomodoro sessions completed`}
                  >
                    <Timer className="w-3 h-3" />
                    <span>{todo.completedPoms || 0}/{todo.estimatedPoms}</span>
                  </div>
                ) : null}

                {/* Notes indicator (if not expanded) */}
                {todo.notes && !isExpanded && (
                  <button
                    onClick={() => setIsExpanded(true)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    title="View notes"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hover / Actions Toolbar */}
        {!isEditing && (
          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Start Focus Mode Button */}
            {!todo.completed && (
              <button
                id={`btn-focus-${todo.id}`}
                onClick={() => onStartFocus(todo)}
                title="Start Zen Focus Pomodoro for this task"
                className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-colors"
              >
                <Timer className="w-4 h-4" />
              </button>
            )}

            {/* Quick Edit */}
            <button
              onClick={() => setIsEditing(true)}
              title="Edit task"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* Pin / Unpin */}
            <button
              onClick={() => onUpdate(todo.id, { pinned: !todo.pinned })}
              title={todo.pinned ? 'Unpin task' : 'Pin to top'}
              className={`p-1.5 rounded-lg transition-colors ${
                todo.pinned
                  ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  : 'text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Pin className={`w-3.5 h-3.5 ${todo.pinned ? 'fill-amber-500' : ''}`} />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(todo.id)}
              title="Delete task"
              className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Expandable Section: Notes & Subtasks Checklist */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 sm:px-4 pb-3 pt-1 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2.5 overflow-hidden"
          >
            {/* Notes preview / content */}
            {todo.notes && (
              <div className="bg-neutral-50 dark:bg-neutral-950/50 p-2.5 rounded-lg border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap leading-relaxed">
                {todo.notes}
              </div>
            )}

            {/* Subtasks items */}
            <div className="space-y-1.5 pl-6">
              {todo.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between group/sub text-xs py-0.5"
                >
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                      className="w-3.5 h-3.5 rounded border-neutral-300 text-neutral-900 dark:text-neutral-100 focus:ring-neutral-900"
                    />
                    <span
                      className={
                        sub.completed
                          ? 'line-through text-neutral-400 dark:text-neutral-500'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }
                    >
                      {sub.title}
                    </span>
                  </label>
                  <button
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="opacity-0 group-hover/sub:opacity-100 text-neutral-400 hover:text-rose-500 p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {/* Add subtask inline input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                  placeholder="Add a step... (press Enter)"
                  className="flex-1 text-xs bg-transparent border-b border-neutral-200 dark:border-neutral-800 py-1 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-500"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtask.trim()}
                  className="text-xs font-semibold text-neutral-600 dark:text-neutral-300 disabled:opacity-30"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
