'use client';

import { type Topic, type Subtopic } from '@/lib/constants/topics';
import { useState } from 'react';
import Modal from './Modal';

interface TopicCardProps {
  topic: Topic;
  progress: Record<string, boolean>;
  onProgressChange: (subtopicId: string, completed: boolean) => void;
}

export default function TopicCard({
  topic,
  progress,
  onProgressChange,
}: TopicCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-surface border border-border rounded-lg p-6 hover:border-accent transition-colors">
        <h3 className="text-2xl font-bold mb-2">{topic.title}</h3>
        <p className="text-text-secondary mb-4">{topic.description}</p>

        <div className="space-y-3 mb-4">
          {topic.subtopics.map((subtopic) => (
            <div key={subtopic.id} className="flex items-start gap-3">
              <input
                type="checkbox"
                id={subtopic.id}
                checked={progress[subtopic.id] || false}
                onChange={(e) => onProgressChange(subtopic.id, e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border bg-background text-accent focus:ring-accent"
              />
              <div className="flex-1">
                <label
                  htmlFor={subtopic.id}
                  className="font-medium cursor-pointer block"
                >
                  {subtopic.title}
                </label>
                <p className="text-sm text-text-secondary">
                  {subtopic.description}
                </p>
                <div className="flex gap-2 mt-1">
                  {subtopic.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent hover:underline"
                    >
                      {resource.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
        >
          More Explanation
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={topic.title}
      >
        <div className="space-y-4">
          <p className="text-text-secondary">{topic.description}</p>
          <div className="space-y-4">
            {topic.subtopics.map((subtopic) => (
              <div key={subtopic.id}>
                <h4 className="font-bold mb-2">{subtopic.title}</h4>
                <p className="text-text-secondary mb-2">{subtopic.description}</p>
                <div className="flex flex-wrap gap-2">
                  {subtopic.resources.map((resource, idx) => (
                    <a
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                    >
                      {resource.label} →
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
}

