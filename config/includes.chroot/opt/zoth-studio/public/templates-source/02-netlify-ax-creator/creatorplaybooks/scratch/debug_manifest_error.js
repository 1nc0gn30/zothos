import fs from 'fs';
import path from 'path';

function main() {
  const tempOutDir = 'scratch/sync-output';
  const files = fs.readdirSync(tempOutDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(tempOutDir, file);
      try {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);
        if (!data.manifest) {
          console.log(`File missing manifest: ${file}`);
          console.log(JSON.stringify(data, null, 2));
        }
      } catch (e) {
        console.error(`Failed to read/parse ${file}: ${e.message}`);
      }
    }
  }
}

main();
