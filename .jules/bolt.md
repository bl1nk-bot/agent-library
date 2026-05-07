## 2026-04-30 - Optimize Prompt Builder Available Categories Lookups
**Learning:** Resolving IDs to metadata by using `.find` inside loops, or using `.includes` inside loops for string matching against a mapped array, can lead to O(N*M) operations per lookup.
**Action:** Always convert source arrays to `Map` objects indexed by ID or slug, or to `Set` objects for inclusion matching outside loops. This changes the complexity from O(N*M) to O(N+M), yielding substantial performance gains especially on larger datasets.
