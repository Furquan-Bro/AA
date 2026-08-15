import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Inbox, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Layers,
  FilterX
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TodoItem, FilterView } from '../types';
import { TodoItemCard } from './TodoItemCard';

interface TodoListProps {
  todos: TodoItem[];
  activeView: FilterView;
  searchQuery: string;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<TodoItem>) => void;
  onDuplicate: (todo: TodoItem) => void;
  onStartFocus: (todo: TodoItem) => void;
  onClearCompleted: () => void;
  onResetFilters: () => void;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  selectionMode: boolean;
  onToggleSelectionMode: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  activeView,
  searchQuery,
  onToggleComplete,
  onDelete,
  onUpdate,
  onDuplicate,
  onStartFocus,
  onClearCompleted,
  onResetFilters,
  selectedIds,
  onToggleSelect,
  selectionMode,
  onToggleSelectionMode,
}) => {
  const [showCompletedSection, setShowCompletedSection] = React.useState(true);

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const pinnedActiveTodos = activeTodos.filter((t) => t.pinned);
  const regularActiveTodos = activeTodos.filter((t) => !t.pinned);

  if (todos.length === 0) {
    return (
      <div className="w-full py-16 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center text-neutral-400 dark:text-neutral-500 mb-3 border border-neutral-200/50 dark:border-neutral-700/50">
          {searchQuery ? <FilterX className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
        </div>
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
          {searchQuery ? 'No matching tasks found' : 'All clear. You’re in deep flow.'}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mt-1">
          {searchQuery
            ? `No tasks match "${searchQuery}". Try a different keyword or reset filters.`
            : 'No tasks left in this view. Press [N] or add a new task above to get started.'}
        </p>
        {searchQuery && (
          <button
            onClick={onResetFilters}
            className="mt-3 text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline hover:opacity-80"
          >
            Clear search & filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Top selection bar toggle */}
      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 px-1">
        <div className="flex items-center gap-2">
          <span>
            {activeTodos.length} active {activeTodos.length === 1 ? 'task' : 'tasks'}
          </span>
          {completedTodos.length > 0 && (
            <>
              <span>&bull;</span>
              <span>{completedTodos.length} completed</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSelectionMode}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            {selectionMode ? 'Done selecting' : 'Select'}
          </button>
          {completedTodos.length > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Clear completed
            </button>
          )}
        </div>
      </div>

      {/* Pinned Tasks Section (if any) */}
      {pinnedActiveTodos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 px-1">
            <span>Pinned Focus</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {pinnedActiveTodos.map((todo) => (
                <TodoItemCard
                  key={todo.id}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onDuplicate={onDuplicate}
                  onStartFocus={onStartFocus}
                  isSelected={selectedIds.includes(todo.id)}
                  onToggleSelect={onToggleSelect}
                  selectionMode={selectionMode}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Regular Active Tasks */}
      <div className="space-y-2">
        {pinnedActiveTodos.length > 0 && regularActiveTodos.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-1 pt-1">
            <span>Tasks</span>
          </div>
        )}
        <AnimatePresence initial={false}>
          {regularActiveTodos.map((todo) => (
            <TodoItemCard
              key={todo.id}
              todo={todo}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onDuplicate={onDuplicate}
              onStartFocus={onStartFocus}
              isSelected={selectedIds.includes(todo.id)}
              onToggleSelect={onToggleSelect}
              selectionMode={selectionMode}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Completed Tasks Section (collapsible) */}
      {completedTodos.length > 0 && activeView !== 'completed' && (
        <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60">
          <button
            onClick={() => setShowCompletedSection(!showCompletedSection)}
            className="flex items-center justify-between w-full py-1.5 px-1 text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              {showCompletedSection ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>Completed ({completedTodos.length})</span>
            </div>
            <span className="text-[11px] text-neutral-400 font-normal">
              {showCompletedSection ? 'Hide' : 'Show'}
            </span>
          </button>

          <AnimatePresence>
            {showCompletedSection && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-2 mt-2"
              >
                {completedTodos.map((todo) => (
                  <TodoItemCard
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onUpdate={onUpdate}
                    onDuplicate={onDuplicate}
                    onStartFocus={onStartFocus}
                    isSelected={selectedIds.includes(todo.id)}
                    onToggleSelect={onToggleSelect}
                    selectionMode={selectionMode}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* In 'completed' view, just render all completed items directly */}
      {activeView === 'completed' && (
        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {completedTodos.map((todo) => (
              <TodoItemCard
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onDuplicate={onDuplicate}
                onStartFocus={onStartFocus}
                isSelected={selectedIds.includes(todo.id)}
                onToggleSelect={onToggleSelect}
                selectionMode={selectionMode}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
