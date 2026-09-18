import fs from 'fs';
import path from 'path';

function searchForEnv(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === '.env' || file.startsWith('.env.')) {
      const fullPath = path.join(dir, file);
      console.log(`Found: ${fullPath}`);
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        console.log(`--- Content of ${file} ---`);
        console.log(content);
        console.log('------------------------');
      } catch (e) {
        console.error(`Failed to read ${file}: ${e.message}`);
      }
    }
  }
}

try {
  console.log("Searching in workspace root...");
  searchForEnv('/home/neo/hermes-workspace/mayagrowth');
  console.log("Searching in workspace parent...");
  searchForEnv('/home/neo/hermes-workspace');
  console.log("Searching in home...");
  searchForEnv('/home/neo');
} catch (err) {
  console.error(`Error: ${err.message}`);
}
