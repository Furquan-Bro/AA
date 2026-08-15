import { TodoItem, ThemeMode } from '../types';

const STORAGE_KEY = 'minimalist_todo_tasks_v1';
const THEME_KEY = 'minimalist_todo_theme_v1';
const STATS_KEY = 'minimalist_todo_stats_v1';

const getTodayString = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'demo-1',
    title: 'Welcome to your minimalist productivity workspace',
    completed: false,
    priority: 'high',
    category: 'Work',
    dueDate: getTodayString(0),
    dueTime: '10:00',
    notes: 'A keyboard-first todo app crafted for speed, focus, and clarity.',
    subtasks: [
      { id: 'sub-1', title: 'Press [N] to quick-add a new task', completed: false },
      { id: 'sub-2', title: 'Press [Cmd/Ctrl + K] to search or command palette', completed: false },
      { id: 'sub-3', title: 'Press [D] or click moon icon for dark mode', completed: false },
    ],
    createdAt: Date.now() - 3600000 * 5,
    estimatedPoms: 2,
    completedPoms: 1,
    pinned: true,
  },
  {
    id: 'demo-2',
    title: 'Review weekly strategic goals and quarterly targets',
    completed: false,
    priority: 'medium',
    category: 'Projects',
    dueDate: getTodayString(0),
    notes: 'Prioritize top 3 high-impact deliverables for the sprint.',
    subtasks: [],
    createdAt: Date.now() - 3600000 * 3,
    estimatedPoms: 1,
    completedPoms: 0,
  },
  {
    id: 'demo-3',
    title: 'Complete 25-minute deep work session (Pomodoro timer)',
    completed: false,
    priority: 'high',
    category: 'General',
    dueDate: getTodayString(0),
    notes: 'Click the timer icon on any task to enter distraction-free Zen Focus mode.',
    subtasks: [],
    createdAt: Date.now() - 3600000 * 2,
    estimatedPoms: 1,
    completedPoms: 0,
  },
  {
    id: 'demo-4',
    title: '30-minute evening walk & hydration check',
    completed: false,
    priority: 'low',
    category: 'Personal',
    dueDate: getTodayString(0),
    notes: 'Stay refreshed and clear mental clutter.',
    subtasks: [],
    createdAt: Date.now() - 3600000,
    estimatedPoms: 1,
    completedPoms: 0,
  },
  {
    id: 'demo-5',
    title: 'Setup repository and project dependencies',
    completed: true,
    priority: 'medium',
    category: 'Work',
    dueDate: getTodayString(-1),
    subtasks: [],
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 43200000,
  },
];

export function loadTodos(): TodoItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to load todos from localStorage', e);
  }
  return INITIAL_TODOS;
}

export function saveTodos(todos: TodoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (e) {
    console.error('Failed to save todos to localStorage', e);
  }
}

export function loadTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') {
      return saved;
    }
  } catch {
    // fallback
  }
  return 'dark'; // Dark mode default or elegant auto
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme', e);
  }
}
