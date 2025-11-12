# Deployment Guide

Deploy the Interactive Learning Dashboard to production.

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository

### 2. Configure Environment Variables

In Vercel project settings, add all environment variables from `.env.example`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `EMBEDDINGS_MODEL`
- `CHAT_MODEL`
- `ADMIN_EMAILS`
- `WS_SERVER_URL` (optional, for WebSocket)

### 3. Configure Build Settings

- Framework Preset: Next.js
- Build Command: `pnpm build` (or leave default)
- Output Directory: `.next` (default)
- Install Command: `pnpm install`

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Supabase Production Setup

### 1. Create Production Project

1. Create a new Supabase project for production
2. Note: Use a separate project from development

### 2. Run Migrations

Run all migration files in order:

```sql
-- Run 001_initial_schema.sql
-- Run 002_rls_policies.sql
-- Run 003_profile_trigger.sql
```

### 3. Configure Authentication

1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates (optional)
4. Set up custom SMTP (recommended for production)

### 4. Set Up RLS Policies

Verify all RLS policies are active:

```sql
-- Check policies
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### 5. Configure CORS

In Supabase Dashboard > Settings > API:
- Add your Vercel domain to allowed origins
- Configure CORS headers if needed

## WebSocket Server Deployment

For production WebSocket, consider:

1. **Vercel Edge Functions** (limited WebSocket support)
2. **Separate Node.js server** on Railway, Render, or DigitalOcean
3. **Server-Sent Events (SSE)** alternative (see code for SSE implementation)

### Option: Use SSE Instead

The app supports SSE as a fallback. Update `WS_SERVER_URL` to point to your SSE endpoint.

## Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migrations run in production Supabase
- [ ] RLS policies active
- [ ] Authentication working (test signup/login)
- [ ] RAG indexing endpoint accessible (admin only)
- [ ] WebSocket/SSE connection working (if applicable)
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Analytics configured (optional)

## Monitoring

- Monitor Vercel deployment logs
- Check Supabase logs for database errors
- Set up error tracking (Sentry recommended)
- Monitor OpenAI API usage and costs

## Rollback

If deployment fails:

1. Go to Vercel Dashboard > Deployments
2. Find last working deployment
3. Click "..." > "Promote to Production"

## Environment-Specific Configuration

### Development

- Use local Supabase instance (optional)
- WebSocket on localhost:3001
- Debug logging enabled

### Production

- Production Supabase project
- WebSocket on production server or SSE
- Error tracking enabled
- Performance monitoring

