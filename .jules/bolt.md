## 2026-04-30 - O(N*M) bottleneck in tag filtering
**Learning:** Calling `.map().includes()` inside a `.filter()` loop recreates an array via `.map` and performs an O(M) `.includes` search for every single tag name (N iterations), leading to O(N*M) performance bottlenecks and excessive array allocations.
**Action:** Convert the target array to a `Set` before the `.filter` loop to enable O(1) `.has()` lookups, changing the operation from O(N*M) to O(N+M).
