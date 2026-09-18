import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { URL } from 'url';

// Run single-turn query via Grok CLI using a prompt file to avoid shell escape issues
function runGrokQuery(prompt) {
  console.log("Running Grok query...");
  const tempPromptPath = `scratch/grok_prompt_${process.pid}.txt`;
  fs.writeFileSync(tempPromptPath, prompt, 'utf8');
  
  const cmd = `/home/neo/.grok/bin/grok --prompt-file ${tempPromptPath}`;
  try {
    const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
    try {
      fs.unlinkSync(tempPromptPath);
    } catch {}
    return output;
  } catch (err) {
    console.error(`Grok execution failed: ${err.message}`);
    try {
      fs.unlinkSync(tempPromptPath);
    } catch {}
    throw err;
  }
}

// Download a file locally with User-Agent header and a 15s timeout
async function downloadFile(url, destPath) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
  };
  
  console.log(`Downloading: ${url} -> ${destPath}`);
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status} ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

// Helper to determine file extension
function getExtension(urlStr) {
  try {
    const url = new URL(urlStr);
    if (url.searchParams.has('format')) {
      return '.' + url.searchParams.get('format');
    }
    const ext = path.extname(url.pathname);
    return ext ? ext.split('?')[0] : '.jpg';
  } catch {
    return '.jpg';
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mentorId = args[0];
  const xHandle = args[1];

  if (!mentorId || !xHandle) {
    console.error("Usage: node scratch/sync_mentor_grok_parallel.js <mentor_id> <x_handle>");
    process.exit(1);
  }

  console.log(`=== START SYNC FOR ${mentorId} (@${xHandle}) ===`);

  const prompt = `You are a helper tool for CreatorPlaybooks. Your task is to scrape profile information and recent tweets for the X user @${xHandle}.
Retrieve:
1. Public Profile info: ID, bio, display name, followers count, following count, posts count, verified status, location.
2. High-res Avatar URL (usually ending in _400x400 or _normal which we can transform) and Profile Banner URL.
3. 5 recent high-value or media-heavy tweets from the user. For each tweet, extract the tweet ID, text content, creation date, metrics (impressions, likes, retweets, replies), and an array of media objects (each having a direct image or video URL and type like "photo" or "video").

You MUST return ONLY a valid, raw JSON object and nothing else. No conversational text, no markdown code block wrappers (do NOT wrap it in \`\`\`json).

Here is the exact JSON structure you MUST match:
{
  "id": "string (the numeric user ID of @${xHandle} on X, e.g. '123456')",
  "handle": "string (e.g. '${xHandle}')",
  "name": "string (display name, e.g. 'Maya')",
  "bio": "string (profile bio description)",
  "followers": number,
  "following": number,
  "posts": number,
  "verified": boolean,
  "verifiedType": "string or null",
  "location": "string or null",
  "avatar": "string (profile image URL)",
  "banner": "string (profile banner URL)",
  "tweets": [
    {
      "id": "string (tweet ID)",
      "text": "string (tweet text)",
      "createdAt": "string (ISO date, e.g. '2026-07-08T09:30:00Z')",
      "metrics": {
        "impression_count": number,
        "like_count": number,
        "retweet_count": number,
        "reply_count": number
      },
      "media": [
        {
          "url": "string (media asset URL)",
          "type": "string ('photo', 'video', etc.)"
        }
      ]
    }
  ]
}`;

  const rawOutput = runGrokQuery(prompt);
  let cleanOutput = rawOutput.trim();

  // Strip markdown wrappers if Grok included them
  if (cleanOutput.startsWith('```')) {
    cleanOutput = cleanOutput.replace(/^```[a-zA-Z]*\n/, '');
    cleanOutput = cleanOutput.replace(/\n```$/, '');
  }

  let data;
  try {
    data = JSON.parse(cleanOutput.trim());
    console.log(`Parsed JSON for ${mentorId} successfully!`);
  } catch (err) {
    console.error(`Failed to parse JSON for ${mentorId} from Grok output:`);
    console.error(rawOutput);
    process.exit(1);
  }

  // 1. Download Avatar
  let localAvatar = null;
  if (data.avatar) {
    try {
      const ext = getExtension(data.avatar);
      const dest = `public/creators/${mentorId}/avatar${ext}`;
      await downloadFile(data.avatar, dest);
      localAvatar = `/creators/${mentorId}/avatar${ext}`;
    } catch (e) {
      console.warn(`Failed to download avatar: ${e.message}`);
    }
  }

  // 2. Download Banner
  let localBanner = null;
  if (data.banner) {
    try {
      const ext = getExtension(data.banner);
      const dest = `public/creators/${mentorId}/banner${ext}`;
      await downloadFile(data.banner, dest);
      localBanner = `/creators/${mentorId}/banner${ext}`;
    } catch (e) {
      console.warn(`Failed to download banner: ${e.message}`);
    }
  }

  // 3. Download Tweet Media and map to local URLs
  const processedTweets = [];
  const localMediaList = [];

  for (const tweet of data.tweets || []) {
    const localTweetMedia = [];
    for (let i = 0; i < (tweet.media || []).length; i++) {
      const med = tweet.media[i];
      if (med.type === 'video' || med.url.includes('.mp4') || med.url.includes('video.twimg.com')) {
        console.log(`Skipping download for video: ${med.url}`);
        localTweetMedia.push(med);
        continue;
      }
      try {
        const index = localMediaList.length + 1;
        const ext = getExtension(med.url);
        const filename = `media-${index}${ext}`;
        const dest = `public/creators/${mentorId}/${filename}`;
        await downloadFile(med.url, dest);
        
        const localUrl = `/creators/${mentorId}/${filename}`;
        localTweetMedia.push({
          url: localUrl,
          type: med.type || 'photo'
        });
        localMediaList.push(localUrl);
      } catch (e) {
        console.warn(`Failed to download tweet media: ${e.message}`);
        localTweetMedia.push(med);
      }
    }

    processedTweets.push({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.createdAt || new Date().toISOString(),
      metrics: {
        retweet_count: tweet.metrics?.retweet_count ?? 0,
        reply_count: tweet.metrics?.reply_count ?? 0,
        like_count: tweet.metrics?.like_count ?? 0,
        quote_count: tweet.metrics?.quote_count ?? 0,
        impression_count: tweet.metrics?.impression_count ?? 0
      },
      media: localTweetMedia,
      isRetweet: tweet.isRetweet || false,
      isReply: tweet.isReply || false
    });
  }

  // Write temporary output JSON
  const outputData = {
    mentorId,
    xHandle,
    manifest: {
      avatar: localAvatar,
      banner: localBanner,
      media: localMediaList
    },
    fallback: {
      id: data.id || mentorId,
      handle: data.handle || xHandle,
      name: data.name || mentorId,
      bio: data.bio || '',
      avatar: localAvatar,
      banner: localBanner,
      followers: data.followers || 0,
      following: data.following || 0,
      posts: data.posts || 0,
      verified: data.verified || false,
      verifiedType: data.verifiedType || null,
      url: `https://x.com/${xHandle}`,
      location: data.location || null,
      lastUpdated: new Date().toISOString(),
      tweets: processedTweets
    }
  };

  const tempOutDir = 'scratch/sync-output';
  if (!fs.existsSync(tempOutDir)) {
    fs.mkdirSync(tempOutDir, { recursive: true });
  }
  const tempOutPath = path.join(tempOutDir, `${mentorId}.json`);
  fs.writeFileSync(tempOutPath, JSON.stringify(outputData, null, 2));

  console.log(`=== SYNC COMPLETED FOR ${mentorId} (written to ${tempOutPath}) ===`);
}

main();
