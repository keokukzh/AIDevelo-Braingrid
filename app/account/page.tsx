import { requireAuth } from '@/lib/auth/session';
import { getProfile, getProgressStats } from '@/lib/actions/profile';
import ProfileForm from '@/components/ProfileForm';
import ProgressStats from '@/components/ProgressStats';
import { createClient } from '@/lib/supabaseServer';

export default async function AccountPage() {
  const user = await requireAuth();
  const profileResult = await getProfile();
  const statsResult = await getProgressStats();

  const profile = profileResult.success ? profileResult.data : null;
  const stats = statsResult.success ? statsResult.data : null;

  // Get user email
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Account Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProfileForm
            initialProfile={profile || null}
            userEmail={authUser?.email || ''}
          />
          {stats && (
            <ProgressStats
              total={stats.total}
              completed={stats.completed}
              percentage={stats.percentage}
              streak={stats.streak}
            />
          )}
        </div>

        <div className="mt-6 bg-surface border border-border rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Account Information</h3>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-text-secondary">Account created:</span>{' '}
              <span className="text-text-primary">
                {authUser?.created_at
                  ? new Date(authUser.created_at).toLocaleDateString()
                  : 'Unknown'}
              </span>
            </div>
            <div>
              <span className="text-text-secondary">User ID:</span>{' '}
              <span className="text-text-primary font-mono text-xs">
                {user.id}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

