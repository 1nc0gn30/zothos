import fs from 'fs';
import path from 'path';

function indentString(str, spaces) {
  const indent = ' '.repeat(spaces);
  return str.split('\n').map((line, idx) => idx === 0 ? line : indent + line).join('\n');
}

function updateCreatorFields(fileContent, creatorId, newPillars, newPlays, newHooks, newAngles) {
  const idRegex = new RegExp(`id:\\s*['"]${creatorId}['"]`);
  const match = fileContent.match(idRegex);
  if (!match) {
    console.log(`Could not find ID matching ${creatorId} in file.`);
    return fileContent;
  }
  
  const idIndex = match.index;
  
  // Find the opening brace '{' of the creator object by searching backwards from idIndex
  let creatorStart = -1;
  for (let i = idIndex; i >= 0; i--) {
    if (fileContent[i] === '{') {
      creatorStart = i;
      break;
    }
  }
  
  if (creatorStart === -1) {
    console.log(`Could not find opening brace for creator ${creatorId}`);
    return fileContent;
  }
  
  // Now scan forwards from creatorStart to find the matching closing brace '}'
  let openBraces = 0;
  let creatorEnd = -1;
  
  for (let i = creatorStart; i < fileContent.length; i++) {
    if (fileContent[i] === '{') {
      openBraces++;
    } else if (fileContent[i] === '}') {
      openBraces--;
      if (openBraces === 0) {
        creatorEnd = i;
        break;
      }
    }
  }
  
  if (creatorEnd === -1) {
    console.log(`Could not find matching closing brace for creator ${creatorId}`);
    return fileContent;
  }
  
  let block = fileContent.slice(creatorStart, creatorEnd + 1);
  
  // Format with helper to preserve perfect 4-space indent
  const formattedPillars = indentString(JSON.stringify(newPillars, null, 2), 4);
  const formattedPlays = indentString(JSON.stringify(newPlays, null, 2), 4);
  const formattedHooks = indentString(JSON.stringify(newHooks, null, 2), 4);
  const formattedAngles = indentString(JSON.stringify(newAngles, null, 2), 4);
  
  const pillarsRegex = /pillars:\s*\[[\s\S]*?\n\s*\],/;
  block = block.replace(pillarsRegex, `pillars: ${formattedPillars},`);
  
  const playsRegex = /plays:\s*\[[\s\S]*?\n\s*\],/;
  block = block.replace(playsRegex, `plays: ${formattedPlays},`);
  
  const hooksRegex = /hooks:\s*\[[\s\S]*?\n\s*\],/;
  block = block.replace(hooksRegex, `hooks: ${formattedHooks},`);
  
  const anglesRegex = /angles:\s*\[[\s\S]*?\n\s*\],/;
  block = block.replace(anglesRegex, `angles: ${formattedAngles},`);
  
  return fileContent.slice(0, creatorStart) + block + fileContent.slice(creatorEnd + 1);
}

function main() {
  const creatorsPath = 'src/lib/creators.ts';
  if (!fs.existsSync(creatorsPath)) {
    console.error("creators.ts not found!");
    return;
  }
  
  let content = fs.readFileSync(creatorsPath, 'utf8');
  const analysisOutDir = 'scratch/analysis-output';
  const files = fs.readdirSync(analysisOutDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const raw = fs.readFileSync(path.join(analysisOutDir, file), 'utf8');
      try {
        const data = JSON.parse(raw);
        const creatorId = file.replace('.json', '');
        
        if (data.pillars && data.plays && data.hooks && data.angles) {
          content = updateCreatorFields(content, creatorId, data.pillars, data.plays, data.hooks, data.angles);
          console.log(`Merged playbook for ${creatorId}`);
        }
      } catch (e) {
        console.error(`Error merging file ${file}: ${e.message}`);
      }
    }
  }
  
  fs.writeFileSync(creatorsPath, content);
  console.log("creators.ts updated and written successfully!");
}

main();
