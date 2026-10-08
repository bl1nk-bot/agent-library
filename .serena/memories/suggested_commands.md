# Suggested Commands

## Package Manager
- `pnpm install`: Install dependencies.
- `pnpm run dev`: Start Next.js development server.
- `pnpm run build`: Prisma generate + Next.js build.

## Database (Prisma)
- `npm run db:migrate`: Run Prisma migrations.
- `npm run db:push`: Push Prisma schema to DB without migration files.
- `npm run db:studio`: Open Prisma Studio web inspector.

## Quality & Checks
- `pnpm run lint`: Run ESLint.
- `pnpm run typecheck` (`npx tsc --noEmit`): TypeScript compile check.
- `node scripts/check-translations.js`: Check missing translation keys across `messages/*.json`.