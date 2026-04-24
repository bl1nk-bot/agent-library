## 2026-04-16 - [React State Initialization in Effects]
**Learning:** `eslint-plugin-react-compiler` enforces strict rules against synchronous state updates within `useEffect`. Setting state immediately on mount (e.g. `useEffect(() => setState(val), [])`) triggers cascading renders and is an anti-pattern.
**Action:** When a state value depends on a browser API (like `localStorage` or `window`), initialize the state lazily using a function (e.g. `useState(() => getCookieConsent())`) or compute it during render if it doesn't cause hydration mismatches, rather than relying on an effect.
