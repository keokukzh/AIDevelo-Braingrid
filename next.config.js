/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable static optimization for pages that use Supabase client-side
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Increase API route timeout (default is 10s)
  // This is important for RAG operations that call OpenAI
  api: {
    responseLimit: false,
    bodyParser: {
      sizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig

