## 2025-04-10 - Dynamic ARIA Labels on Icon-only Buttons
**Learning:** When applying `aria-label` to buttons that contain dynamically updated visual content (e.g., a notification badge count), the `aria-label` completely overrides the inner content for screen readers. A simple static label like 'Notifications' will mask the dynamic count.
**Action:** Construct a comprehensive `aria-label` combining both the title and the dynamic value (e.g., 'Notifications (5 unread)'), and hide the visible dynamic content using `aria-hidden="true"`.

## 2025-01-20 - Adding Tooltips and ARIA labels to Icon-only Buttons
**Learning:** Icon-only buttons (like Eye/EyeOff and Copy in `ApiKeySettings`) require both visual tooltips for sighted users and `aria-label`s for screen reader users. Additionally, purely decorative `lucide-react` icons must be explicitly hidden from screen readers using `aria-hidden="true"`.
**Action:** Always wrap icon-only buttons in `Tooltip` components, add `aria-label` directly on the `Button`, and ensure the child icon has `aria-hidden="true"`.
