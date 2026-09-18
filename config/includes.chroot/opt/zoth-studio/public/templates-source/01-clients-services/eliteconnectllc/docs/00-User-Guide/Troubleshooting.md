# Troubleshooting

## "My changes aren't showing up"

1. Did you save the file? ( obvious but happens )
2. Did you rebuild? Run `npm run build`
3. Hard refresh your browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
4. Check if you're looking at the right page
5. Clear browser cache and try again

## "The site looks broken"

1. Check you didn't accidentally delete a `{` or `}`
2. Check every line ends with a comma except the last
3. Make sure quotes are straight `"` not curly `"` `"`
4. Run `npm run build` — error messages tell you the problem

## "Form submissions aren't coming through"

1. Log into [Netlify](https://app.netlify.com) → Forms
2. Check the form name matches what's in the code
3. Submit a test entry
4. Check spam folders in your email
5. Make sure honeypot field wasn't filled (it's hidden from real users)

## "Images aren't showing"

1. Check the filename matches exactly (case-sensitive)
2. Make sure the image is in the `public/` folder
3. Check the file extension (.jpg vs .jpeg vs .png)
4. Try opening the image URL directly in your browser

## "Dark mode looks wrong"

1. Check both logo files exist:
   - `public/assets/brand/elite-connect-logo.png`
   - `public/assets/brand/elite-connect-logo-dark-mode.png`
2. Refresh the page after switching modes
3. Check browser console for errors (F12 → Console)

## "The build fails"

Common causes:
- Missing comma after an entry
- Extra comma after the last entry
- Deleted a closing bracket `}`
- Used curly quotes instead of straight quotes
- File referenced in code doesn't exist

Run `npm run build` and read the error message — it usually points to the exact line.

## "I broke something and don't know what"

1. Don't panic
2. If using git: `git checkout -- filename` to undo changes to one file
3. If not using git: restore from your backup
4. Worst case: re-deploy the previous working version from Netlify

## Getting Help

- Check the developer docs in `docs/`
- Check the agent skill files in `.agents/`
- Contact your developer with the exact error message

## Related

- [[Getting-Started]]
- [[Editing-Content]]
- [[Deploying]]
