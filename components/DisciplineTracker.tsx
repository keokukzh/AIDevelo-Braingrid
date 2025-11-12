'use client';

import { calculateStreak, calculateConsistency } from '@/lib/discipline';
import type { Progress } from '@/lib/db/types';

interface DisciplineTrackerProps {
  progress: Progress[];
  accountCreatedAt?: string;
}

export default function DisciplineTracker({
  progress,
  accountCreatedAt,
}: DisciplineTrackerProps) {
  const streak = calculateStreak(progress);
  const consistency = accountCreatedAt
    ? calculateConsistency(progress, accountCreatedAt)
    : 0;

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Discipline Tracker</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">🔥</span>
            <span className="text-2xl font-bold">{streak}</span>
            <span className="text-text-secondary">day streak</span>
          </div>
          {streak === 0 && (
            <p className="text-sm text-text-secondary">
              Start your learning journey today!
            </p>
          )}
          {streak > 0 && streak < 7 && (
            <p className="text-sm text-text-secondary">
              Keep it up! You&apos;re building momentum.
            </p>
          )}
          {streak >= 7 && (
            <p className="text-sm text-success">Amazing! You&apos;re on fire! 🔥</p>
          )}
        </div>
        {accountCreatedAt && (
          <div>
            <div className="text-sm text-text-secondary mb-1">Consistency</div>
            <div className="text-2xl font-bold">{consistency}%</div>
          </div>
        )}
      </div>
    </div>
  );
}

