#!/usr/bin/env node
/**
 * Batch X Profile Fetcher
 * 
 * Usage:
 *   X_BEARER_TOKEN=your_token node scripts/batch-x-fetch.mjs --all
 *   X_BEARER_TOKEN=your_token node scripts/batch-x-fetch.mjs buildwithmaya levelsio karpathy
 *   node scripts/batch-x-fetch.mjs --dry-run    # Preview handles
 * 
 * This script:
 * 1. Reads creator handles from src/lib/creators.ts (or CLI args)
 * 2. Calls the X API v2 for each handle
 * 3. Saves successful responses to src/lib/xFallbackData.ts
 * 4. Saves raw JSON backups to scripts/x-backups/ for safety
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ── CONFIG ──
const BACKUP_DIR = path.join(ROOT, 'scripts', 'x-backups');
const FALLBACK_FILE = path.join(ROOT, 'src', 'lib', 'xFallbackData.ts');
const CREATORS_FILE = path.join(ROOT, 'src', 'lib', 'creators.ts');

// Ensure backup dir exists
fs.mkdirSync(BACKUP_DIR, { recursive: true });

// ── ARGS ──
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const fetchAll = args.includes('--all');
const handles = args.filter((a) => !a.startsWith('--'));
const hasExplicitHandles = handles.length > 0;

// ── GET TOKEN ──
function getToken() {
  // Priority: env var > .env file > null
  if (process.env.X_BEARER_TOKEN) return process.env.X_BEARER_TOKEN;
  
  // Try to read from .env file
  const envFile = path.join(ROOT, '.env');
  if (fs.existsSync(envFile)) {
    const content = fs.readFileSync(envFile, 'utf-8');
    const match = content.match(/X_BEARER_TOKEN=(.+)/);
    if (match) return match[1].trim();
  }
  
  return null;
}

// ── EXTRACT HANDLES FROM CREATORS.TS ──
function extractHandles() {
  const content = fs.readFileSync(CREATORS_FILE, 'utf-8');
  const normalized = content.replace(/\r\n/g, '\n');
  const matches = [...normalized.matchAll(/xHandle:\s*'([^']+)'/g)];
  const unique = [...new Set(matches.map((m) => m[1]))];
  return unique;
}

// ── FETCH PROFILE ──
async function fetchProfile(handle, token) {
  const url = `https://api.x.com/2/users/by/username/${handle.replace(/^@/, '')}?user.fields=public_metrics,profile_image_url,url,description,verified,verified_type,location`;
  
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.log(`  ⚠️  @${handle}: ${err.detail || `HTTP ${res.status}`}`);
      return { error: err.detail || `HTTP ${res.status}`, status: res.status };
    }

    const data = await res.json();
    const user = data.data;
    if (!user) {
      console.log(`  ⚠️  @${handle}: User not found`);
      return null;
    }

    const profile = {
      id: user.id,
      handle: user.username,
      name: user.name,
      bio: user.description || '',
      avatar: user.profile_image_url?.replace('_normal', '_400x400') || null,
      banner: null, // v2 doesn't expose banner
      followers: user.public_metrics?.followers_count ?? 0,
      following: user.public_metrics?.following_count ?? 0,
      posts: user.public_metrics?.tweet_count ?? 0,
      verified: user.verified || false,
      verifiedType: user.verified_type || null,
      url: `https://x.com/${user.username}`,
      location: user.location || null,
      lastUpdated: new Date().toISOString(),
    };

    console.log(`  ✅ @${handle}: ${profile.name} | ${profile.followers.toLocaleString()} followers`);
    return profile;
  } catch (err) {
    console.log(`  ❌ @${handle}: Network error - ${err.message}`);
    return null;
  }
}

// ── SAVE BACKUP ──
function saveBackup(handle, data) {
  const file = path.join(BACKUP_DIR, `${handle}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── MERGE INTO FALLBACK FILE ──
function mergeIntoFallback(results) {
  // Read existing fallback data
  let existing = {};
  if (fs.existsSync(FALLBACK_FILE)) {
    try {
      const content = fs.readFileSync(FALLBACK_FILE, 'utf-8');
      // Extract object literal between first { and last }
      const start = content.indexOf('= {');
      const end = content.lastIndexOf('};');
      if (start !== -1 && end !== -1) {
        const objStr = content.slice(start + 2, end + 1);
        // Make JSON-safe
        const jsonStr = objStr
          .replace(/\/\/.*$/gm, '')
          .replace(/,\s*\}/g, '}')
          .replace(/,\s*\]/g, ']');
        existing = JSON.parse(jsonStr);
      }
    } catch (e) {
      console.log('  ⚠️  Could not parse existing fallback, starting fresh');
    }
  }

  // Merge
  const merged = { ...existing, ...results };

  // Generate TS file
  const entries = Object.entries(merged)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([handle, p]) => {
      return `  "${handle}": {
    id: "${p.id}",
    handle: "${p.handle}",
    name: ${JSON.stringify(p.name)},
    bio: ${JSON.stringify(p.bio)},
    avatar: ${p.avatar ? `"${p.avatar}"` : 'null'},
    banner: ${p.banner ? `"${p.banner}"` : 'null'},
    followers: ${p.followers},
    following: ${p.following},
    posts: ${p.posts},
    verified: ${p.verified},
    verifiedType: ${p.verifiedType ? `"${p.verifiedType}"` : 'null'},
    url: "${p.url}",
    location: ${p.location ? `"${p.location}"` : 'null'},
    lastUpdated: "${p.lastUpdated}"
  }`;
    })
    .join(',\n');

  const tsContent = `// X API Fallback Data
// This file stores cached X profile data as a fallback when API credits are depleted.
// Generated from batch API calls. Last updated timestamps track freshness.
// Format: Record<xHandle, FallbackProfile>
//
// To regenerate:
//   X_BEARER_TOKEN=your_token node scripts/batch-x-fetch.mjs --all
//
// Last batch run: ${new Date().toISOString()}

export interface FallbackProfile {
  id: string;
  handle: string;
  name: string;
  bio: string;
  avatar: string | null;
  banner: string | null;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  verifiedType: string | null;
  url: string;
  location: string | null;
  lastUpdated: string;
}

export const xFallbackData: Record<string, FallbackProfile> = {
${entries}
};
`;

  fs.writeFileSync(FALLBACK_FILE, tsContent);
  console.log(`\n💾 Saved ${Object.keys(merged).length} profiles to ${path.relative(ROOT, FALLBACK_FILE)}`);
  console.log(`📁 Raw backups saved to ${path.relative(ROOT, BACKUP_DIR)}`);
}

// ── MAIN ──
async function main() {
  console.log('🐦 Batch X Profile Fetcher\n');

  if (isDryRun) {
    console.log('🏷️  DRY RUN — no API calls will be made\n');
  }

  const token = getToken();
  if (!token && !isDryRun) {
    console.error('❌ X_BEARER_TOKEN not found. Set it via:');
    console.error('   - Environment variable: export X_BEARER_TOKEN=...');
    console.error('   - .env file: X_BEARER_TOKEN=...');
    console.error('\n🏁 Dry run mode (preview only):');
    console.error('   node scripts/batch-x-fetch.mjs --dry-run');
    process.exit(1);
  }

  const targetHandles = hasExplicitHandles ? handles : extractHandles();
  console.log(`Found ${targetHandles.length} handles to fetch:\n`);

  if (isDryRun) {
    targetHandles.forEach((h) => console.log(`  - @${h}`));
    console.log('\n🏁 Dry run complete. Remove --dry-run to fetch.');
    return;
  }

  const results = {};
  let success = 0;
  let failed = 0;

  // Rate limit: X API Essential tier = 150 req / 15 min
  const DELAY_MS = 700;

  for (let i = 0; i < targetHandles.length; i++) {
    const handle = targetHandles[i];
    console.log(`[${i + 1}/${targetHandles.length}] Fetching @${handle}...`);
    
    const profile = await fetchProfile(handle, token);
    
    if (profile && !profile.error) {
      results[handle] = profile;
      saveBackup(handle, profile);
      success++;
    } else if (profile?.error) {
      saveBackup(handle, { error: profile.error, status: profile.status, fetchedAt: new Date().toISOString() });
      failed++;
    }

    if (i < targetHandles.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n📊 Results: ${success} success, ${failed} failed, ${targetHandles.length - success - failed} skipped`);

  if (success > 0) {
    mergeIntoFallback(results);
  }

  // Save full backup manifest
  const fullBackup = {
    fetchedAt: new Date().toISOString(),
    total: targetHandles.length,
    success,
    failed,
    profiles: results,
  };
  fs.writeFileSync(
    path.join(BACKUP_DIR, `_manifest_${new Date().toISOString().replace(/[:.]/g, '-')}.json`),
    JSON.stringify(fullBackup, null, 2)
  );

  console.log('\n✅ Done!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
