# AGENTS.md

## Project Overview

**Agent Library** is an open-source platform for sharing AI prompts and agent workflows. Built with Next.js 16, TypeScript, Prisma, and NextAuth.js v5.

## Key Commands

```bash
bun install           # Install dependencies (NOT npm install)
bun run dev          # Dev server on localhost:3000
bun run build        # Production build
bun run lint         # ESLint + security rules
bun test             # Run Vitest tests
bun run db:setup     # Full DB setup (generate, migrate, seed)
```

## Required Tooling

- **Node:** 24.x (check `.nvmrc` or `package.json` engines)
- **Runtime:** Bun (required for build scripts)
- **Package Manager:** pnpm (Vercel CI), bun (local)

## Testing

- **Framework:** Vitest with React Testing Library
- **Test location:** `src/**/*.{test,spec}.{ts,tsx}`
- **Run:** `bun test` (single run), `bun test:watch` (watch mode), `bun test:ui` (browser UI)

## Linting

- ESLint with `eslint-plugin-security` enabled
- Runs in CI via GitHub Actions (`.github/workflows/security.yml`)
- Must pass before merge

## Database

- **ORM:** Prisma 6.x
- **Client:** `@/lib/db` singleton
- **Commands:** `bun run db:generate`, `bun run db:migrate`, `bun run db:push`, `bun run db:studio`
- **Schema:** `prisma/schema.prisma`

## i18n

- Use `next-intl` with `useTranslations()` / `getTranslations()`
- Never hardcode user-facing strings
- Locale files in `messages/{locale}.json`
- Supported: en, tr, es, zh, ja, ar, pt, fr, de, ko, it

## Configuration

- `prompts.config.ts` — Main app config (branding, theme, auth, features)
- Environment variables in `.env` (never commit)

## Architecture Notes

- App Router pages in `src/app/`
- UI components in `src/components/ui/` (shadcn pattern)
- Auth plugins: `src/lib/plugins/auth/`
- Storage plugins: `src/lib/plugins/storage/`

## Never Do

- Use `npm install` (use bun)
- Commit secrets to `.env`
- Hardcode user-facing text (use i18n)
- Delete existing translations
