import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./src/lib/creators.ts');
const originalContent = fs.readFileSync(filePath, 'utf-8');

try {
  fs.writeFileSync(filePath, originalContent + '\nexport { ALL_CREATORS };\n');
  
  // import it dynamically
  const { ALL_CREATORS } = await import('../src/lib/creators.ts');
  console.log('Loaded total creators:', ALL_CREATORS.length);
  
  // Create scratch folder if not exists
  fs.mkdirSync('./scratch', { recursive: true });
  fs.writeFileSync('./scratch/all_creators.json', JSON.stringify(ALL_CREATORS, null, 2));
} finally {
  fs.writeFileSync(filePath, originalContent);
}
