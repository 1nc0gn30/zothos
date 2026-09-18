# Deploying Changes

## What Deploying Means

Making your edits live on the internet so visitors can see them.

## Method 1: Netlify Git Deploy (Recommended)

If your code is in GitHub/GitLab/Bitbucket:

1. Push your changes to the main branch
2. Netlify automatically builds and deploys
3. Live in ~2 minutes

```bash
git add .
git commit -m "Updated phone number"
git push origin main
```

## Method 2: Netlify Drag & Drop

1. Run the build locally:
```bash
cd eliteconnect-astro
npm run build
```

2. A `dist/` folder appears
3. Go to [Netlify](https://app.netlify.com) → Your site → Deploys
4. Drag the `dist/` folder onto the deploy area
5. Wait ~1 minute

## Method 3: Netlify CLI

```bash
npx netlify deploy --prod --dir=dist
```

## Check If It Worked

1. Visit `https://eliteconnectva.com`
2. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check your change is visible

## Rollback

If something breaks:

1. Go to [Netlify](https://app.netlify.com) → Your site → Deploys
2. Find the previous working deploy
3. Click **Publish deploy**

## Related

- [[Getting-Started]]
- [[Editing-Content]]
- [[Troubleshooting]]
