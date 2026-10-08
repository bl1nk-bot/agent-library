# Tech Stack

- Runtime: Node.js (ESM, type=module)
- Framework: Next.js 16 (App Router), React 19
- Language: TypeScript 5
- Database & ORM: PostgreSQL, Prisma 6 (`prisma/schema.prisma`)
- Internationalization: `next-intl` (JSON dictionaries in `messages/`)
- Styling: Tailwind CSS, `clsx`, `tailwind-merge` (`src/lib/utils.ts:cn`)
- Auth: NextAuth v5 (`@auth/prisma-adapter`)
- Package Manager: `pnpm` (lockfile version 9.0)