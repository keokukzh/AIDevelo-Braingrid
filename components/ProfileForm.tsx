'use client';

import { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '@/lib/actions/profile';
import type { Profile } from '@/lib/db/types';

interface ProfileFormProps {
  initialProfile: Profile | null;
  userEmail: string;
}

export default function ProfileForm({
  initialProfile,
  userEmail,
}: ProfileFormProps) {
  const [username, setUsername] = useState(initialProfile?.username || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateProfile(username);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Failed to update profile');
    }

    setLoading(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Profile Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-secondary cursor-not-allowed"
          />
          <p className="text-xs text-text-secondary mt-1">
            Email cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
            disabled={loading}
          />
          <p className="text-xs text-text-secondary mt-1">
            3-20 characters, alphanumeric and underscore only
          </p>
        </div>

        {error && (
          <div className="p-3 bg-error/20 border border-error rounded-md text-error text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-success/20 border border-success rounded-md text-success text-sm">
            Profile updated successfully!
          </div>
        )}

        <button
          type="submit"
          disabled={loading || username === initialProfile?.username}
          className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

