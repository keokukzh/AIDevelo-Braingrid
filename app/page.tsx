import { requireAuth } from '@/lib/auth/session';
import { fetchProgress } from '@/lib/actions/progress';
import Sidebar from '@/components/Sidebar';
import TopicCard from '@/components/TopicCard';
import RAGPanel from '@/components/RAGPanel';
import FocusMeter from '@/components/FocusMeter';
import DisciplineTracker from '@/components/DisciplineTracker';
import DailyWin from '@/components/DailyWin';
import { topics } from '@/lib/constants/topics';
import DashboardClient from '@/components/DashboardClient';

export default async function DashboardPage() {
  await requireAuth();
  
  const progressResult = await fetchProgress();
  const progress = progressResult.success ? progressResult.data || [] : [];
  
  // Convert progress array to map for easier lookup
  const progressMap: Record<string, boolean> = {};
  progress.forEach((p) => {
    progressMap[p.topic_id] = p.completed;
  });

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-4xl font-bold mb-6">Learning Dashboard</h1>
              <div className="space-y-6">
                {topics.map((topic) => (
                  <DashboardClient
                    key={topic.id}
                    topic={topic}
                    initialProgress={progressMap}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar panels */}
            <div className="space-y-6">
              <RAGPanel />
              <FocusMeter progress={progress} />
              <DisciplineTracker progress={progress} />
              <DailyWin />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
