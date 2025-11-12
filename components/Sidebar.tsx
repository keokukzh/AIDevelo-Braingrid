'use client';

import { topics, type Topic } from '@/lib/constants/topics';
import { useState } from 'react';

interface SidebarProps {
  activeTopic?: string;
  onTopicSelect?: (topicId: string) => void;
}

export default function Sidebar({ activeTopic, onTopicSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full w-64
          bg-surface border-r border-border
          z-40
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 pt-12 md:pt-4">Topics</h2>
          <nav className="space-y-2">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => {
                  onTopicSelect?.(topic.id);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 rounded-md
                  transition-colors
                  ${
                    activeTopic === topic.id
                      ? 'bg-accent text-white'
                      : 'hover:bg-surface/80 text-text-secondary'
                  }
                `}
              >
                {topic.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

