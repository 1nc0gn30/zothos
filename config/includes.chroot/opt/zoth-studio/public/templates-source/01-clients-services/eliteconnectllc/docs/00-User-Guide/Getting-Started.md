# Getting Started — Elite Connect Website

A quick-start guide for the website owner. No coding required for most updates.

## What This Site Is

A static marketing website built with [Astro](https://astro.build). It loads fast, ranks well on Google, and requires no server maintenance. All content lives in text files you can edit directly.

## Folder Structure (What You Need to Know)

```
eliteconnect-astro/
├── src/
│   ├── data/
│   │   └── site.ts          ← Update phone, email, services, FAQs here
│   ├── pages/
│   │   ├── index.astro      ← Homepage
│   │   ├── contact.astro    ← Contact page
│   │   └── ...              ← Other pages
│   └── components/
│       ├── Header.astro     ← Navigation
│       └── Footer.astro     ← Footer
├── public/
│   ├── assets/brand/        ← Logos
│   └── assets/gallery/      ← Photos
└── docs/                    ← Developer documentation
```

## Everyday Tasks

### 1. Update Contact Info

File: `src/data/site.ts`

Change your phone number, email, or address in one place and it updates everywhere.

```typescript
phone: "804-445-9674",
email: "eliteconnectva@gmail.com",
```

### 2. Add or Change a Service

File: `src/data/site.ts`

Find the `services` array. Copy an existing entry and modify it:

```typescript
{
  title: "Your New Service",
  slug: "your-new-service",
  summary: "Short description of what it is.",
  points: ["Feature 1", "Feature 2", "Feature 3"],
}
```

Save, rebuild, deploy.

### 3. Update the FAQ

File: `src/data/site.ts`

Find the `faqs` array. Add or edit entries:

```typescript
{
  question: "Your question here?",
  answer: "Your answer here.",
}
```

### 4. Add a Photo to the Gallery

1. Put your image in `public/assets/gallery/`
2. Open `src/data/site.ts`
3. Find the `gallery` array and add:

```typescript
{
  src: "/assets/gallery/your-photo.jpg",
  alt: "Description of the photo",
  category: "CCTV",
}
```

### 5. Change Page Text

File: `src/pages/[page-name].astro`

Look for plain text between HTML tags. Edit carefully — don't delete brackets or quotes.

### 6. Check Form Submissions

1. Log into [Netlify](https://app.netlify.com)
2. Select your site
3. Go to **Forms**
4. Click the form name to see submissions
5. You can also export to CSV

## Dark Mode

The site automatically supports light and dark mode based on the user's system preference. A toggle button in the bottom-right corner lets visitors switch manually. The choice is saved for their next visit.

## Logo Files

| File | Use |
|---|---|
| `public/assets/brand/elite-connect-navbar-logo.png` | Navigation bar (light mode) |
| `public/assets/brand/elite-connect-navebar-logo-dark-mode.png` | Navigation bar (dark mode) |
| `public/assets/brand/elite-connect-logo.png` | Footer watermark (light) |
| `public/assets/brand/elite-connect-logo-dark-mode.png` | Footer watermark (dark) |

Replace these files with new versions (same filenames) to update the logo everywhere.

## Related

- [[Editing-Content]] — Detailed editing guide
- [[Deploying]] — How to publish changes
- [[Troubleshooting]] — Common issues

## Using AI Agents (For Developers)

The project includes 5 specialized AI agents for development work:

```bash
# Show all available agents
npm run agent

# Run a specific agent
npm run agent:design -- "Make the navbar sticky on scroll"
npm run agent:seo -- "Update meta descriptions"
npm run agent:astro -- "Add a new page"
npm run agent:forms -- "Fix contact form"
npm run agent:qa -- "Check Lighthouse scores"
```

Each agent loads its skill definition from `.agents/` and includes full project context automatically.

See `scripts/README.md` for detailed usage.
