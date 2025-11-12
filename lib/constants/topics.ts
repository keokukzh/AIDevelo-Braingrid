export interface Subtopic {
  id: string;
  title: string;
  description: string;
  resources: Array<{ label: string; url: string }>;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  subtopics: Subtopic[];
}

export const topics: Topic[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Build beautiful and interactive user interfaces',
    subtopics: [
      {
        id: 'html-css-js',
        title: 'HTML/CSS/JS/TS',
        description: 'Core web technologies and TypeScript fundamentals',
        resources: [
          { label: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
          { label: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
        ],
      },
      {
        id: 'react-next',
        title: 'React/Next/Tailwind',
        description: 'Modern React development with Next.js and Tailwind CSS',
        resources: [
          { label: 'React Docs', url: 'https://react.dev/' },
          { label: 'Next.js Docs', url: 'https://nextjs.org/docs' },
        ],
      },
      {
        id: 'motion',
        title: 'Motion & Animation',
        description: 'Creating smooth animations and transitions',
        resources: [
          { label: 'Framer Motion', url: 'https://www.framer.com/motion/' },
        ],
      },
      {
        id: 'a11y',
        title: 'Accessibility (A11Y)',
        description: 'Building accessible web applications',
        resources: [
          { label: 'WCAG Guidelines', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Server-side development and APIs',
    subtopics: [
      {
        id: 'node-express',
        title: 'Node/Express',
        description: 'JavaScript backend development',
        resources: [
          { label: 'Express.js', url: 'https://expressjs.com/' },
        ],
      },
      {
        id: 'fastapi',
        title: 'FastAPI',
        description: 'Modern Python web framework',
        resources: [
          { label: 'FastAPI Docs', url: 'https://fastapi.tiangolo.com/' },
        ],
      },
      {
        id: 'apis',
        title: 'REST/GraphQL/WebSocket',
        description: 'API design and real-time communication',
        resources: [
          { label: 'REST API Tutorial', url: 'https://restfulapi.net/' },
          { label: 'GraphQL', url: 'https://graphql.org/' },
        ],
      },
      {
        id: 'auth',
        title: 'Authentication',
        description: 'User authentication and authorization',
        resources: [
          { label: 'OWASP Auth Guide', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
        ],
      },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Data storage and management',
    subtopics: [
      {
        id: 'sql',
        title: 'SQL (MySQL/Postgres)',
        description: 'Relational database fundamentals',
        resources: [
          { label: 'PostgreSQL Docs', url: 'https://www.postgresql.org/docs/' },
        ],
      },
      {
        id: 'prisma-supabase',
        title: 'Prisma/Supabase',
        description: 'Modern database tooling and platforms',
        resources: [
          { label: 'Prisma Docs', url: 'https://www.prisma.io/docs' },
          { label: 'Supabase Docs', url: 'https://supabase.com/docs' },
        ],
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI/Automation',
    description: 'Artificial intelligence and workflow automation',
    subtopics: [
      {
        id: 'openai',
        title: 'OpenAI',
        description: 'GPT models and embeddings',
        resources: [
          { label: 'OpenAI API', url: 'https://platform.openai.com/docs' },
        ],
      },
      {
        id: 'langchain',
        title: 'LangChain',
        description: 'LLM application framework',
        resources: [
          { label: 'LangChain Docs', url: 'https://python.langchain.com/' },
        ],
      },
      {
        id: 'rag',
        title: 'RAG',
        description: 'Retrieval-Augmented Generation',
        resources: [
          { label: 'RAG Paper', url: 'https://arxiv.org/abs/2005.11401' },
        ],
      },
      {
        id: 'automation',
        title: 'n8n/Zapier/Webhooks',
        description: 'Workflow automation tools',
        resources: [
          { label: 'n8n', url: 'https://docs.n8n.io/' },
        ],
      },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps',
    description: 'Infrastructure and deployment',
    subtopics: [
      {
        id: 'git',
        title: 'Git/GitHub',
        description: 'Version control and collaboration',
        resources: [
          { label: 'Git Docs', url: 'https://git-scm.com/doc' },
        ],
      },
      {
        id: 'docker',
        title: 'Docker',
        description: 'Containerization',
        resources: [
          { label: 'Docker Docs', url: 'https://docs.docker.com/' },
        ],
      },
      {
        id: 'cicd',
        title: 'CI/CD',
        description: 'Continuous integration and deployment',
        resources: [
          { label: 'GitHub Actions', url: 'https://docs.github.com/en/actions' },
        ],
      },
      {
        id: 'deployment',
        title: 'Vercel/NGINX',
        description: 'Deployment platforms and web servers',
        resources: [
          { label: 'Vercel Docs', url: 'https://vercel.com/docs' },
        ],
      },
      {
        id: 'env-secrets',
        title: 'Env/Secrets',
        description: 'Environment variables and secret management',
        resources: [
          { label: '12-Factor App', url: 'https://12factor.net/config' },
        ],
      },
    ],
  },
  {
    id: 'design',
    title: 'Design/UX',
    description: 'User experience and visual design',
    subtopics: [
      {
        id: 'figma',
        title: 'Figma',
        description: 'Design and prototyping tool',
        resources: [
          { label: 'Figma Learn', url: 'https://help.figma.com/hc/en-us' },
        ],
      },
      {
        id: 'color-typography',
        title: 'Color/Typography',
        description: 'Visual design fundamentals',
        resources: [
          { label: 'Material Design', url: 'https://material.io/design' },
        ],
      },
      {
        id: 'design-systems',
        title: 'Design Systems',
        description: 'Building consistent design systems',
        resources: [
          { label: 'Design Systems Handbook', url: 'https://www.designbetter.co/design-systems-handbook' },
        ],
      },
      {
        id: 'accessibility',
        title: 'Accessibility',
        description: 'Designing for all users',
        resources: [
          { label: 'A11y Project', url: 'https://www.a11yproject.com/' },
        ],
      },
    ],
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Business and monetization',
    subtopics: [
      {
        id: 'payments',
        title: 'Stripe/LemonSqueezy',
        description: 'Payment processing',
        resources: [
          { label: 'Stripe Docs', url: 'https://stripe.com/docs' },
        ],
      },
      {
        id: 'funnels',
        title: 'Funnels',
        description: 'Conversion optimization',
        resources: [
          { label: 'Funnel Optimization', url: 'https://www.hotjar.com/funnel-analysis/' },
        ],
      },
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'Data-driven decision making',
        resources: [
          { label: 'Google Analytics', url: 'https://analytics.google.com/' },
        ],
      },
      {
        id: 'crm',
        title: 'CRM/Retention',
        description: 'Customer relationship management',
        resources: [
          { label: 'CRM Basics', url: 'https://www.salesforce.com/resources/articles/what-is-crm/' },
        ],
      },
    ],
  },
  {
    id: 'marketing',
    title: 'Marketing',
    description: 'Growth and content marketing',
    subtopics: [
      {
        id: 'seo',
        title: 'SEO',
        description: 'Search engine optimization',
        resources: [
          { label: 'Google SEO Guide', url: 'https://developers.google.com/search/docs/beginner/seo-starter-guide' },
        ],
      },
      {
        id: 'content',
        title: 'Content Marketing',
        description: 'Creating valuable content',
        resources: [
          { label: 'Content Marketing Institute', url: 'https://contentmarketinginstitute.com/' },
        ],
      },
      {
        id: 'social',
        title: 'TikTok/YouTube',
        description: 'Social media marketing',
        resources: [
          { label: 'TikTok Creator Portal', url: 'https://www.tiktok.com/creators/' },
        ],
      },
      {
        id: 'community',
        title: 'Community',
        description: 'Building and engaging communities',
        resources: [
          { label: 'Community Building', url: 'https://www.communityroundtable.com/' },
        ],
      },
    ],
  },
  {
    id: 'game',
    title: 'Game/Live',
    description: 'Game development and live streaming',
    subtopics: [
      {
        id: 'engines',
        title: 'Unity/Unreal/Roblox',
        description: 'Game engines and platforms',
        resources: [
          { label: 'Unity Learn', url: 'https://learn.unity.com/' },
        ],
      },
      {
        id: 'obs',
        title: 'OBS/Stream Overlays',
        description: 'Live streaming setup',
        resources: [
          { label: 'OBS Studio', url: 'https://obsproject.com/' },
        ],
      },
      {
        id: 'events',
        title: 'Event Mapping',
        description: 'Real-time event handling',
        resources: [
          { label: 'WebSocket API', url: 'https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API' },
        ],
      },
    ],
  },
  {
    id: 'mindset',
    title: 'Mindset',
    description: 'Productivity and personal development',
    subtopics: [
      {
        id: 'deep-work',
        title: 'Deep Work',
        description: 'Focused, distraction-free work',
        resources: [
          { label: 'Deep Work by Cal Newport', url: 'https://www.calnewport.com/books/deep-work/' },
        ],
      },
      {
        id: 'review',
        title: 'Weekly Review',
        description: 'Reflection and planning',
        resources: [
          { label: 'GTD Weekly Review', url: 'https://gettingthingsdone.com/what-is-the-weekly-review/' },
        ],
      },
      {
        id: 'energy',
        title: 'Energy Management',
        description: 'Optimizing your energy and focus',
        resources: [
          { label: 'Energy Management', url: 'https://hbr.org/2007/10/manage-your-energy-not-your-time' },
        ],
      },
    ],
  },
];

