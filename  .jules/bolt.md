## 2024-05-24 - Array.find in loops causes O(N\*M) lookups

**Learning:** In Next.js server actions / API routes, resolving multiple IDs to their metadata (like tags or categories) inside loops via `Array.find` or `Array.filter` leads to O(N\*M) performance bottlenecks. This was noticeably inefficient when building contextual tool prompts inside agent loops.
**Action:** Always pre-compute a `Map` indexed by `id` or `name.toLowerCase()` for source arrays before iterating over items to achieve ~40x-70x performance gain (O(N+M)). Use `new Map(items.map(i => [i.id, i]))` to group independent tasks.

## 2026-04-16 - [React State Initialization in Effects]

**Learning:** `eslint-plugin-react-compiler` enforces strict rules against synchronous state updates within `useEffect`. Setting state immediately on mount (e.g. `useEffect(() => setState(val), [])`) triggers cascading renders and is an anti-pattern.
**Action:** When a state value depends on a browser API (like `localStorage` or `window`), initialize the state lazily using a function (e.g. `useState(() => getCookieConsent())`) or compute it during render if it doesn't cause hydration mismatches, rather than relying on an effect.
