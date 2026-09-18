import fs from 'fs';
import path from 'path';

const tempOutDir = 'scratch/sync-output';

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
        try {
          const raw = fs.readFileSync(path.join(tempOutDir, file), 'utf8');
          const data = JSON.parse(raw);
          if (!data || !data.mentorId || !data.manifest) continue;
          
          manifestObj[data.mentorId] = {
            avatar: data.manifest.avatar || manifestObj[data.mentorId]?.avatar || null,
            banner: data.manifest.banner || manifestObj[data.mentorId]?.banner || null,
            media: data.manifest.media.length > 0 ? data.manifest.media : (manifestObj[data.mentorId]?.media || [])
          };
        } catch (e) {
          console.error(`Error merging manifest for ${file}: ${e.message}`);
        }
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
        try {
          const raw = fs.readFileSync(path.join(tempOutDir, file), 'utf8');
          const data = JSON.parse(raw);
          if (!data || !data.xHandle || !data.fallback) continue;

          fallbackObj[data.xHandle] = {
            ...fallbackObj[data.xHandle],
            ...data.fallback,
            avatar: data.fallback.avatar || fallbackObj[data.xHandle]?.avatar || null,
            banner: data.fallback.banner || fallbackObj[data.xHandle]?.banner || null,
          };
        } catch (e) {
          console.error(`Error merging fallback for ${file}: ${e.message}`);
        }
      }
    }

    const newFContent = content.slice(0, start + 2) + JSON.stringify(fallbackObj, null, 2) + ';\n';
    fs.writeFileSync(fallbackPath, newFContent);
    console.log("xFallbackData.ts merged successfully!");
  }
}
console.log("Merge completed!");
