const fs = require('fs');
const path = require('path');

const jsxPath = 'src/App.jsx';
const imgDir = 'public/local_images';

let content = fs.readFileSync(jsxPath, 'utf8');

// Helper to make slug
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// 1. Rename plazaImages
const plazaRegex = /const plazaImages = \{([\s\S]*?)\};/;
const plazaMatch = content.match(plazaRegex);
if (plazaMatch) {
  let plazaBlock = plazaMatch[1];
  const lines = plazaBlock.split('\n');
  const newLines = lines.map(line => {
    const m = line.match(/^\s*([a-zA-Z0-9_]+):\s*"(\/local_images\/[^"]+)"/);
    if (m) {
      const key = m[1];
      const oldPath = m[2];
      const oldFile = path.basename(oldPath);
      const ext = path.extname(oldFile);
      const newFile = `plaza-${slugify(key)}${ext}`;
      
      const oldDiskPath = path.join(imgDir, oldFile);
      const newDiskPath = path.join(imgDir, newFile);
      
      if (fs.existsSync(oldDiskPath)) {
        fs.renameSync(oldDiskPath, newDiskPath);
        console.log(`Renamed ${oldFile} -> ${newFile}`);
        return line.replace(oldPath, `/local_images/${newFile}`);
      }
    }
    return line;
  });
  content = content.replace(plazaBlock, newLines.join('\n'));
}

// 2. Rename businesses
// We'll extract each array element manually since JSON.parse won't work on JS code
// A simple approach: regex to find arrays inside rawBusinesses
const bizRegex = /\[\s*"([^"]+)"[\s\S]*?"(\/local_images\/[^"]+)"[\s\S]*?\]/g;
let match;
const replaces = [];
while ((match = bizRegex.exec(content)) !== null) {
  const bizName = match[1];
  const oldPath = match[2];
  const oldFile = path.basename(oldPath);
  const ext = path.extname(oldFile);
  const newFile = `${slugify(bizName)}${ext}`;
  
  const oldDiskPath = path.join(imgDir, oldFile);
  const newDiskPath = path.join(imgDir, newFile);
  
  if (fs.existsSync(oldDiskPath)) {
    fs.renameSync(oldDiskPath, newDiskPath);
    console.log(`Renamed ${oldFile} -> ${newFile}`);
  }
  
  // We can just replace the old path with the new path globally
  replaces.push({ oldPath, newPath: `/local_images/${newFile}` });
}

// Apply replacements
for (const { oldPath, newPath } of replaces) {
  // Use global replacement in case it's used multiple times (unlikely)
  content = content.split(oldPath).join(newPath);
}

fs.writeFileSync(jsxPath, content, 'utf8');
console.log('Done renaming files and updating App.jsx');
