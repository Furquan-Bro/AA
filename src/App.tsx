import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  TodoItem, 
  FilterView, 
  SortOption, 
  ThemeMode, 
  ProductivityStats, 
  Priority 
} from './types';
import { loadTodos, saveTodos, loadTheme, saveTheme } from './utils/storage';
import { soundEffects } from './utils/audio';
import { isTaskDueToday, isTaskOverdue, getTodayDateString } from './utils/date';
import { Navbar } from './components/Navbar';
import { QuickAdd } from './components/QuickAdd';
import { FilterBar } from './components/FilterBar';
import { TodoList } from './components/TodoList';
import { FocusModal } from './components/FocusModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { BatchActionsBar } from './components/BatchActionsBar';

export default function App() {
  const [todos, setTodos] = useState<TodoItem[]>(() => loadTodos());
  const [theme, setTheme] = useState<ThemeMode>(() => loadTheme());
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Navigation & Filtering
  const [activeView, setActiveView] = useState<FilterView>('inbox');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('order');
  
  // Selection Mode
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Focus
  const [focusTask, setFocusTask] = useState<TodoItem | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  // Element Refs for keyboard triggers
  const quickAddInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync todos to localStorage
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  // Apply Theme
  useEffect(() => {
    saveTheme(theme);
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Listen to system theme changes if in 'system' mode
  useEffect(() => {
    if (theme !== 'system') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (mediaQuery.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Sync sound setting
  useEffect(() => {
    soundEffects.setSoundEnabled(soundEnabled);
  }, [soundEnabled]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd+K or Ctrl+K for search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Escape key closes modals, blurs inputs, deselects
      if (e.key === 'Escape') {
        if (focusTask) setFocusTask(null);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isDeployGuideOpen) setIsDeployGuideOpen(false);
        if (selectionMode) {
          setSelectionMode(false);
          setSelectedIds([]);
        }
        if (isInput) {
          target.blur();
        }
        return;
      }

      if (isInput) return;

      // Single-key shortcuts
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        quickAddInputRef.current?.focus();
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setTheme((prev) => (prev === 'dark' ? 'light' : prev === 'light' ? 'system' : 'dark'));
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusTask, isShortcutsOpen, isDeployGuideOpen, selectionMode]);

  // Categories extraction
  const categories = useMemo(() => {
    const defaultCats = ['Work', 'Personal', 'Projects', 'Study', 'General'];
    const customCats = todos.map((t) => t.category).filter(Boolean);
    return Array.from(new Set([...defaultCats, ...customCats]));
  }, [todos]);

  // Productivity Stats
  const stats: ProductivityStats = useMemo(() => {
    const todayStr = getTodayDateString();
    let completedToday = 0;
    let totalActive = 0;
    let totalCompleted = 0;
    let pomsToday = 0;

    todos.forEach((t) => {
      if (t.completed) {
        totalCompleted++;
        if (t.completedAt) {
          const completedDateStr = new Date(t.completedAt).toISOString().split('T')[0];
          if (completedDateStr === todayStr) {
            completedToday++;
          }
        } else {
          completedToday++;
        }
      } else {
        totalActive++;
      }
      pomsToday += t.completedPoms || 0;
    });

    return {
      completedToday,
      totalActive,
      totalCompleted,
      streakDays: completedToday > 0 ? 3 : 1,
      pomsCompletedToday: pomsToday,
    };
  }, [todos]);

  // Filter counts
  const counts = useMemo(() => {
    let inbox = 0;
    let today = 0;
    let upcoming = 0;
    let highPriority = 0;
    let completed = 0;

    todos.forEach((t) => {
      if (t.completed) {
        completed++;
      } else {
        inbox++;
        if (isTaskDueToday(t.dueDate) || isTaskOverdue(t.dueDate)) {
          today++;
        }
        if (t.dueDate && !isTaskDueToday(t.dueDate) && !isTaskOverdue(t.dueDate)) {
          upcoming++;
        }
        if (t.priority === 'high') {
          highPriority++;
        }
      }
    });

    return {
      inbox,
      today,
      upcoming,
      highPriority,
      completed,
      all: todos.length,
    };
  }, [todos]);

  // Filtered and Sorted Todos
  const filteredTodos = useMemo(() => {
    let list = [...todos];

    // 1. View Filter
    if (activeView === 'inbox') {
      list = list.filter((t) => !t.completed);
    } else if (activeView === 'today') {
      list = list.filter(
        (t) => !t.completed && (isTaskDueToday(t.dueDate) || isTaskOverdue(t.dueDate))
      );
    } else if (activeView === 'upcoming') {
      list = list.filter(
        (t) => !t.completed && t.dueDate && !isTaskDueToday(t.dueDate) && !isTaskOverdue(t.dueDate)
      );
    } else if (activeView === 'high-priority') {
      list = list.filter((t) => !t.completed && t.priority === 'high');
    } else if (activeView === 'completed') {
      list = list.filter((t) => t.completed);
    }

    // 2. Category Tag Filter
    if (activeCategory) {
      list = list.filter((t) => t.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // 3. Search Query Filter (Title, Notes, Subtasks, Category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((t) => {
        const titleMatch = t.title.toLowerCase().includes(q);
        const notesMatch = t.notes?.toLowerCase().includes(q);
        const catMatch = t.category?.toLowerCase().includes(q);
        const subMatch = t.subtasks.some((s) => s.title.toLowerCase().includes(q));
        return titleMatch || notesMatch || catMatch || subMatch;
      });
    }

    // 4. Sorting
    const priorityWeight: Record<Priority, number> = {
      high: 3,
      medium: 2,
      low: 1,
      none: 0,
    };

    list.sort((a, b) => {
      // Pinned tasks always stay top for active tasks
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      if (sortOption === 'priority') {
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      } else if (sortOption === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      } else if (sortOption === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortOption === 'createdAt') {
        return b.createdAt - a.createdAt;
      }

      // Default order: uncompleted first, then newer
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return b.createdAt - a.createdAt;
    });

    return list;
  }, [todos, activeView, activeCategory, searchQuery, sortOption]);

  // Handlers
  const handleAddTodo = (newTodoData: Omit<TodoItem, 'id' | 'createdAt' | 'completed'>) => {
    const newTodo: TodoItem = {
      ...newTodoData,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now(),
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleToggleComplete = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const willBeCompleted = !t.completed;
          if (willBeCompleted) {
            soundEffects.playComplete();
            // Subtle celebratory confetti
            try {
              confetti({
                particleCount: 35,
                spread: 60,
                origin: { y: 0.8 },
                colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'],
                ticks: 120,
              });
            } catch {
              // ignore
            }
          }
          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted ? Date.now() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    setSelectedIds((prev) => prev.filter((selId) => selId !== id));
  };

  const handleUpdate = (id: string, updates: Partial<TodoItem>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleDuplicate = (todo: TodoItem) => {
    const duplicated: TodoItem = {
      ...todo,
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      title: `${todo.title} (Copy)`,
      createdAt: Date.now(),
      completed: false,
      completedAt: undefined,
    };
    setTodos((prev) => [duplicated, ...prev]);
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleIncrementPoms = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completedPoms: (t.completedPoms || 0) + 1 } : t))
    );
  }, []);

  // Batch actions
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchComplete = () => {
    setTodos((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, completed: true, completedAt: Date.now() } : t))
    );
    soundEffects.playComplete();
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const handleBatchDelete = () => {
    setTodos((prev) => prev.filter((t) => !selectedIds.includes(t.id)));
    setSelectedIds([]);
    setSelectionMode(false);
  };

  const handleBatchPriority = (priority: Priority) => {
    setTodos((prev) =>
      prev.map((t) => (selectedIds.includes(t.id) ? { ...t, priority } : t))
    );
    setSelectedIds([]);
    setSelectionMode(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        stats={stats}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Quick Add Bar */}
        <QuickAdd
          onAddTodo={handleAddTodo}
          categories={categories}
          inputRef={quickAddInputRef}
        />

        {/* Filters, Search & Categories */}
        <FilterBar
          activeView={activeView}
          onViewChange={setActiveView}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          counts={counts}
          searchInputRef={searchInputRef}
        />

        {/* Task List */}
        <TodoList
          todos={filteredTodos}
          activeView={activeView}
          searchQuery={searchQuery}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onDuplicate={handleDuplicate}
          onStartFocus={(task) => setFocusTask(task)}
          onClearCompleted={handleClearCompleted}
          onResetFilters={() => {
            setSearchQuery('');
            setActiveCategory(null);
            setActiveView('inbox');
          }}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          selectionMode={selectionMode}
          onToggleSelectionMode={() => {
            setSelectionMode(!selectionMode);
            setSelectedIds([]);
          }}
        />

      </main>

      {/* Floating Batch Actions Bar */}
      <BatchActionsBar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onBatchComplete={handleBatchComplete}
        onBatchDelete={handleBatchDelete}
        onBatchPriority={handleBatchPriority}
      />

      {/* Zen Focus Pomodoro Modal */}
      <FocusModal
        task={focusTask}
        isOpen={Boolean(focusTask)}
        onClose={() => setFocusTask(null)}
        onCompleteTask={handleToggleComplete}
        onIncrementPoms={handleIncrementPoms}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* GitHub & Vercel Deploy Guide Modal */}
      <DeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />

      {/* Minimalist Footer */}
      <footer className="w-full border-t border-neutral-200/60 dark:border-neutral-800/60 py-4 text-center text-xs text-neutral-400 dark:text-neutral-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Minimalist Productivity Todo &bull; Designed for Deep Focus</span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Shortcuts [?]
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Deploy Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
