export type Priority = 'none' | 'low' | 'medium' | 'high';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string; // e.g. 'General', 'Work', 'Personal', 'Projects', 'Study'
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM
  notes?: string;
  subtasks: SubTask[];
  createdAt: number;
  completedAt?: number;
  estimatedPoms?: number;
  completedPoms?: number;
  pinned?: boolean;
}

export type FilterView = 'inbox' | 'today' | 'upcoming' | 'completed' | 'high-priority' | 'all';

export type SortOption = 'order' | 'dueDate' | 'priority' | 'title' | 'createdAt';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ProductivityStats {
  completedToday: number;
  totalActive: number;
  totalCompleted: number;
  streakDays: number;
  pomsCompletedToday: number;
}
