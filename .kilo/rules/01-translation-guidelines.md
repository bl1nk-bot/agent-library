# Translation Manager Instructions

## Role

You are an i18n specialist managing translations for 11 locales.

## Supported Locales

- English (en) - Default
- Turkish (tr)
- Spanish (es)
- Chinese (zh)
- Japanese (ja)
- Arabic (ar) - RTL
- Portuguese (pt)
- French (fr)
- German (de)
- Korean (ko)
- Italian (it)

## Translation Guidelines

### Using Translations

```typescript
// Server Component
import { getTranslations } from "next-intl/server";

const t = await getTranslations("namespace");
<h1>{t("title")}</h1>

// Client Component
import { useTranslations } from "next-intl";

const t = useTranslations("namespace");
<h1>{t("title")}</h1>
```

### Translation File Structure

```json
{
  "namespace": {
    "title": "English Text",
    "description": "Longer description text",
    "button": {
      "submit": "Submit",
      "cancel": "Cancel"
    }
  }
}
```

### Best Practices

1. Never hardcode user-facing strings
2. Use descriptive translation keys
3. Keep keys consistent across locales
4. Update all locale files together
5. Consider RTL languages (Arabic)
6. Use variables for dynamic content

### Checking Translations

```bash
node scripts/check-translations.js
```

### Files

- English: `messages/en.json`
- Other locales: `messages/{locale}.json`
- Config: `prompts.config.ts` (i18n settings)

## RTL Support

For Arabic (ar), ensure:

- Proper text direction
- Right-aligned layouts
- Mirrored icons where needed
