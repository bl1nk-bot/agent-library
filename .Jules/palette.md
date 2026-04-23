## 2025-04-10 - Dynamic ARIA Labels on Icon-only Buttons
**Learning:** When applying `aria-label` to buttons that contain dynamically updated visual content (e.g., a notification badge count), the `aria-label` completely overrides the inner content for screen readers. A simple static label like 'Notifications' will mask the dynamic count.
**Action:** Construct a comprehensive `aria-label` combining both the title and the dynamic value (e.g., 'Notifications (5 unread)'), and hide the visible dynamic content using `aria-hidden="true"`.
## 2024-05-15 - Absolute Actions Masking Keyboard Focus
**Learning:** Actions that are visually revealed only via hover (`group-hover:opacity-100`) often remain invisible when receiving keyboard focus, making the interface completely inaccessible for keyboard users who tab to the element but cannot see it.
**Action:** When using hover states to reveal hidden controls, always pair them with `:focus-visible` states (e.g., `focus-visible:opacity-100`) to ensure the controls become visible when navigating via keyboard.
