# Prompts.chat Development Mode

## Project Overview

**prompts.chat** is a social platform for AI prompts built with Next.js 16. It allows users to share, discover, and collect prompts from the community.

### Tech Stack

- **Framework:** Next.js 16.0.7 (App Router) with React 19.2
- **Language:** TypeScript 5 (strict mode)
- **Database:** PostgreSQL with Prisma ORM 6.19
- **Authentication:** NextAuth.js 5 (beta) with pluggable providers
- **Styling:** Tailwind CSS 4 with Radix UI primitives
- **UI Components:** shadcn/ui pattern
- **Internationalization:** next-intl with 11 supported locales
- **Icons:** Lucide React
- **Forms:** React Hook Form with Zod validation

## Key Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run lint             # Run ESLint

# Database
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database

# Testing
npm test                 # Run Vitest tests
```

## Code Style Guidelines

### TypeScript
- Use strict mode
- Prefer explicit types over `any`
- Use `interface` for object shapes, `type` for unions/intersections
- Functions: `camelCase` (e.g., `getUserData`)
- Components: `PascalCase` (e.g., `PromptCard`)
- Files: `kebab-case.tsx` for components, `camelCase.ts` for utilities

### React/Next.js
- Use React Server Components by default
- Add `"use client"` only when client interactivity is needed
- Prefer server actions over API routes for mutations
- Use `next-intl` for all user-facing strings
- Import translations with `useTranslations()` or `getTranslations()`

### Styling
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Prefer Radix UI primitives via shadcn/ui components

### Database
- Use Prisma Client from `@/lib/db`
- Always include proper `select` or `include` for relations
- Use transactions for multi-step operations
- Add indexes for frequently queried fields

## Project Structure

```
/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── messages/               # i18n translation files
├── src/
│   ├── app/                # Next.js App Router pages
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui base components
│   │   └── ...             # Feature-specific components
│   ├── lib/                # Utility libraries
│   └── i18n/               # Internationalization setup
├── prompts.config.ts       # Main application configuration
└── package.json
```

## Common Tasks

### Adding a new page
1. Create route in `src/app/{route}/page.tsx`
2. Use server component for data fetching
3. Add translations to `messages/*.json`

### Adding a new component
1. Create in appropriate `src/components/{category}/` folder
2. Export from component file
3. Follow existing component patterns

### Adding a new API route
1. Create in `src/app/api/{route}/route.ts`
2. Export appropriate HTTP method handlers
3. Use Zod for request validation
4. Return proper JSON responses with status codes

### Modifying database schema
1. Update `prisma/schema.prisma`
2. Run `npm run db:migrate` to create migration
3. Update related TypeScript types if needed

## Testing

- Tests are written with Vitest
- Place tests adjacent to source files or in `__tests__/` directories
- Use descriptive test names
- Mock external services (database, OAuth)

## Configuration

The main configuration file is `prompts.config.ts`:
- **branding:** Logo, name, and description
- **theme:** Colors, border radius, UI variant
- **auth:** Authentication providers array
- **i18n:** Supported locales and default locale
- **features:** Feature flags

## Plugin System

### Auth Plugins (`src/lib/plugins/auth/`)
- `credentials.ts` - Email/password authentication
- `github.ts` - GitHub OAuth
- `google.ts` - Google OAuth
- `azure.ts` - Microsoft Entra ID

### Storage Plugins (`src/lib/plugins/storage/`)
- `url.ts` - URL-based media (default)
- `s3.ts` - AWS S3 storage

## Internationalization

- Translation files are in `messages/{locale}.json`
- Currently supported: en, tr, es, zh, ja, ar, pt, fr, de, ko, it
- Add new locales to `prompts.config.ts` i18n.locales array
- Create corresponding translation file in `messages/`

## Environment Variables

Required in `.env`:
```
DATABASE_URL=           # PostgreSQL connection string
AUTH_SECRET=            # NextAuth secret key
```

Optional OAuth and features:
```
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
OPENAI_API_KEY=         # For AI-powered semantic search
```

## Important Notes

- NEVER commit secrets or API keys
- Run `npm run lint` before committing
- Use existing UI components from `src/components/ui/`
- Add translations for all user-facing text
- Follow existing code patterns and file structure
- Database schema changes require migrations
