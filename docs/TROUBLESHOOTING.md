# Troubleshooting Guide

Common issues and solutions for the Interactive Learning Dashboard.

## Browser Console Warnings

### SES/Lockdown Warnings

If you see warnings like:
```
Removing unpermitted intrinsics...
Removing intrinsics.%MapPrototype%.getOrInsert...
```

**Cause:** These warnings come from browser extensions (especially Firefox extensions like MetaMask, security extensions, or crypto wallets) that use SES (Secure ECMAScript) to harden JavaScript environments.

**Solution:** 
- ✅ **Ignore them** - They are harmless and don't affect our application
- ✅ **Disable the extension** temporarily if they're distracting
- ✅ **Filter console warnings** in browser DevTools

**Impact:** None - Our application works correctly regardless of these warnings.

## Common Issues

### 1. WebSocket Connection Failed

**Symptoms:**
- Live Events page shows "Disconnected"
- WebSocket errors in console

**Solutions:**
1. Ensure WebSocket server is running:
   ```bash
   pnpm ws-server
   ```
2. Check if port 3001 is available:
   ```bash
   netstat -ano | findstr :3001
   ```
3. Verify `WS_SERVER_URL` in `.env.local`:
   ```
   WS_SERVER_URL=ws://localhost:3001
   ```

### 2. API Timeout Errors

**Symptoms:**
- "Request timed out" errors
- RAG panel not responding

**Solutions:**
1. Check OpenAI API key is valid
2. Verify internet connection
3. Check OpenAI API status
4. Increase timeout if needed (already set to 60s)

### 3. Database Connection Issues

**Symptoms:**
- Progress not saving
- "Failed to fetch" errors

**Solutions:**
1. Verify Supabase credentials in `.env.local`
2. Check Supabase project is active
3. Verify RLS policies are set correctly
4. Check network connectivity to Supabase

### 4. Build Errors

**Symptoms:**
- TypeScript errors
- Build fails

**Solutions:**
1. Clear `.next` folder:
   ```bash
   rm -rf .next
   ```
2. Reinstall dependencies:
   ```bash
   pnpm install
   ```
3. Rebuild:
   ```bash
   pnpm build
   ```

### 5. Environment Variables Not Loading

**Symptoms:**
- "Missing environment variable" errors
- API calls failing

**Solutions:**
1. Ensure `.env.local` exists in project root
2. Restart development server after changing `.env.local`
3. Verify variable names match exactly (case-sensitive)
4. Check for typos in variable names

## Performance Issues

### Slow RAG Responses

- Normal for complex queries (can take 30-60 seconds)
- Check OpenAI API status
- Verify knowledge base is indexed

### Slow Page Loads

- Check network connection
- Verify Supabase connection
- Clear browser cache

## Getting Help

1. Check browser console for specific errors
2. Check server logs (terminal where `pnpm dev` is running)
3. Verify all environment variables are set
4. Ensure all servers are running (Next.js + WebSocket)

