export function formatDueDate(dateStr?: string, timeStr?: string): { text: string; status: 'overdue' | 'today' | 'tomorrow' | 'upcoming' | 'none' } {
  if (!dateStr) return { text: '', status: 'none' };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dateStr.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const timeDisplay = timeStr ? ` at ${timeStr}` : '';

  if (diffDays < 0) {
    if (diffDays === -1) {
      return { text: `Yesterday${timeDisplay}`, status: 'overdue' };
    }
    return { text: `${Math.abs(diffDays)}d overdue${timeDisplay}`, status: 'overdue' };
  } else if (diffDays === 0) {
    return { text: `Today${timeDisplay}`, status: 'today' };
  } else if (diffDays === 1) {
    return { text: `Tomorrow${timeDisplay}`, status: 'tomorrow' };
  } else if (diffDays < 7) {
    const weekday = targetDate.toLocaleDateString('en-US', { weekday: 'short' });
    return { text: `${weekday}${timeDisplay}`, status: 'upcoming' };
  } else {
    const formatted = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { text: `${formatted}${timeDisplay}`, status: 'upcoming' };
  }
}

export function isTaskDueToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
}

export function isTaskOverdue(dateStr?: string, completed?: boolean): boolean {
  if (!dateStr || completed) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTomorrowDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}
