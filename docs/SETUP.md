# Setup Guide

Complete setup instructions for the Interactive Learning Dashboard.

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase account (free tier works)
- OpenAI API key
- Git (optional, for version control)

## Step-by-Step Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd interactive-learning-dashboard
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Project Settings > API to get your keys

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

OPENAI_API_KEY=sk-...
EMBEDDINGS_MODEL=text-embedding-3-large
CHAT_MODEL=gpt-4o-mini

ADMIN_EMAILS=your-email@example.com

WS_SERVER_URL=ws://localhost:3001
```

### 5. Run Database Migrations

1. Go to Supabase Dashboard > SQL Editor
2. Run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_profile_trigger.sql`

Alternatively, use Supabase CLI:

```bash
npx supabase db push
```

### 6. Seed Initial Data (Optional)

```bash
pnpm seed
```

### 7. Start Development Servers

**Option 1: Run both servers together**
```bash
pnpm dev:all
```

**Option 2: Run separately**

Terminal 1 (Next.js):
```bash
pnpm dev
```

Terminal 2 (WebSocket):
```bash
pnpm ws-server
```

### 8. Verify Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the login page
3. Sign up with your email (magic link)
4. Check your email and click the magic link
5. You should be redirected to the dashboard

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and keys are correct
- Check that migrations ran successfully
- Ensure RLS policies are enabled

### Authentication Issues

- Check that email provider is configured in Supabase
- Verify magic link emails are being sent (check spam folder)
- Check Supabase logs for errors

### WebSocket Connection Issues

- Ensure WebSocket server is running on port 3001
- Check firewall settings
- Verify WS_SERVER_URL matches the server URL

### OpenAI API Issues

- Verify API key is correct and has credits
- Check rate limits
- Ensure model names match your OpenAI account access

## Next Steps

- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design details
- See [API.md](./API.md) for API documentation

