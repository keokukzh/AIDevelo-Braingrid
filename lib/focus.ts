import type { Progress } from '@/lib/db/types';
import { topics } from '@/lib/constants/topics';

/**
 * Calculate focus score based on completed progress
 */
export function calculateFocus(progress: Progress[]): number {
  const totalSubtopics = topics.reduce(
    (sum, topic) => sum + topic.subtopics.length,
    0
  );
  
  const completedCount = progress.filter((p) => p.completed).length;
  
  if (totalSubtopics === 0) return 0;
  
  return Math.round((completedCount / totalSubtopics) * 100);
}

