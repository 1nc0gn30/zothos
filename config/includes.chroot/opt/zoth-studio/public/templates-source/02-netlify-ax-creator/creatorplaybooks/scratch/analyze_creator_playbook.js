import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function runGrokQuery(prompt) {
  const tempPromptPath = `scratch/grok_analysis_prompt_${process.pid}.txt`;
  fs.writeFileSync(tempPromptPath, prompt, 'utf8');
  
  const cmd = `/home/neo/.grok/bin/grok --prompt-file ${tempPromptPath}`;
  try {
    const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 15 * 1024 * 1024 });
    try {
      fs.unlinkSync(tempPromptPath);
    } catch {}
    return output;
  } catch (err) {
    try {
      fs.unlinkSync(tempPromptPath);
    } catch {}
    throw err;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const mentorId = args[0];
  const xHandle = args[1];

  if (!mentorId || !xHandle) {
    console.error("Usage: node scratch/analyze_creator_playbook.js <mentor_id> <x_handle>");
    process.exit(1);
  }

  console.log(`=== START ANALYSIS FOR ${mentorId} (@${xHandle}) ===`);

  const tempJsonPath = `scratch/sync-output/${mentorId}.json`;
  if (!fs.existsSync(tempJsonPath)) {
    console.warn(`No sync data found for ${mentorId}, skipping...`);
    process.exit(0);
  }

  const rawData = fs.readFileSync(tempJsonPath, 'utf8');
  const syncData = JSON.parse(rawData);
  const fb = syncData.fallback;

  if (!fb || !fb.tweets || fb.tweets.length === 0) {
    console.log(`No tweets available to analyze for ${mentorId}.`);
    process.exit(0);
  }

  // Load current playbook from src/lib/creators.ts (for reference context)
  const creatorsPath = 'src/lib/creators.ts';
  let creatorsContent = fs.readFileSync(creatorsPath, 'utf8');
  
  const idRegex = new RegExp(`id:\\s*['"]${mentorId}['"]`);
  const match = creatorsContent.match(idRegex);
  let currentPlaybookContext = '';
  if (match) {
    const startIndex = match.index;
    let openBraces = 0;
    let endIndex = -1;
    for (let i = startIndex; i < creatorsContent.length; i++) {
      if (creatorsContent[i] === '{') openBraces++;
      if (creatorsContent[i] === '}') {
        openBraces--;
        if (openBraces === 0) {
          endIndex = i;
          break;
        }
      }
    }
    if (endIndex !== -1) {
      currentPlaybookContext = creatorsContent.slice(startIndex, endIndex + 1);
    }
  }

  const prompt = `You are a world-class growth marketing strategist and copywriting expert.
We have scraped X profile details and recent tweets for the creator '${fb.name}' (@${fb.handle}):
Bio: ${fb.bio}
Recent Tweets:
${fb.tweets.map((t, i) => `${i + 1}. [Likes: ${t.metrics?.like_count}, RTs: ${t.metrics?.retweet_count}] "${t.text}"`).join('\n')}

Here is their current playbook configuration in our system:
${currentPlaybookContext}

Your goal is to analyze their posting style, content themes, copy, and growth strategy from their actual tweets and bio. Then, output an updated, highly refined playbook (pillars, plays, hooks, and angles) aligned with their real-world X activity.

Requirements:
1. Pillars: Update/refine the core 2-4 content pillars to match what they actually tweet about.
2. Plays: Return exactly 3-5 growth plays (actionable execution plans). 
   - Retain 2-3 of the best existing plays from their current configuration (make them more specific if needed).
   - Add 1-2 new, highly specific plays directly based on their actual recent tweets (e.g. if a tweet talks about a specific product feature, coding setup like Claude Code/Termius/VPS, or community events, create a play for that).
   - Each play must have:
     - "id": string (e.g., '${mentorId}-1', '${mentorId}-2')
     - "emoji": string (a single relevant emoji)
     - "title": string (actionable title)
     - "description": string (explanation of the play)
     - "action": string (the exact step-by-step instruction for a student to copy)
     - "frequency": string ('Daily', 'Weekly', 'Monthly', 'Bi-weekly', 'Quarterly', 'Yearly')
3. Hooks: Extract 3-5 real hooks or opening phrases from their bio and tweets. Use real phrasing where possible.
4. Angles: Identify 3-5 specific content angles/positioning themes.

You MUST return ONLY a valid, raw JSON object matching the exact structure below. Do not include markdown code block wrappers (no \`\`\`json).

JSON Structure:
{
  "pillars": ["string"],
  "plays": [
    {
      "id": "string",
      "emoji": "string",
      "title": "string",
      "description": "string",
      "action": "string",
      "frequency": "string"
    }
  ],
  "hooks": ["string"],
  "angles": ["string"]
}`;

  const rawOutput = runGrokQuery(prompt);
  let cleanOutput = rawOutput.trim();

  if (cleanOutput.startsWith('```')) {
    cleanOutput = cleanOutput.replace(/^```[a-zA-Z]*\n/, '');
    cleanOutput = cleanOutput.replace(/\n```$/, '');
  }

  try {
    const parsed = JSON.parse(cleanOutput.trim());
    
    // Save to temp analysis directory
    const outDir = 'scratch/analysis-output';
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outPath = path.join(outDir, `${mentorId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2));
    
    console.log(`=== SUCCESSFULLY ANALYZED AND SAVED ${mentorId} ===`);
  } catch (err) {
    console.error(`Failed to parse Grok output for ${mentorId}:`);
    console.error(rawOutput);
    process.exit(1);
  }
}

main().catch(err => {
  console.error("Fatal worker error:", err);
  process.exit(1);
});
