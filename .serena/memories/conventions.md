# Conventions

## Architecture & Components
- Server Components by default; add `"use client"` only when hook/event handlers needed.
- Base UI from `src/components/ui/` (shadcn-compatible).
- Styling strictly via Tailwind utilities + `cn()` helper; no custom CSS file addition.

## Internationalization & Accessibility (i18n & a11y)
- All user-facing strings must use `useTranslations()` or `getTranslations()` from `next-intl`.
- No hardcoded English labels in buttons, tooltips, or aria attributes.
- Interactive icon-only buttons must have `aria-label` localized via `t(...)` and `aria-hidden="true"` on decorative icons (`lucide-react`).
- Keys added in `messages/en.json` must be reflected across supported languages.

## Git & Workflow
- Safe commits only; avoid destructive commands (`git reset --hard`).
- Exclude personal local environment configs and scratchpad files from commits (`.omg/state/`, temp scripts).