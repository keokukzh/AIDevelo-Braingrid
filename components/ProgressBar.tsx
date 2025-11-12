'use client';

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({
  value,
  label,
  showPercentage = true,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value));
  
  let colorClass = 'bg-success';
  if (clampedValue < 33) {
    colorClass = 'bg-error';
  } else if (clampedValue < 67) {
    colorClass = 'bg-warning';
  }

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{label}</span>
          {showPercentage && (
            <span className="text-sm text-text-secondary">{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}
      <div
        className="w-full h-3 bg-background rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`h-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

