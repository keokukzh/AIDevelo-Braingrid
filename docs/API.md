# API Documentation

API endpoints and server actions for the Interactive Learning Dashboard.

## Authentication

All API endpoints (except login) require authentication via Supabase session cookie.

## API Endpoints

### POST /api/assist/index

Index content into the knowledge base (Admin only).

**Authentication**: Service role key or admin email required

**Request Body**:
```json
{
  "title": "React Server Components Guide",
  "source": "https://react.dev/blog/2023/...",
  "text": "Full article text..."
}
```

**Response**:
```json
{
  "success": true,
  "chunks_created": 12,
  "chunk_ids": [1, 2, 3, ...]
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Unauthorized. Admin access required."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/assist/index \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -d '{
    "title": "Example Article",
    "source": "https://example.com",
    "text": "Article content here..."
  }'
```

### POST /api/assist/explain

Get AI-powered explanation for a question using RAG.

**Authentication**: Required (user session)

**Request Body**:
```json
{
  "question": "What is React Server Components?"
}
```

**Response**:
```json
{
  "answer": "React Server Components are...",
  "sources": [
    {
      "title": "React Documentation",
      "source": "https://react.dev/...",
      "relevance": 0.92
    }
  ]
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Unauthorized. Please log in."
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/assist/explain \
  -H "Content-Type: application/json" \
  -H "Cookie: YOUR_SESSION_COOKIE" \
  -d '{
    "question": "What is React?"
  }'
```

## Server Actions

### Progress Actions

Located in `lib/actions/progress.ts`

#### saveProgress(topicId: string, completed: boolean)

Save or update progress for a topic.

**Returns**: `ActionResult<Progress>`

#### fetchProgress()

Get all progress for the current user.

**Returns**: `ActionResult<Progress[]>`

#### fetchProgressByTopic(topicId: string)

Get progress for a specific topic.

**Returns**: `ActionResult<Progress | null>`

#### deleteProgress(topicId: string)

Delete progress for a topic.

**Returns**: `ActionResult<void>`

### Notes Actions

Located in `lib/actions/notes.ts`

#### saveNote(kind: 'daily_win' | 'general', content: string)

Create a new note.

**Returns**: `ActionResult<Note>`

#### fetchNotes(kind?: 'daily_win' | 'general')

Get notes, optionally filtered by kind.

**Returns**: `ActionResult<Note[]>`

#### updateNote(id: number, content: string)

Update an existing note.

**Returns**: `ActionResult<Note>`

#### deleteNote(id: number)

Delete a note.

**Returns**: `ActionResult<void>`

### Events Actions

Located in `lib/actions/events.ts`

#### saveEvent(type: string, payload: object)

Save an event to the database.

**Returns**: `ActionResult<Event>`

#### fetchEvents(type?: string, limit?: number)

Get events with optional filters.

**Returns**: `ActionResult<Event[]>`

#### deleteEvent(id: number)

Delete an event.

**Returns**: `ActionResult<void>`

### Profile Actions

Located in `lib/actions/profile.ts`

#### getProfile()

Get current user's profile.

**Returns**: `ActionResult<Profile>`

#### updateProfile(username: string)

Update username.

**Returns**: `ActionResult<Profile>`

#### getProgressStats()

Get progress statistics.

**Returns**: `ActionResult<{total, completed, percentage, streak}>`

## Response Format

All server actions return a standardized format:

```typescript
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

## Error Handling

- Authentication errors return `{success: false, error: "Not authenticated"}`
- Validation errors include descriptive messages
- Database errors are caught and formatted
- All errors are logged server-side

## Rate Limiting

Currently no rate limiting implemented. Consider adding:
- Per-user rate limits
- Per-endpoint limits
- OpenAI API rate limit handling (already implemented)

## CORS

CORS is handled by Next.js. For production:
- Configure allowed origins in Vercel
- Set up CORS in Supabase if needed

