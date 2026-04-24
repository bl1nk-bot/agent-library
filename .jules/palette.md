## 2025-04-10 - Dynamic ARIA Labels on Icon-only Buttons

**Learning:** When applying `aria-label` to buttons that contain dynamically updated visual content (e.g., a notification badge count), the `aria-label` completely overrides the inner content for screen readers. A simple static label like 'Notifications' will mask the dynamic count.
**Action:** Construct a comprehensive `aria-label` combining both the title and the dynamic value (e.g., 'Notifications (5 unread)'), and hide the visible dynamic content using `aria-hidden="true"`.

## 2024-04-17 - Improve API Key Accessibility
**Learning:** Found an accessibility issue pattern with icon-only buttons in `src/components/settings/api-key-settings.tsx`. The "Show/Hide API Key" and "Copy API Key" buttons used icons without proper screen reader accessible labels (`aria-label`) and didn't hide the decorative icons (`aria-hidden="true"`).
**Action:** Always verify icon-only buttons (`size="icon"`) include `aria-label` and `aria-hidden="true"` on the underlying `<svg>`/Lucide icons. Make use of `t()` functions with clear translation strings.
