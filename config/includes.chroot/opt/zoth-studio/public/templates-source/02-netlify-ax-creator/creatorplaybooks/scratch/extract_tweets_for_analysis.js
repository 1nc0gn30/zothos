import fs from 'fs';
import path from 'path';

function main() {
  const tempOutDir = 'scratch/sync-output';
  const files = fs.readdirSync(tempOutDir);
  let output = '';

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(tempOutDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        if (!data.fallback) continue;
        
        const fb = data.fallback;
        output += `=========================================\n`;
        output += `MENTOR: ${data.mentorId} (@${data.xHandle})\n`;
        output += `Name: ${fb.name}\n`;
        output += `Bio: ${fb.bio}\n`;
        output += `Followers: ${fb.followers}\n`;
        output += `Location: ${fb.location}\n`;
        output += `Recent Tweets:\n`;
        
        if (fb.tweets && fb.tweets.length > 0) {
          fb.tweets.forEach((t, i) => {
            output += `  ${i + 1}. [Likes: ${t.metrics?.like_count ?? 0}, RTs: ${t.metrics?.retweet_count ?? 0}, Views: ${t.metrics?.impression_count ?? 0}]\n`;
            output += `     Text: "${t.text.replace(/\n/g, '\n     ')}"\n`;
          });
        } else {
          output += `  No tweets found.\n`;
        }
        output += `\n`;
      } catch (e) {
        console.error(`Failed to read/parse ${file}: ${e.message}`);
      }
    }
  }

  fs.writeFileSync('scratch/analysis_input.txt', output);
  console.log("Analysis input written to scratch/analysis_input.txt");
}

main();
