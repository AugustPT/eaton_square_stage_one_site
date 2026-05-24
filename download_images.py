import os
import re
import urllib.request

jsx_path = "C:/PROJECTS/eaton_square_stage_one_site/src/App.jsx"
img_dir = "C:/PROJECTS/eaton_square_stage_one_site/public/images"
os.makedirs(img_dir, exist_ok=True)

with open(jsx_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find all http/https links that are likely images
# We'll specifically target the ones in plazaImages and rawBusinesses
urls = re.findall(r'"(https?://[^"]+)"', content)
image_urls = []
for url in urls:
    if "maps/dir" not in url and "instagram.com" not in url and "google.com" not in url and "res-menu.net" not in url and "usps.com" not in url and "waikikihealth.com" not in url and "psychologytoday.com" not in url and "contact" not in url and "en" not in url and not url.endswith('/'):
        # Just to be safe, only grab if they look like image urls or are in the known image positions
        image_urls.append(url)

# Filter explicitly
valid_urls = []
for u in image_urls:
    if any(ext in u.lower() for ext in [".jpg", ".png", ".webp", ".svg", "imgix.net", "unsplash.com"]):
        valid_urls.append(u)

# Unique urls
valid_urls = list(set(valid_urls))

print(f"Found {len(valid_urls)} unique image URLs to download.")

# Download and replace
req_headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.google.com/'
}

for i, url in enumerate(valid_urls):
    ext = ".jpg"
    if ".png" in url.lower(): ext = ".png"
    elif ".svg" in url.lower(): ext = ".svg"
    elif ".webp" in url.lower(): ext = ".webp"
    
    filename = f"img_{i}{ext}"
    filepath = os.path.join(img_dir, filename)
    
    try:
        print(f"Downloading {url}...")
        req = urllib.request.Request(url, headers=req_headers)
        with urllib.request.urlopen(req) as response:
            with open(filepath, 'wb') as out_f:
                out_f.write(response.read())
        
        # Replace in content
        content = content.replace(url, f"/images/{filename}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

with open(jsx_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done. Replaced URLs with local paths.")
