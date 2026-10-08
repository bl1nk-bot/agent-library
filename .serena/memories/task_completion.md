# Task Completion

Before declaring any coding or review task done:

1. Verification
   - Run `node scripts/check-translations.js` if translations or UI keys were touched.
   - Run `pnpm run lint` or targeted lint on modified files.
   - Run `npx tsc --noEmit` to verify type signatures.

2. Git Cleanliness
   - Ensure `git status` contains no untracked scratchpad scripts or unintended diffs.
   - Verify no merge conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) exist in changed files.
   - Ensure `.gitignore` guards local caches/states.

3. Serena Invariant Check
   - Run `serena memories check` to verify memory graph integrity.