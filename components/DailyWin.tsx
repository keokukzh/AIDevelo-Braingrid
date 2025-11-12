'use client';

import { useState, useEffect } from 'react';
import { saveNote, fetchNotes } from '@/lib/actions/notes';

export default function DailyWin() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load today's win
    loadTodaysWin();
  }, []);

  const loadTodaysWin = async () => {
    const result = await fetchNotes('daily_win');
    if (result.success && result.data) {
      const today = new Date().toDateString();
      const todaysNote = result.data.find(
        (note) => new Date(note.created_at).toDateString() === today
      );
      if (todaysNote) {
        setContent(todaysNote.content);
        setSaved(true);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    const result = await saveNote('daily_win', content.trim());
    
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError(result.error || 'Failed to save');
    }

    setLoading(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Daily Win</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's your win for today?"
          className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary resize-none"
          rows={4}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full py-2 px-4 bg-success text-white rounded-md hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : saved ? 'Saved! ✓' : 'Save Win'}
        </button>
      </form>
      {error && (
        <div className="mt-2 p-2 bg-error/20 border border-error rounded-md text-error text-sm">
          {error}
        </div>
      )}
    </div>
  );
}

