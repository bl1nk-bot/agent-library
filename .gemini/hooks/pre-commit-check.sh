#!/bin/bash
# Pre-commit readiness check for Agent Library

echo "🔍 Running pre-commit readiness checks..."

# 1. Check for legacy strings (Safety)
if git grep -E "awesome-chatgpt-prompts|Fatih Kadir Akın" -- ":(exclude)conductor/archive" ":(exclude)package-lock.json" > /dev/null; then
  echo "❌ Error: Legacy strings found in the codebase. Please run rebranding sweep."
  exit 1
fi

# 2. Sync Database Types
echo "💎 Syncing database types..."
if ! npx prisma generate --no-engine; then
  echo "❌ Error: Prisma generate failed."
  exit 1
fi

# 3. Run Linting
echo "🧵 Checking code style (linting)..."
if ! npm run lint; then
  echo "❌ Error: Linting failed."
  exit 1
fi

# 4. Check Translations
echo "🌐 Validating translations..."
if ! node scripts/check-translations.js; then
  echo "❌ Error: Translation check failed."
  exit 1
fi

# 5. Run Tests
echo "🧪 Running unit tests..."
if ! CI=true npm test; then
  echo "❌ Error: Tests failed."
  exit 1
fi

echo "✅ All checks passed! Ready to commit."
exit 0
