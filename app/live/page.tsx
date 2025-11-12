'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { WebSocketClient } from '@/lib/ws/client';
import LiveFeed from '@/components/LiveFeed';
import MockEventGenerator from '@/components/MockEventGenerator';
import type { LiveEvent } from '@/lib/ws/types';

export default function LivePage() {
  const router = useRouter();
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null);
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      }
    });
  }, [router]);

  useEffect(() => {
    const client = new WebSocketClient();
    setWsClient(client);

    client
      .connect()
      .then(() => {
        setConnected(true);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to connect to WebSocket server');
        setConnected(false);
      });

    client.on('event', (event: LiveEvent) => {
      setEvents((prev) => {
        const newEvents = [event, ...prev];
        // Keep only last 50 events
        return newEvents.slice(0, 50);
      });
    });

    return () => {
      client.disconnect();
    };
  }, []);

  const handleSendEvent = (event: LiveEvent) => {
    if (wsClient && connected) {
      wsClient.send(event);
    } else {
      setError('Not connected to WebSocket server');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Live Events</h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                connected ? 'bg-success' : 'bg-error'
              }`}
            />
            <span className="text-sm text-text-secondary">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/20 border border-error rounded-lg text-error">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-surface border border-border rounded-lg p-6 h-[calc(100vh-200px)]">
              <LiveFeed events={events} autoScroll={true} />
            </div>
          </div>
          <div>
            <MockEventGenerator onSendEvent={handleSendEvent} />
          </div>
        </div>
      </div>
    </div>
  );
}

