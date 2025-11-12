# Interactive Learning Dashboard

A production-ready learning dashboard that combines structured learning content with AI-powered explanations and live event demonstrations.

## Features

- **Structured Learning Content**: Organize learning across 10 technical domains (Frontend, Backend, AI, DevOps, etc.)
- **AI-Powered Explanations**: RAG-based Q&A system with cited sources
- **Progress Tracking**: Track individual learning progress with persistence
- **Real-Time Events**: WebSocket integration for live event demonstrations
- **Dark Theme UI**: Clean, accessible interface optimized for focus

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL + Auth + Vector)
- **AI/ML**: OpenAI API (GPT-4o-mini, text-embedding-3-large)
- **Real-time**: WebSocket (ws library)

## Quick Start

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Start WebSocket server** (in separate terminal):
   ```bash
   pnpm ws-server
   ```

   Or run both together:
   ```bash
   pnpm dev:all
   ```

## Project Structure

```
/app              # Next.js App Router pages
/components        # React components
/lib              # Utilities and helpers
/styles            # Global styles
/supabase         # Database migrations
/scripts           # Utility scripts
/public            # Static assets
```

## Environment Variables

See `.env.example` for all required environment variables.

## Documentation

- [Setup Guide](./docs/SETUP.md) - Detailed setup instructions
- [Architecture](./docs/ARCHITECTURE.md) - System design and data flows
- [API Documentation](./docs/API.md) - API endpoint specifications
- [Deployment](./docs/DEPLOYMENT.md) - Production deployment guide

## QA Checklist

- [ ] `pnpm install` completes without errors
- [ ] `pnpm dev` starts development server
- [ ] WebSocket server starts (`pnpm ws-server`)
- [ ] Login with magic link works
- [ ] Dashboard loads and displays topics
- [ ] Progress checkboxes save and persist
- [ ] RAG panel answers questions (requires indexed content)
- [ ] Live events page connects to WebSocket
- [ ] Mock events display in real-time
- [ ] Account page displays profile and stats
- [ ] Daily Win saves successfully

## License

MIT

