import type { Progress, Note } from '@/lib/db/types';

/**
 * Calculate current streak (consecutive days with progress)
 */
export function calculateStreak(progress: Progress[]): number {
  if (progress.length === 0) return 0;

  // Get unique dates when progress was made
  const dates = progress
    .map((p) => new Date(p.updated_at).toDateString())
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse();

  if (dates.length === 0) return 0;

  // Check consecutive days starting from today
  const today = new Date().toDateString();
  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(currentDate);
    checkDate.setDate(checkDate.getDate() - i);
    const checkDateStr = checkDate.toDateString();

    if (dates.includes(checkDateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate consistency percentage (days active / total days)
 */
export function calculateConsistency(
  progress: Progress[],
  accountCreatedAt: string
): number {
  if (progress.length === 0) return 0;

  const createdDate = new Date(accountCreatedAt);
  const today = new Date();
  const totalDays = Math.ceil(
    (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (totalDays === 0) return 0;

  const uniqueDates = new Set(
    progress.map((p) => new Date(p.updated_at).toDateString())
  );

  return Math.round((uniqueDates.size / totalDays) * 100);
}

