'use client';

import { useState } from 'react';
import { fetchWithTimeout } from '@/lib/utils/fetchWithTimeout';

interface Source {
  title: string;
  source: string;
  relevance: number;
}

interface RAGResponse {
  answer: string;
  sources: Source[];
}

export default function RAGPanel() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Use fetchWithTimeout with 60 second timeout for RAG operations
      const res = await fetchWithTimeout(
        '/api/assist/explain',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question }),
        },
        60000 // 60 seconds timeout
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(data.error || `Server error: ${res.status} ${res.statusText}`);
      }

      const data: RAGResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      // Handle timeout specifically
      if (err.message?.includes('timed out')) {
        setError('The request took too long. The server might be processing a complex query. Please try again with a simpler question.');
      } else if (err.name === 'AbortError' || err.message?.includes('aborted')) {
        setError('Request was cancelled. Please try again.');
      } else {
        setError(err.message || 'An error occurred while processing your question. Please try again.');
      }
      console.error('RAG Panel error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">RAG Explain</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question about any topic..."
          className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary resize-none"
          rows={3}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full py-2 px-4 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Asking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-error/20 border border-error rounded-md text-error text-sm">
          {error}
        </div>
      )}

      {response && (
        <div className="mt-4 space-y-4">
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-text-primary">
              {response.answer}
            </div>
          </div>
          {response.sources.length > 0 && (
            <div>
              <h4 className="font-bold mb-2">Sources:</h4>
              <ul className="space-y-2">
                {response.sources.map((source, idx) => (
                  <li key={idx} className="text-sm">
                    <a
                      href={source.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                    >
                      {source.title}
                    </a>
                    <span className="text-text-secondary ml-2">
                      (relevance: {Math.round(source.relevance * 100)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

