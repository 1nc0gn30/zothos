# WIP Notes — Mentor X Share Kit design-card + formatted posts

**Branch:** `main`  
**Status:** uncommitted local changes after last push (`c0bc08c feat: add Mentor X Share Kit page`)

## What changed since last push
- `scripts/generate-x-share-kit.mjs`
  - Rewrote X post templates so each post is properly multi-line and grammatically structured (main hook, short hook, product drop, thread starter, media drop).
  - Added an X-style "Design Card" preview per mentor with avatar placeholder, handle, date, formatted post, media grid, CTA, and brand footer.
  - Added `Copy Card Image` and `Download Card` buttons using `html-to-image`.
- `public/mentor-x-share-kit.html` regenerated (536 KB) with 37 mentors.

## Remaining blocker before push/deploy
The Design Card tab click handler reports `switchTab is not defined` in the browser, even though the function exists in the inline `<script>`. Likely cause: function declarations in the inline script are not being exposed as global `window` properties (possibly due to the surrounding build/scope or a syntax parse issue). Fix is to explicitly assign functions to `window` inside the script, e.g.:

```js
window.switchTab = switchTab;
window.previewDesign = previewDesign;
window.copyPost = copyPost;
window.copyCardImage = copyCardImage;
window.downloadCard = downloadCard;
window.copyAllMainPosts = copyAllMainPosts;
window.filterCards = filterCards;
```

Then regenerate `public/mentor-x-share-kit.html`, verify tab switching works, run `npm run build`, commit both files, and redeploy to Netlify.

## Next commands to run
```bash
# 1. Fix window bindings in scripts/generate-x-share-kit.mjs
# 2. Regenerate
node /home/neo/hermes-workspace/mayagrowth/scripts/generate-x-share-kit.mjs

# 3. Build check
npm run build

# 4. Commit + push
git add public/mentor-x-share-kit.html scripts/generate-x-share-kit.mjs
git commit -m "feat: formatted X posts and design-card copy/download for Mentor X Share Kit"
git push origin main

# 5. Deploy
npx netlify deploy --prod --dir=dist --message "feat: formatted X posts and design-card copy/download"
```

## Files to commit
- `public/mentor-x-share-kit.html`
- `scripts/generate-x-share-kit.mjs`
