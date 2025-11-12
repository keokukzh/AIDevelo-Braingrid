'use client';

import { useState, useEffect } from 'react';
import { saveProgress } from '@/lib/actions/progress';
import TopicCard from './TopicCard';
import type { Topic } from '@/lib/constants/topics';

interface DashboardClientProps {
  topic: Topic;
  initialProgress: Record<string, boolean>;
}

export default function DashboardClient({
  topic,
  initialProgress,
}: DashboardClientProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>(
    initialProgress
  );

  const handleProgressChange = async (
    subtopicId: string,
    completed: boolean
  ) => {
    // Optimistic update
    setProgress((prev) => ({
      ...prev,
      [subtopicId]: completed,
    }));

    // Save to server
    const result = await saveProgress(subtopicId, completed);
    if (!result.success) {
      // Revert on error
      setProgress((prev) => ({
        ...prev,
        [subtopicId]: !completed,
      }));
      console.error('Failed to save progress:', result.error);
    }
  };

  return (
    <TopicCard
      topic={topic}
      progress={progress}
      onProgressChange={handleProgressChange}
    />
  );
}

