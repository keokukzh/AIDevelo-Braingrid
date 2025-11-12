'use client';

import ProgressBar from './ProgressBar';
import { calculateFocus } from '@/lib/focus';
import type { Progress } from '@/lib/db/types';
import { topics } from '@/lib/constants/topics';

interface FocusMeterProps {
  progress: Progress[];
}

export default function FocusMeter({ progress }: FocusMeterProps) {
  const focusScore = calculateFocus(progress);
  const totalSubtopics = topics.reduce(
    (sum, topic) => sum + topic.subtopics.length,
    0
  );
  const completedCount = progress.filter((p) => p.completed).length;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Focus Meter</h3>
      <ProgressBar value={focusScore} label="Overall Progress" />
      <div className="mt-4 text-sm text-text-secondary">
        {completedCount} of {totalSubtopics} topics completed
      </div>
    </div>
  );
}

