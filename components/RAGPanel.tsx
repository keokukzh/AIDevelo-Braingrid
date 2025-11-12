'use client';

import { useState } from 'react';

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
      const res = await fetch('/api/assist/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to get answer');
      }

      const data: RAGResponse = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
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

