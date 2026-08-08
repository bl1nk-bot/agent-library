1. **Fix missing aria-hidden="true" on SVG icons in custom interactive elements**
   - In `src/components/layout/sidebar.tsx`, add `aria-hidden="true"` to `<Globe size={20} />` and `<Terminal size={16} className="text-agent-cyan" />`.
   - In `src/components/layout/sidebar.tsx`, add `aria-hidden="true"` to `<item.icon size={20} />`.
   - In `src/components/layout/header.tsx`, add `aria-hidden="true"` to `<Menu className="h-4 w-4" />` and `<MoreHorizontal className="h-4 w-4" />` inside the icon-only buttons for the mobile menu and more options dropdown.
   - In `src/components/layout/header.tsx`, add `aria-hidden="true"` to `<Globe className="h-4 w-4" />` inside the toggle language button for non-logged-in users.
2. **Fix missing focus-visible styling on custom buttons**
   - In `src/components/layout/sidebar.tsx`, add `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-agent-cyan` to the `Toggle Language` button.
   - In `src/components/layout/sidebar.tsx`, add `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-agent-cyan` to the navigation `Link` items (`<nav className="...">...<Link>...</Link>...</nav>`).
3. **Run Pre-Commit Checks**
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
