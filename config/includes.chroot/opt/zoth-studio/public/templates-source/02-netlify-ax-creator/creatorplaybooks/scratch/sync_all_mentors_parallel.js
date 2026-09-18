import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const mentors = [
  { id: 'maya', xHandle: 'buildwithmaya' },
  { id: 'kp', xHandle: 'thisiskp_' },
  { id: 'gerrit', xHandle: 'halfmage' },
  { id: 'lynnzeng', xHandle: 'zeng_wt' },
  { id: 'jaibhagat', xHandle: 'ChaiWithJai' },
  { id: 'nealfrazier', xHandle: 'NealFrazierTech' },
  { id: 'maddiedreese', xHandle: 'maddiedreese' },
  { id: 'clarklab', xHandle: 'clarklab' },
  { id: 'rasaljaya', xHandle: 'rasaljaya' },
  { id: 'ayushtweetshere', xHandle: 'ayushtweetshere' },
  { id: 'phanindra_ai', xHandle: 'phanindra_ai' },
  { id: 'ash_wesley_', xHandle: 'AshAmplifies' },
  { id: 'conormartin_', xHandle: 'conormartin_' },
  { id: 'monroe_carol', xHandle: 'CarolMonroe' },
  { id: 'picsoung', xHandle: 'picsoung' },
  { id: 'nkgoutham', xHandle: 'nkgoutham' },
  { id: 'markbowley', xHandle: 'markbowley' },
  { id: 'hacksultan', xHandle: 'hacksultan' },
  { id: 'dhruvalgolakiya', xHandle: 'DhruvalGolakiya' },
  { id: 'idohodl', xHandle: 'idohodl' },
  { id: 'levelsio', xHandle: 'levelsio' },
  { id: 'tdinh_me', xHandle: 'tdinh_me' },
  { id: 'dannypostma', xHandle: 'dannypostma' },
  { id: 'arvidkahl', xHandle: 'arvidkahl' },
  { id: 'yongfook', xHandle: 'yongfook' },
  { id: 'hnshah', xHandle: 'hnshah' },
  { id: 'damengchen', xHandle: 'damengchen' },
  { id: 'flaviocopes', xHandle: 'flaviocopes' },
  { id: 'thepatwalls', xHandle: 'thepatwalls' },
  { id: 'biilmann', xHandle: 'biilmann' },
  { id: 'nousresearch', xHandle: 'NousResearch' },
  { id: 'teknium', xHandle: 'Teknium' },
  { id: 'demishassabis', xHandle: 'demishassabis' },
  { id: 'karpathy', xHandle: 'karpathy' },
  { id: 'stabilityai', xHandle: 'StabilityAI' }
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log(`Starting parallel batch sync for ${mentors.length} mentors...`);
  const tempOutDir = 'scratch/sync-output';
  if (!fs.existsSync(tempOutDir)) {
    fs.mkdirSync(tempOutDir, { recursive: true });
  }

  const concurrency = 4; // Run 4 concurrent workers
  const queue = [...mentors];
  let successCount = 0;
  let failedCount = 0;

  async function worker(workerId) {
    while (queue.length > 0) {
      const mentor = queue.shift();
      console.log(`[Worker ${workerId}] Starting ${mentor.id} (@${mentor.xHandle})... (${queue.length} remaining in queue)`);
      
      try {
        const { stdout, stderr } = await execPromise(`npx tsx scratch/sync_mentor_grok_parallel.js ${mentor.id} ${mentor.xHandle}`);
        console.log(`[Worker ${workerId}] Success: ${mentor.id}`);
        successCount++;
      } catch (err) {
        console.error(`[Worker ${workerId}] Error syncing ${mentor.id}: ${err.message}`);
        failedCount++;
      }
      
      // Delay slightly between tasks in the same worker to prevent overloading Grok
      await sleep(3000);
    }
  }

  const workers = Array.from({ length: concurrency }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  console.log(`\nWorkers finished. Success: ${successCount}, Failed: ${failedCount}`);
  console.log("Merging all temporary JSON files...");

  // Merge into src/lib/mediaManifest.ts
  const manifestPath = 'src/lib/mediaManifest.ts';
  if (fs.existsSync(manifestPath)) {
    let content = fs.readFileSync(manifestPath, 'utf8');
    const start = content.indexOf('= {');
    const end = content.lastIndexOf('};');
    if (start !== -1 && end !== -1) {
      const objStr = content.slice(start + 2, end + 1);
      const manifestObj = eval('(' + objStr + ')');

      const files = fs.readdirSync(tempOutDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const raw = fs.readFileSync(path.join(tempOutDir, file), 'utf8');
          const data = JSON.parse(raw);
          if (!data || !data.mentorId || !data.manifest) {
            continue;
          }
          manifestObj[data.mentorId] = {
            avatar: data.manifest.avatar || manifestObj[data.mentorId]?.avatar || null,
            banner: data.manifest.banner || manifestObj[data.mentorId]?.banner || null,
            media: data.manifest.media.length > 0 ? data.manifest.media : (manifestObj[data.mentorId]?.media || [])
          };
        }
      }

      const newMContent = content.slice(0, start + 2) + JSON.stringify(manifestObj, null, 2) + ';\n';
      fs.writeFileSync(manifestPath, newMContent);
      console.log("mediaManifest.ts merged successfully!");
    }
  }

  // Merge into src/lib/xFallbackData.ts
  const fallbackPath = 'src/lib/xFallbackData.ts';
  if (fs.existsSync(fallbackPath)) {
    let content = fs.readFileSync(fallbackPath, 'utf8');
    const start = content.indexOf('= {');
    const end = content.lastIndexOf('};');
    if (start !== -1 && end !== -1) {
      const objStr = content.slice(start + 2, end + 1);
      const fallbackObj = eval('(' + objStr + ')');

      const files = fs.readdirSync(tempOutDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const raw = fs.readFileSync(path.join(tempOutDir, file), 'utf8');
          const data = JSON.parse(raw);
          if (!data || !data.xHandle || !data.fallback) {
            continue;
          }
          fallbackObj[data.xHandle] = {
            ...fallbackObj[data.xHandle],
            ...data.fallback,
            avatar: data.fallback.avatar || fallbackObj[data.xHandle]?.avatar || null,
            banner: data.fallback.banner || fallbackObj[data.xHandle]?.banner || null,
          };
        }
      }

      const newFContent = content.slice(0, start + 2) + JSON.stringify(fallbackObj, null, 2) + ';\n';
      fs.writeFileSync(fallbackPath, newFContent);
      console.log("xFallbackData.ts merged successfully!");
    }
  }

  console.log("\n=== CONCURRENT BATCH SYNC COMPLETED ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
