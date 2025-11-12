# Architecture Documentation

System architecture and design decisions for the Interactive Learning Dashboard.

## System Overview

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── Next.js App Router (Frontend)
       │    ├── React Components
       │    ├── Server Actions
       │    └── API Routes
       │
       ├─── Supabase
       │    ├── PostgreSQL Database
       │    ├── Authentication
       │    └── pgvector (Embeddings)
       │
       ├─── OpenAI API
       │    ├── Embeddings (text-embedding-3-large)
       │    └── Chat Completion (gpt-4o-mini)
       │
       └─── WebSocket Server
            └── Live Event Streaming
```

## Component Architecture

### Frontend (Next.js 14 App Router)

- **Pages**: Server Components for initial data loading
- **Components**: Client Components for interactivity
- **Server Actions**: Server-side data mutations
- **API Routes**: RESTful endpoints for RAG system

### Backend Services

- **Supabase**: Database, Auth, Vector Search
- **OpenAI**: Embeddings and Chat Completion
- **WebSocket**: Real-time event streaming

## Data Flow

### Authentication Flow

```
User → Login Page → Supabase Auth → Magic Link Email
  → Click Link → Session Created → Redirect to Dashboard
```

### Progress Tracking Flow

```
User Checks Box → Client Component → Server Action
  → Supabase (RLS) → Database → Response → UI Update
```

### RAG Explanation Flow

```
User Question → API Route → Embed Question
  → Vector Search (Supabase) → Retrieve Top Chunks
  → Build Context → OpenAI Chat → Return Answer + Sources
```

### WebSocket Event Flow

```
Mock Generator → WebSocket Client → WebSocket Server
  → Broadcast to All Clients → UI Updates
```

## Database Schema

### Tables

1. **profiles** - User profiles (1:1 with auth.users)
2. **progress** - Learning progress per user/topic
3. **notes** - User notes (daily wins, general)
4. **events** - Live events (optional persistence)
5. **knowledge_chunks** - RAG embeddings with pgvector

### Relationships

- All user tables reference `auth.users(id)` with CASCADE DELETE
- RLS policies enforce user isolation
- Vector similarity search on `knowledge_chunks.embedding`

## Security

### Row-Level Security (RLS)

- Users can only access their own data
- Policies use `auth.uid()` for user identification
- Knowledge chunks: read-only for users, write via service role

### Authentication

- Magic link (passwordless) authentication
- Session stored in httpOnly cookies
- Middleware protects routes

### API Security

- Admin endpoints require service role key or admin email
- RAG endpoints require authentication
- Input validation on all endpoints

## Technology Decisions

### Why Next.js 14 App Router?

- Server Components for better performance
- Built-in API routes
- Excellent TypeScript support
- Easy deployment to Vercel

### Why Supabase?

- PostgreSQL with pgvector for embeddings
- Built-in authentication
- Row-Level Security
- Real-time capabilities (future)

### Why OpenAI?

- High-quality embeddings (text-embedding-3-large)
- Cost-effective chat model (gpt-4o-mini)
- Reliable API
- Good documentation

### Why WebSocket?

- Real-time event demonstration
- Low latency
- Bidirectional communication
- Industry standard

## Performance Considerations

- Server Components reduce client-side JavaScript
- Vector search optimized with pgvector indexes
- Batch embedding generation for efficiency
- Optimistic UI updates for better UX
- Event queue limits (50 events) to prevent memory issues

## Scalability

- Stateless API design
- Database connection pooling (Supabase)
- CDN for static assets (Vercel)
- Horizontal scaling possible for WebSocket server

## Future Enhancements

- Real-time subscriptions (Supabase Realtime)
- Caching layer (Redis)
- Rate limiting
- Advanced RAG techniques (reranking, hybrid search)
- Streaming responses
- Conversation history

