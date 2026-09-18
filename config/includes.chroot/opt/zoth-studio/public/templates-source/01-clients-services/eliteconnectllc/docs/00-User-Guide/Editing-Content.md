# Editing Content

## The One File That Rules Them All

**`src/data/site.ts`** contains almost all the content that appears on multiple pages:

- Contact info (phone, email, address)
- Navigation links
- Service descriptions
- FAQ entries
- Gallery photo list
- Service area cities

## Editing Rules

1. **Use a text editor** — VS Code, Sublime Text, or even Notepad
2. **Save as plain text** — don't use Word or Google Docs
3. **Keep quotes and commas** — every line must end with a comma except the last
4. **Don't delete brackets** — `{` and `}` wrap each entry

## Example: Change the Phone Number

Before:
```typescript
phone: "804-445-9674",
```

After:
```typescript
phone: "804-555-0199",
```

## Example: Add a Service

Find the last service entry. Add a comma after its closing `},` then paste your new entry:

```typescript
  {
    title: "Network & WiFi Solutions",
    slug: "network-wifi-solutions",
    summary: "Whole-property WiFi coverage and network design.",
    points: ["WiFi coverage mapping", "Mesh systems", "Enterprise wireless", "Network security"],
  },
```

## Example: Update an FAQ Answer

Find the FAQ entry. Change only the text inside the quotes:

```typescript
{
  question: "Do you offer financing?",
  answer: "We offer flexible payment plans for projects over $5,000. Ask during your consultation.",
},
```

## Page-Specific Text

Some text only lives on one page. Edit these files directly:

| Page | File |
|---|---|
| Homepage | `src/pages/index.astro` |
| About Us | `src/pages/about-us.astro` |
| Contact | `src/pages/contact.astro` |
| Services | `src/pages/services.astro` |
| Commercial | `src/pages/commercial.astro` |
| Residential | `src/pages/residential.astro` |

## What Not to Touch

- Anything inside `{ }` brackets that looks like code
- File paths (unless you're adding a new image)
- Import statements at the top of files
- `slug` values unless you know what you're doing

## Preview Your Changes

```bash
cd eliteconnect-astro
npm run dev
```

Open `http://localhost:4321` in your browser. Changes appear automatically.

## Related

- [[Getting-Started]]
- [[Deploying]]
