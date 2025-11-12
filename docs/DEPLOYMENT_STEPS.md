# Quick Deployment Steps

## Vercel Deployment (Recommended)

### Option 1: Via Web Interface (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/new
   - Sign in with GitHub

2. **Import Repository**
   - Click "Import Git Repository"
   - Select: `keokukzh/AIDevelo-Braingrid`
   - Click "Import"

3. **Configure Project**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `pnpm install` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://phvqzsztbyklbdswuabq.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=sk-proj-...
   EMBEDDINGS_MODEL=text-embedding-3-large
   CHAT_MODEL=gpt-4o-mini
   GEMINI_API_KEY=AIzaSyC0sf5549oOZAbrlRI7LZHQ4ad9pUh_QIw
   ADMIN_EMAILS=keokukmusic@gmail.com
   WS_SERVER_URL=ws://your-websocket-server.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

### Option 2: Via CLI

```bash
# 1. Login to Vercel
vercel login

# 2. Link project (first time)
vercel link

# 3. Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY
# ... repeat for all variables

# 4. Deploy to production
vercel --prod
```

## Post-Deployment Checklist

- [ ] Verify app loads at Vercel URL
- [ ] Test authentication (if enabled)
- [ ] Test RAG explanation endpoint
- [ ] Test progress tracking
- [ ] Check WebSocket connection (if deployed separately)
- [ ] Monitor error logs in Vercel dashboard
- [ ] Set up custom domain (optional)

## WebSocket Server Deployment

Since Vercel doesn't support WebSocket servers, deploy separately:

### Option 1: Railway
1. Create account at railway.app
2. New project → Deploy from GitHub
3. Select repository
4. Set start command: `pnpm ws-server`
5. Add environment variables
6. Deploy

### Option 2: Render
1. Create account at render.com
2. New Web Service
3. Connect GitHub repository
4. Build command: `pnpm install`
5. Start command: `pnpm ws-server`
6. Add environment variables
7. Deploy

### Option 3: DigitalOcean App Platform
1. Create account at digitalocean.com
2. Create App → GitHub
3. Select repository
4. Configure as Node.js service
5. Set start command: `pnpm ws-server`
6. Deploy

## Environment Variables Reference

Copy these from your `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `EMBEDDINGS_MODEL` (default: text-embedding-3-large)
- `CHAT_MODEL` (default: gpt-4o-mini)
- `GEMINI_API_KEY` (optional)
- `ADMIN_EMAILS`
- `WS_SERVER_URL` (for WebSocket server)

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure `pnpm` is available (Vercel auto-detects)

### Runtime Errors
- Check function logs in Vercel dashboard
- Verify Supabase connection
- Check OpenAI API key validity

### WebSocket Not Connecting
- Verify WebSocket server is deployed separately
- Update `WS_SERVER_URL` in Vercel environment variables
- Check CORS settings on WebSocket server

