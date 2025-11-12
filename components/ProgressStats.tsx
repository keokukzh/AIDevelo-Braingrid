'use client';

import ProgressBar from './ProgressBar';

interface ProgressStatsProps {
  total: number;
  completed: number;
  percentage: number;
  streak: number;
}

export default function ProgressStats({
  total,
  completed,
  percentage,
  streak,
}: ProgressStatsProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Progress Statistics</h3>
      <div className="space-y-4">
        <ProgressBar value={percentage} label="Overall Completion" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-text-secondary mb-1">Total Items</div>
            <div className="text-2xl font-bold">{total}</div>
          </div>
          <div>
            <div className="text-sm text-text-secondary mb-1">Completed</div>
            <div className="text-2xl font-bold text-success">{completed}</div>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="text-sm text-text-secondary">Current Streak</div>
              <div className="text-xl font-bold">{streak} days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

