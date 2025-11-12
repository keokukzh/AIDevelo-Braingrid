import { createServiceRoleClient } from '../lib/supabaseClient';
import { chunkText } from '../lib/rag/chunker';
import { generateEmbeddings } from '../lib/rag/embeddings';

const supabase = createServiceRoleClient();

async function seedKnowledgeBase() {
  console.log('🌱 Starting knowledge base seeding...');

  // Sample knowledge base content
  const knowledgeBase = [
    {
      title: 'React Server Components',
      source: 'https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023',
      text: `React Server Components allow you to write UI that can be rendered and optionally cached on the server. They're an evolution of React components that enable better performance and user experience.

Server Components run only on the server and can access backend resources directly. They're sent to the client as a special format that React can progressively render.

Key benefits:
- Zero bundle size impact on the client
- Direct access to backend resources
- Automatic code splitting
- Streaming and progressive rendering

Server Components are different from Server-Side Rendering (SSR). With SSR, the entire page is rendered on the server and sent as HTML. With Server Components, React components are sent in a special format that allows React to progressively render them on the client.`,
    },
    {
      title: 'Next.js App Router',
      source: 'https://nextjs.org/docs/app',
      text: `The App Router is a new paradigm for building applications using React Server Components. It provides a new directory structure and routing system built on top of React Server Components.

Key features:
- Layouts: Shared UI that persists across routes
- Server Components: Components that render on the server by default
- Streaming: Progressive rendering and loading states
- Data Fetching: Simplified data fetching with async Server Components
- Loading States: Built-in loading UI
- Error Handling: Error boundaries and error UI

The App Router uses a file-system based routing system. Folders are used to define routes, and special files like page.tsx, layout.tsx, and loading.tsx are used to create UI.`,
    },
    {
      title: 'Supabase Authentication',
      source: 'https://supabase.com/docs/guides/auth',
      text: `Supabase Auth provides a complete authentication system for your applications. It supports multiple authentication methods including email/password, magic links, OAuth providers, and more.

Key features:
- Email/Password authentication
- Magic link (passwordless) authentication
- OAuth providers (Google, GitHub, etc.)
- Row-Level Security (RLS) integration
- Session management
- User management

Supabase Auth uses JWT tokens for session management. When a user signs in, Supabase returns a JWT token that can be used to authenticate API requests. The token is stored securely and automatically included in requests.`,
    },
    {
      title: 'RAG (Retrieval-Augmented Generation)',
      source: 'https://arxiv.org/abs/2005.11401',
      text: `Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with language generation. It allows language models to access external knowledge sources to provide more accurate and up-to-date answers.

How RAG works:
1. User asks a question
2. System retrieves relevant documents from a knowledge base
3. Retrieved documents are used as context
4. Language model generates answer based on context and question

Benefits:
- Access to up-to-date information
- Reduced hallucinations
- Ability to cite sources
- Domain-specific knowledge

RAG systems typically use vector embeddings to find relevant documents. Questions and documents are converted to embeddings, and similarity search is used to find the most relevant documents.`,
    },
    {
      title: 'WebSocket Protocol',
      source: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API',
      text: `WebSocket is a communication protocol that provides full-duplex communication channels over a single TCP connection. Unlike HTTP, WebSocket allows both the client and server to send messages at any time.

Key features:
- Full-duplex communication
- Low latency
- Persistent connection
- Real-time data transfer

WebSocket connections start as HTTP requests and are upgraded to WebSocket connections. Once established, both client and server can send messages asynchronously.

Use cases:
- Real-time chat applications
- Live updates and notifications
- Collaborative editing
- Live event streaming
- Gaming applications

WebSocket is particularly useful for applications that require real-time updates, such as live dashboards, chat applications, and collaborative tools.`,
    },
  ];

  console.log(`📚 Indexing ${knowledgeBase.length} articles...`);

  let totalChunks = 0;

  for (let i = 0; i < knowledgeBase.length; i++) {
    const article = knowledgeBase[i];
    console.log(`\n[${i + 1}/${knowledgeBase.length}] Indexing: ${article.title}`);

    // Chunk the text
    const chunks = chunkText(article.text, 800, 100);
    console.log(`  → Generated ${chunks.length} chunks`);

    // Generate embeddings
    console.log(`  → Generating embeddings...`);
    const embeddings = await generateEmbeddings(chunks);

    // Insert into database
    console.log(`  → Inserting into database...`);
    for (let j = 0; j < chunks.length; j++) {
      const { error } = await supabase.from('knowledge_chunks').insert({
        title: article.title,
        source: article.source,
        chunk: chunks[j],
        embedding: embeddings[j],
      });

      if (error) {
        console.error(`  ✗ Error inserting chunk ${j + 1}:`, error.message);
      } else {
        totalChunks++;
      }
    }

    console.log(`  ✓ Successfully indexed ${article.title}`);
  }

  console.log(`\n✅ Seeding complete! Indexed ${totalChunks} chunks from ${knowledgeBase.length} articles.`);
}

// Check if knowledge base already has data
async function checkExistingData(): Promise<boolean> {
  const { data, error } = await supabase
    .from('knowledge_chunks')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error checking existing data:', error);
    return false;
  }

  return (data?.length || 0) > 0;
}

async function main() {
  try {
    const hasData = await checkExistingData();
    
    if (hasData) {
      console.log('⚠️  Knowledge base already contains data.');
      console.log('   Run this script again to add more content.');
      console.log('   (Existing data will not be deleted)\n');
    }

    await seedKnowledgeBase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();

