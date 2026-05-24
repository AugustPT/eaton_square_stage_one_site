const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const jsxPath = 'C:/PROJECTS/eaton_square_stage_one_site/src/App.jsx';
const sourceDir = 'C:/PROJECTS/Eaton Square/Downloaded Images';
const destDir = 'C:/PROJECTS/eaton_square_stage_one_site/public/local_images';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

let content = fs.readFileSync(jsxPath, 'utf8');

// Regex to find http/https URLs inside quotes
const regex = /"(https?:\/\/[^"]+)"/g;
let match;
const urls = new Set();

while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  if (
    url.includes('maps/dir') ||
    url.includes('instagram.com') ||
    url.includes('google.com/search') ||
    url.includes('usps.com') ||
    url.includes('waikikihealth.com') ||
    url.includes('psychologytoday.com') ||
    url.includes('contact') ||
    url.includes('worlddivinelight.org/en') ||
    url.endsWith('/') ||
    url.includes('spaxanaduhawaii.com/contact') ||
    url.includes('redearthmassage-waikiki.com/contact') ||
    url.includes('tools.usps.com') ||
    url.includes('malamaserenity.com/contact-us') ||
    url.includes('shahandassociateshi.com/contact-us')
  ) {
    continue;
  }
  urls.add(url);
}

const urlList = Array.from(urls);

(async () => {
  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    let ext = '.jpg';
    if (url.toLowerCase().includes('.png')) ext = '.png';
    else if (url.toLowerCase().includes('.svg')) ext = '.svg';
    else if (url.toLowerCase().includes('.webp')) ext = '.webp';
    else if (url.toLowerCase().includes('enc_avif')) ext = '.avif';

    const sourceFile = `image_${i + 1}${ext}`;
    const sourcePath = path.join(sourceDir, sourceFile);
    
    // We will save EVERYTHING as jpg/png/svg to avoid AVIF issues on mobile
    // If it's SVG, keep as SVG
    let finalExt = ext === '.svg' ? '.svg' : '.jpg';
    const finalFile = `image_${i + 1}${finalExt}`;
    const finalPath = path.join(destDir, finalFile);

    if (fs.existsSync(sourcePath)) {
      try {
        if (ext === '.svg') {
          fs.copyFileSync(sourcePath, finalPath);
        } else {
          // Convert to JPEG and strip EXIF data (which removes "whatever data is causing it to not show")
          await sharp(sourcePath)
            .jpeg({ quality: 85 })
            .toFile(finalPath);
        }
        
        // Replace in App.jsx
        content = content.replace(url, `/local_images/${finalFile}`);
        console.log(`Processed and replaced: ${finalFile}`);
      } catch (err) {
        console.error(`Failed to process ${sourceFile}:`, err.message);
      }
    } else {
      console.log(`Missing source file: ${sourceFile} (Skipping replacement)`);
    }
  }

  fs.writeFileSync(jsxPath, content, 'utf8');
  console.log('App.jsx updated with local image paths!');
})();
