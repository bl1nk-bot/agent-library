# agent-library Constitution

## Core Principles

### I. DevOps-First & Automation

Development workflows MUST be centralized via the `Makefile` and `npm` scripts. All PRs MUST pass the CI pipeline (Lint, Typecheck, Test, i18n sync). No manual bypass of quality gates is permitted.

### II. UI/UX & Aesthetic Excellence

Interfaces MUST feel premium, responsive, and modern. Use Tailwind CSS 4, Radix UI primitives, and shadcn/ui patterns. Hardcoded strings are forbidden; all user-facing text MUST use `next-intl` localization.

### III. Security & Data Integrity

All API endpoints MUST implement strict Zod schema validation for input and output. Database changes MUST be managed through Prisma Migrations with descriptive naming. Authentication and session checks are mandatory for sensitive operations.

### IV. Integration Testing

Focus areas requiring integration tests: New library contract tests, Contract changes, Inter-service communication, Shared schemas.

### V. Automated Dependency Management

Dependency updates MUST be managed via Renovate. Major version updates require manual architectural review and test validation, while non-major devDependencies are prioritized for automation to ensure the stack remains modern and secure.

### VI. Type-Safe Architecture

TypeScript strict mode is non-negotiable. Avoid `any` types; prefer explicit interfaces and unions. Logic should be modular, following the plugin architecture for auth and storage providers.

### VII. Localization Synchronization

The project supports 18 languages. Every new feature adding user-facing text MUST update all 18 translation files (`messages/*.json`) to ensure full synchronization across the platform.

## Quality Standards

### Performance Standards

- Server components by default to minimize client-side JS.
- Optimized images via Next.js `Image` and WebP format.
- Database indexes on frequently queried fields.

### Testing Discipline

- Unit tests mandatory for core logic (`lib/`, `hooks/`).
- Integration tests for API routes.
- Component testing for complex UI logic.

## Governance

### Amendment Procedure

Amendments to this constitution require a version bump and documentation in the `walkthrough.md`. Major architectural shifts must be reflected here first.

### Versioning Policy

Follow Semantic Versioning (SemVer).

- MAJOR: Architectural redefinitions or principle removals.
- MINOR: New principles or major feature categories added.
- PATCH: Refinements, clarifications, and non-semantic updates.

**Version**: 1.0.0 | **Ratified**: 2026-04-24 | **Last Amended**: 2026-04-24
