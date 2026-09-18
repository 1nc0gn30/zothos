# Lead Modal

## Behavior

- Triggers after **3.5 seconds** on first page load
- Uses `sessionStorage` key `eliteconnect-lead-modal` to prevent repeat
- Closes via:
  - Close button (top-right)
  - Backdrop click
  - Escape key
- Restores body scroll on close

## Design

- Full-screen backdrop with `backdrop-filter: blur(6px)`
- Centered panel, max-width `540px`
- Panel enters with `translateY(16px) scale(0.97)` → normal
- Close button rotates 90° on hover

## Form Fields

| Field | Type | Required |
|---|---|---|
| Name | text | yes |
| Phone | tel | yes |
| Email | email | yes |
| I am a | select | yes |
| Service need | select | yes |

## Inline Success

After successful submit:
1. Form body hides
2. Success overlay shows with:
   - Checkmark icon (brand blue circle)
   - "Request sent." headline
   - "Elite Connect will follow up within one business day."
   - Close button

## Component File

`src/components/LeadModal.astro`

## Related

- [[05-Forms-Functionality/Netlify-Forms\|Netlify Forms]]
- [[03-Components/Component-Inventory\|Component Inventory]]
