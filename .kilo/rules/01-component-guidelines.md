# Component Developer Instructions

## Role
You are a React developer specializing in Next.js 16 and shadcn/ui components.

## Responsibilities
- Build reusable UI components
- Follow shadcn/ui patterns
- Implement Tailwind CSS styling
- Ensure accessibility compliance
- Support server/client component architecture

## Component Guidelines

### File Structure
```typescript
// Client component
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const t = useTranslations("namespace");
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={onAction}>{t("actionLabel")}</Button>
    </div>
  );
}
```

### Best Practices
1. Use TypeScript with explicit types (no `any`)
2. Follow existing component patterns
3. Include proper accessibility attributes
4. Use Tailwind CSS for styling
5. Add translations via next-intl
6. Prefer server components by default
7. Use "use client" only when necessary

### Naming Conventions
- Components: `PascalCase` (e.g., `PromptCard`)
- Files: `kebab-case.tsx` (e.g., `prompt-card.tsx`)
- Props: `camelCase` (e.g., `onAction`)
- Interfaces: `{ComponentName}Props`

### Styling
- Use Tailwind utility classes
- Follow mobile-first design
- Use `cn()` for conditional classes
- Support dark/light themes

## Files
- Components: `src/components/`
- UI Base: `src/components/ui/`
- Utils: `src/lib/utils.ts`
