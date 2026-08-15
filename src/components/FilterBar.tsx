import React from 'react';
import { 
  Inbox, 
  Sun, 
  Calendar, 
  CheckCircle2, 
  Flag, 
  ListFilter, 
  Search, 
  ArrowUpDown,
  Tag,
  X,
  Layers
} from 'lucide-react';
import { FilterView, SortOption } from '../types';

interface FilterBarProps {
  activeView: FilterView;
  onViewChange: (view: FilterView) => void;
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  counts: {
    inbox: number;
    today: number;
    upcoming: number;
    highPriority: number;
    completed: number;
    all: number;
  };
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeView,
  onViewChange,
  activeCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  counts,
  searchInputRef,
}) => {
  const views: { id: FilterView; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-3.5 h-3.5" />, count: counts.inbox },
    { id: 'today', label: 'Today', icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, count: counts.today },
    { id: 'upcoming', label: 'Upcoming', icon: <Calendar className="w-3.5 h-3.5 text-indigo-500" />, count: counts.upcoming },
    { id: 'high-priority', label: 'High Priority', icon: <Flag className="w-3.5 h-3.5 text-rose-500" />, count: counts.highPriority },
    { id: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />, count: counts.completed },
    { id: 'all', label: 'All Tasks', icon: <Layers className="w-3.5 h-3.5 text-neutral-400" />, count: counts.all },
  ];

  return (
    <div className="w-full space-y-3 pt-2">
      {/* Top Controls: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search input with shortcut badge */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500" />
          <input
            id="input-search-tasks"
            ref={searchInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, notes, subtasks..."
            className="w-full pl-9 pr-14 py-2 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all shadow-xs"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-200/60 dark:border-neutral-700/60 font-mono">
              ⌘K
            </div>
          )}
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-lg shadow-xs">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sort:</span>
            <select
              id="select-sort-tasks"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-neutral-800 dark:text-neutral-200 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="order" className="dark:bg-neutral-900">Custom Order</option>
              <option value="dueDate" className="dark:bg-neutral-900">Due Date</option>
              <option value="priority" className="dark:bg-neutral-900">Priority (High to Low)</option>
              <option value="title" className="dark:bg-neutral-900">Alphabetical</option>
              <option value="createdAt" className="dark:bg-neutral-900">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main View Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 pt-1">
        {views.map((v) => {
          const isActive = activeView === v.id;
          return (
            <button
              key={v.id}
              id={`filter-view-${v.id}`}
              onClick={() => onViewChange(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all select-none ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs'
                  : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800'
              }`}
            >
              {v.icon}
              <span>{v.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-white/20 dark:bg-neutral-900/20 text-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}
              >
                {v.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Tags Horizontal Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5 text-xs">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider pl-1">
            Tags:
          </span>
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors ${
              activeCategory === null
                ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            All Tags
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(activeCategory === cat ? null : cat)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
              }`}
            >
              <span>#{cat}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
