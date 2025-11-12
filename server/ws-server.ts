import { WebSocketServer, WebSocket } from 'ws';
import type { LiveEvent } from '../lib/ws/types';
import { isValidEvent } from '../lib/ws/types';

const PORT = process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 3001;
const clients = new Set<WebSocket>();

const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');
  clients.add(ws);

  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    message: 'Connected to live events server',
  }));

  // Handle incoming messages
  ws.on('message', (data: Buffer) => {
    try {
      const message = JSON.parse(data.toString());
      
      // Validate event
      if (!isValidEvent(message)) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid event format',
        }));
        return;
      }

      // Add timestamp if not present
      const event: LiveEvent = {
        ...message,
        timestamp: message.timestamp || Date.now(),
      };

      // Broadcast to all clients
      broadcast(event);
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid JSON format',
      }));
    }
  });

  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });

  // Handle errors
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });

  // Heartbeat (ping/pong)
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(heartbeat);
    }
  }, 30000);

  ws.on('pong', () => {
    // Client responded to ping
  });
});

function broadcast(event: LiveEvent) {
  const message = JSON.stringify(event);
  let sentCount = 0;

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
        sentCount++;
      } catch (error) {
        console.error('Error sending to client:', error);
        clients.delete(client);
      }
    }
  });

  console.log(`Broadcasted ${event.type} event to ${sentCount} clients`);
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, closing WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

