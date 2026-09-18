import { execSync } from 'child_process';

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
  console.log(`Starting batch sync for ${mentors.length} mentors...`);
  
  for (let i = 0; i < mentors.length; i++) {
    const mentor = mentors[i];
    console.log(`\n--- [${i + 1}/${mentors.length}] Syncing ${mentor.id} (@${mentor.xHandle}) ---`);
    
    try {
      execSync(`npx tsx scratch/sync_mentor_grok.js ${mentor.id} ${mentor.xHandle}`, { stdio: 'inherit' });
      console.log(`[Success] Synced ${mentor.id}`);
    } catch (err) {
      console.error(`[Error] Failed to sync ${mentor.id}: ${err.message}`);
    }
    
    if (i < mentors.length - 1) {
      console.log("Sleeping 4 seconds to prevent rate limiting...");
      await sleep(4000);
    }
  }
  
  console.log("\n=== BATCH SYNC COMPLETED ===");
}

main();
