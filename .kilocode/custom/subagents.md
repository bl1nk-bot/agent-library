# SubAgent Configuration for Prompts.chat

## Available SubAgents

### 1. **Test Agent** (`test-agent`)
**Purpose:** Run and create tests for the prompts.chat platform

**Capabilities:**
- Run existing tests with `npm test`
- Create new test files following Vitest patterns
- Fix failing tests
- Add test coverage for new features

**Usage:**
```
/test-agent run tests
/test-agent create test for [component]
/test-agent fix failing tests
```

**Context:**
- Tests are in `src/__tests__/` directories
- Use Vitest framework
- Mock Prisma and NextAuth
- Follow existing test patterns

---

### 2. **Database Agent** (`db-agent`)
**Purpose:** Manage database schema, migrations, and Prisma operations

**Capabilities:**
- Update Prisma schema
- Create and run migrations
- Seed database with test data
- Optimize database queries
- Add indexes for performance

**Usage:**
```
/db-agent add field [model] [field]
/db-agent create migration [name]
/db-agent seed data
/db-agent optimize query
```

**Context:**
- Schema in `prisma/schema.prisma`
- Migrations in `prisma/migrations/`
- Use Prisma Client from `@/lib/db`
- Always run `npm run db:generate` after schema changes

---

### 3. **Component Agent** (`component-agent`)
**Purpose:** Create and maintain React components

**Capabilities:**
- Create new UI components
- Update existing components
- Ensure accessibility compliance
- Add responsive design
- Follow shadcn/ui patterns

**Usage:**
```
/component-agent create [component-name]
/component-agent update [component-name]
/component-agent fix accessibility
```

**Context:**
- Components in `src/components/`
- Base UI in `src/components/ui/`
- Use Tailwind CSS for styling
- Support server/client components
- Include translations via next-intl

---

### 4. **API Agent** (`api-agent`)
**Purpose:** Manage API routes and server actions

**Capabilities:**
- Create new API endpoints
- Update existing routes
- Add request validation with Zod
- Implement proper error handling
- Add rate limiting

**Usage:**
```
/api-agent create endpoint [path]
/api-agent add validation [endpoint]
/api-agent fix error handling
```

**Context:**
- API routes in `src/app/api/`
- Use server actions for mutations
- Validate with Zod schemas
- Return proper JSON responses
- Include authentication checks

---

### 5. **Translation Agent** (`i18n-agent`)
**Purpose:** Manage internationalization and translations

**Capabilities:**
- Add new locale support
- Update translation files
- Check for missing translations
- Validate translation keys
- Run translation checks

**Usage:**
```
/i18n-agent add locale [language]
/i18n-agent check missing
/i18n-agent validate keys
```

**Context:**
- Translations in `messages/{locale}.json`
- 11 supported locales
- Use next-intl for all user-facing strings
- Run `node scripts/check-translations.js` to validate

---

### 6. **Security Agent** (`security-agent`)
**Purpose:** Ensure code security and best practices

**Capabilities:**
- Review code for security issues
- Fix linting errors
- Add authentication checks
- Implement rate limiting
- Validate user input

**Usage:**
```
/security-agent review [file]
/security-agent fix vulnerabilities
/security-agent add auth check
```

**Context:**
- Security policies in `SECURITY.md`
- Use Zod for validation
- Implement CSRF protection
- Sanitize user input
- Follow OWASP guidelines

---

### 7. **Documentation Agent** (`docs-agent`)
**Purpose:** Maintain project documentation

**Capabilities:**
- Update README.md
- Create feature documentation
- Update API documentation
- Generate changelogs
- Maintain AGENTS.md

**Usage:**
```
/docs-agent update readme
/docs-agent create docs for [feature]
/docs-agent generate changelog
```

**Context:**
- Documentation in root and `docs/` folder
- Keep AGENTS.md updated
- Document all public APIs
- Include usage examples

---

## Custom Mode Workflows

### Feature Development Workflow
1. **component-agent** creates UI components
2. **api-agent** creates backend endpoints
3. **db-agent** updates database schema
4. **test-agent** adds test coverage
5. **i18n-agent** adds translations
6. **security-agent** reviews for issues
7. **docs-agent** updates documentation

### Bug Fix Workflow
1. **test-agent** reproduces the bug
2. **component-agent** or **api-agent** fixes the issue
3. **test-agent** verifies the fix
4. **security-agent** ensures no regressions
5. **docs-agent** updates if needed

### Database Migration Workflow
1. **db-agent** updates schema
2. **db-agent** creates migration
3. **component-agent** updates affected components
4. **api-agent** updates affected APIs
5. **test-agent** adds migration tests

---

## Agent Communication

Agents can pass context to each other using:
- File paths for code changes
- Test names for verification
- Migration names for database changes
- Translation keys for i18n work

## Best Practices

1. **Always run tests** after making changes
2. **Check linting** before committing
3. **Add translations** for user-facing text
4. **Update documentation** for new features
5. **Review security** implications
6. **Use TypeScript** strict types
7. **Follow existing patterns** in the codebase

---

## Emergency Commands

```
/stop-all-agents - Stop all running agents
/reset-context - Clear agent context
/rollback - Revert last changes
/health-check - Verify system status
```

---

## Notes

- Agents work collaboratively on complex tasks
- Each agent specializes in its domain
- Context is shared between agents
- All changes should be tested before committing
- Follow the project's coding conventions
- Use existing UI components when possible
