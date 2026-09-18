---
name: creator-db-enricher
description: >-
  Verify, update, and enrich creators database bios, plays count, and follower metrics using search engine lookups.
---

# Creator DB Enricher

## Overview
This skill automates the extraction, verification, and enrichment of the creators database (`src/lib/creators.ts` or a JSON database). It uses local Node-based script execution to compile and extract profiles, and makes rate-limited search engine index requests to check for updated follower metrics and bios on X.com.

## Dependencies
- `uv` (for running scripts)
- Node.js & `npx` (with `tsx` for TypeScript compilation)

## Quick Start
Run the enrichment command on the database file:
```bash
uv run python3 .agents/skills/creator-db-enricher/scripts/enrich.py --input src/lib/creators.ts --output scratch/enriched_creators.json --limit 5
```

## Utility Scripts
The skill includes a command line interface `enrich.py`:

```bash
uv run python3 .agents/skills/creator-db-enricher/scripts/enrich.py \
  --input [input_file] \
  --output [output_json_path] \
  --limit [max_creators_to_process] \
  [--search]
```

### Arguments:
- `--input`: Required. Path to the input file (`.ts` or `.json`). If a `.ts` file, the script compiles and extracts the `ALL_CREATORS` array dynamically.
- `--output`: Required. Path to write the output JSON file.
- `--limit`: Required. The number of profiles to process (e.g. `10` or `0` for all).
- `--search`: Optional. When passed, queries the search index to find follower counts and bios.

## Rate Limiting
The search utility implements a standard **1-second delay** between DuckDuckGo query requests. If the query gets rate limited (HTTP 429), it raises a `RateLimitError` and logs details to stderr.

## Common Mistakes
1. **Running without Node installed**: When inputting a `.ts` file, the script depends on Node and `tsx`. Ensure you are running in a project containing Node dependencies or transpile the file beforehand.
2. **Missing required `--limit` flag**: For safety, the script requires an explicit `--limit` parameter. Set it to `0` if you intend to run on the entire database.
