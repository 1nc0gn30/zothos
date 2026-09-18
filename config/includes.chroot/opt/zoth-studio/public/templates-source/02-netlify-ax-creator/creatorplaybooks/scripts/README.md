# CreatorPlaybooks X Sync

This directory contains the self-healing scraper that pulls real public X/Twitter profile data and pushes it to Netlify Blobs.

## Setup

No token needed — this uses your already-authenticated Netlify CLI session.

Optional `.env`:

```
HANDLES=buildwithmaya,thisiskp_,zeng_wt,halfmage,ChaiWithJai,NealFrazierTech
```

## Run

```bash
# 1. Scrape X profiles to local files
python3 scripts/sync-x-profiles.py

# 2. Push to Netlify Blobs via authenticated CLI
./scripts/push-to-blobs.sh
```

## Schedule 3x/day

```bash
crontab -e
```

Add:

```cron
0 7 * * * cd /home/neo/hermes-workspace/mayagrowth && /usr/bin/python3 scripts/sync-x-profiles.py >> logs/sync.log 2>&1 && /home/neo/hermes-workspace/mayagrowth/scripts/push-to-blobs.sh >> logs/sync.log 2>&1
0 12 * * * cd /home/neo/hermes-workspace/mayagrowth && /usr/bin/python3 scripts/sync-x-profiles.py >> logs/sync.log 2>&1 && /home/neo/hermes-workspace/mayagrowth/scripts/push-to-blobs.sh >> logs/sync.log 2>&1
0 18 * * * cd /home/neo/hermes-workspace/mayagrowth && /usr/bin/python3 scripts/sync-x-profiles.py >> logs/sync.log 2>&1 && /home/neo/hermes-workspace/mayagrowth/scripts/push-to-blobs.sh >> logs/sync.log 2>&1
```

## Notes

- Requires `npx netlify` to be authenticated (`npx netlify login` once).
- X scraping violates X ToS. Use low volume, rotate proxies when scaling.
- If scraping fails, the site falls back to bundled/cached data.
