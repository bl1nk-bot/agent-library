# Agent Library Constitution

## Core Principles

### I. Library-First
Every feature starts as a standalone module in src/lib/ or src/components/; utilities must be self-contained, independently testable, and documented; shared code goes in common utilities, not duplicated.

### II. TypeScript Strict
TypeScript strict mode required throughout; no implicit `any`; explicit types on all function signatures, return types, and props; use interfaces for object shapes.

### III. Test-First (NON-NEGOTIABLE)
All new features require tests; use Vitest with React Testing Library; test location: src/__tests__/ or adjacent to source file with .test.{ts,tsx} suffix.

### IV. i18n Required
All user-facing strings must use next-intl translations (useTranslations/getTranslations); never hardcode text in components; add translations to messages/*.json files.

### V. Security Linting
ESLint with eslint-plugin-security must pass on all PRs; never silence lint errors with `|| true` or `set +e`; fixes must be applied, not ignored.

## Development Workflow

Code review required for all PRs; lint must pass; tests required for new functionality; follow existing file patterns in src/app/ and src/components/.

## Governance

Constitution supersedes all other practices; amendments require PR with documentation; version bump: MAJOR for breaking principles, MINOR for new principles, PATCH for clarifications.

**Version**: 1.0.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-04-22