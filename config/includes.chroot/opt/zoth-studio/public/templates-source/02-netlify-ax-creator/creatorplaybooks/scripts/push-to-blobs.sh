#!/usr/bin/env bash
# Push scraped JSON files into Netlify Blobs using the locally authenticated CLI.
set -e

STORE="creator-sync"
DIR="dist/sync-output"

if [ ! -d "$DIR" ]; then
  echo "No scraped data found in $DIR. Run: python3 scripts/sync-x-profiles.py"
  exit 1
fi

for file in "$DIR"/*.json; do
  [ -e "$file" ] || continue
  handle=$(basename "$file" .json)
  echo "Uploading $handle to blobs:$STORE ..."
  npx netlify blobs:set "$STORE" "$handle" --input "$file" --force
done

echo "All profiles uploaded to Netlify Blobs store '$STORE'"
