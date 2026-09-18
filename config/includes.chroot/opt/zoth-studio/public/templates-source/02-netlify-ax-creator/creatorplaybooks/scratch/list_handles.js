import fs from 'fs';

function main() {
  const content = fs.readFileSync('src/lib/creators.ts', 'utf8');
  const matches = [...content.matchAll(/id:\s*'([^']+)',\s*handle:\s*'([^']+)',\s*xHandle:\s*'([^']+)'/g)];
  console.log(`Found ${matches.length} mentors:`);
  for (const m of matches) {
    console.log(`- ID: ${m[1]}, Handle: ${m[2]}, xHandle: ${m[3]}`);
  }
}

main();
