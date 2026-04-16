## 2024-05-24 - Array.find in loops causes O(N*M) lookups
**Learning:** In Next.js server actions / API routes, resolving multiple IDs to their metadata (like tags or categories) inside loops via `Array.find` or `Array.filter` leads to O(N*M) performance bottlenecks. This was noticeably inefficient when building contextual tool prompts inside agent loops.
**Action:** Always pre-compute a `Map` indexed by `id` or `name.toLowerCase()` for source arrays before iterating over items to achieve ~40x-70x performance gain (O(N+M)). Use `new Map(items.map(i => [i.id, i]))` to group independent tasks.
