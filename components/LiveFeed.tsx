'use client';

import { useEffect, useRef, useState } from 'react';
import type { LiveEvent } from '@/lib/ws/types';
import { WebSocketClient } from '@/lib/ws/client';

interface LiveFeedProps {
  events: LiveEvent[];
  autoScroll?: boolean;
}

export default function LiveFeed({ events, autoScroll = true }: LiveFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (autoScroll && !paused && feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [events, autoScroll, paused]);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Live Events</h3>
        {autoScroll && (
          <button
            onClick={() => setPaused(!paused)}
            className="text-sm text-text-secondary hover:text-text-primary"
          >
            {paused ? 'Resume Auto-scroll' : 'Pause Auto-scroll'}
          </button>
        )}
      </div>
      <div
        ref={feedRef}
        className="flex-1 overflow-y-auto space-y-2"
        style={{ maxHeight: '600px' }}
      >
        {events.length === 0 ? (
          <div className="text-text-secondary text-center py-8">
            No events yet. Events will appear here in real-time.
          </div>
        ) : (
          events.map((event, idx) => (
            <EventItem key={idx} event={event} />
          ))
        )}
      </div>
    </div>
  );
}

function EventItem({ event }: { event: LiveEvent }) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'gift':
        return '🎁';
      case 'like':
        return '❤️';
      case 'share':
        return '📤';
      case 'chat':
        return '💬';
      default:
        return '📢';
    }
  };

  const getEventColor = () => {
    switch (event.type) {
      case 'gift':
        return 'border-warning bg-warning/10';
      case 'like':
        return 'border-error bg-error/10';
      case 'share':
        return 'border-accent bg-accent/10';
      case 'chat':
        return 'border-border bg-surface';
      default:
        return 'border-border bg-surface';
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg ${getEventColor()} transition-all animate-in slide-in-from-right`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getEventIcon()}</span>
        <div className="flex-1">
          <div className="font-medium">{event.user}</div>
          {event.type === 'gift' && 'amount' in event && (
            <div className="text-sm text-text-secondary">
              Sent {event.amount} {event.gift}
            </div>
          )}
          {event.type === 'like' && 'count' in event && (
            <div className="text-sm text-text-secondary">
              {event.count} likes
            </div>
          )}
          {event.type === 'share' && (
            <div className="text-sm text-text-secondary">Shared</div>
          )}
          {event.type === 'chat' && 'message' in event && (
            <div className="text-sm mt-1">{event.message}</div>
          )}
        </div>
        {event.timestamp && (
          <div className="text-xs text-text-secondary">
            {new Date(event.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}

