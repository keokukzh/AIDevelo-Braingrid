'use client';

import { useState } from 'react';
import type { LiveEvent } from '@/lib/ws/types';

interface MockEventGeneratorProps {
  onSendEvent: (event: LiveEvent) => void;
}

export default function MockEventGenerator({
  onSendEvent,
}: MockEventGeneratorProps) {
  const [username, setUsername] = useState('DemoUser');
  const [giftAmount, setGiftAmount] = useState(100);
  const [giftType, setGiftType] = useState('Rose');
  const [likeCount, setLikeCount] = useState(25);
  const [chatMessage, setChatMessage] = useState('Hello from the demo!');

  const sendGift = () => {
    onSendEvent({
      type: 'gift',
      user: username,
      amount: giftAmount,
      gift: giftType,
      timestamp: Date.now(),
    });
  };

  const sendLike = () => {
    onSendEvent({
      type: 'like',
      user: username,
      count: likeCount,
      timestamp: Date.now(),
    });
  };

  const sendShare = () => {
    onSendEvent({
      type: 'share',
      user: username,
      timestamp: Date.now(),
    });
  };

  const sendChat = () => {
    onSendEvent({
      type: 'chat',
      user: username,
      message: chatMessage,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Mock Event Generator</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Gift Amount</label>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Gift Type</label>
            <input
              type="text"
              value={giftType}
              onChange={(e) => setGiftType(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Like Count</label>
          <input
            type="number"
            value={likeCount}
            onChange={(e) => setLikeCount(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Chat Message</label>
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            className="w-full px-4 py-2 bg-background border border-border rounded-md text-text-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={sendGift}
            className="px-4 py-2 bg-warning text-white rounded-md hover:bg-warning/90 transition-colors"
          >
            Send Gift 🎁
          </button>
          <button
            onClick={sendLike}
            className="px-4 py-2 bg-error text-white rounded-md hover:bg-error/90 transition-colors"
          >
            Send Like ❤️
          </button>
          <button
            onClick={sendShare}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 transition-colors"
          >
            Send Share 📤
          </button>
          <button
            onClick={sendChat}
            className="px-4 py-2 bg-surface border border-border rounded-md hover:bg-surface/80 transition-colors"
          >
            Send Chat 💬
          </button>
        </div>
      </div>
    </div>
  );
}

