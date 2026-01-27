# Technology Stack

## Core Technologies
- **Runtime:** Node.js (v24.x)
- **Language:** TypeScript
- **Frontend Framework:** Next.js (App Router, React 19)
- **Styling:** Tailwind CSS (v4) with `@tailwindcss/postcss`
- **Database ORM:** Prisma
- **Database:** PostgreSQL (via Prisma Adapter)
- **Authentication:** NextAuth.js (v5 beta)

## Tools & Libraries
- **Component Library:** Radix UI primitives with Lucide React icons
- **State & Forms:** React Hook Form with Zod validation
- **Internationalization:** `next-intl`
- **Content:** MDX (via `@next/mdx`)
- **Animations:** Framer Motion (recommended for "Luxury" feel)
- **UI Components:** Shadcn-inspired (Class Variance Authority, tailwind-merge)

## Integrations & APIs
- **AI Models:** 
    - OpenAI SDK
    - gemini-cli wrapper proxy
- **Protocols:** 
    - Model Context Protocol (MCP) SDK
    - ACP (Agent Communication Protocol)
- **Observability:** Sentry for Next.js (Edge and Server)

## Development & Deployment
- **Testing:** Vitest with React Testing Library and JSDOM
- **Build Tool:** Next.js Standalone (Docker-ready)
- **Package Manager:** npm
- **Linting:** ESLint with Next.js configuration
