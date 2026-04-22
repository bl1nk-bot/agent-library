## 2025-04-10 - Dynamic ARIA Labels on Icon-only Buttons
**Learning:** When applying `aria-label` to buttons that contain dynamically updated visual content (e.g., a notification badge count), the `aria-label` completely overrides the inner content for screen readers. A simple static label like 'Notifications' will mask the dynamic count.
**Action:** Construct a comprehensive `aria-label` combining both the title and the dynamic value (e.g., 'Notifications (5 unread)'), and hide the visible dynamic content using `aria-hidden="true"`.
