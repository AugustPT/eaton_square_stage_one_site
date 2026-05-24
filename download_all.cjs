const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const jsxPath = 'C:/Users/august/Downloads/eaton_square_stage_one_site.jsx';
const downloadDir = 'C:/PROJECTS/Eaton Square/Downloaded Images';

if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const content = fs.readFileSync(jsxPath, 'utf8');

// Regex to find http/https URLs inside quotes
const regex = /"(https?:\/\/[^"]+)"/g;
let match;
const urls = new Set();

while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  // Filter out non-images
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
console.log(`Found ${urlList.length} unique image URLs to download.`);

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  for (let i = 0; i < urlList.length; i++) {
    const url = urlList[i];
    let ext = '.jpg';
    if (url.toLowerCase().includes('.png')) ext = '.png';
    else if (url.toLowerCase().includes('.svg')) ext = '.svg';
    else if (url.toLowerCase().includes('.webp')) ext = '.webp';
    else if (url.toLowerCase().includes('enc_avif')) ext = '.avif';

    const filename = `image_${i + 1}${ext}`;
    const destPath = path.join(downloadDir, filename);

    console.log(`[${i + 1}/${urlList.length}] Downloading: ${url}`);
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
      if (response && response.ok()) {
        const buffer = await response.buffer();
        fs.writeFileSync(destPath, buffer);
        console.log(` -> Saved ${filename}`);
      } else {
        console.log(` -> Failed: HTTP ${response ? response.status() : 'Unknown'}`);
      }
    } catch (err) {
      console.log(` -> Exception: ${err.message}`);
    }
  }

  await browser.close();
  console.log('All downloads completed!');
})();
