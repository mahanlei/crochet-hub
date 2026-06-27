"""Download images from xhs_data.json to local uploads directory."""
import json
import os
import urllib.request
import ssl
import time

# Disable SSL verification for xhscdn
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(SCRIPT_DIR, "xhs_data.json")
UPLOAD_DIR = os.path.join(SCRIPT_DIR, "..", "server", "uploads")

os.makedirs(UPLOAD_DIR, exist_ok=True)

with open(DATA_FILE, "r", encoding="utf-8") as f:
    posts = json.load(f)

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Referer": "https://www.xiaohongshu.com/",
}

downloaded = []

for i, post in enumerate(posts):
    post_imgs = []
    for j, url in enumerate(post["imgs"]):
        # Ensure https
        if url.startswith("http://"):
            url = url.replace("http://", "https://")

        filename = f"work_{i+1}_img_{j+1}.webp"
        filepath = os.path.join(UPLOAD_DIR, filename)

        if os.path.exists(filepath) and os.path.getsize(filepath) > 1000:
            print(f"  SKIP (exists): {filename}")
            post_imgs.append(filename)
            continue

        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = resp.read()
                with open(filepath, "wb") as out:
                    out.write(data)
                print(f"  OK: {filename} ({len(data)} bytes)")
                post_imgs.append(filename)
        except Exception as e:
            print(f"  FAIL: {filename} - {e}")

        time.sleep(0.3)  # Rate limiting

    downloaded.append({
        "title": post["title"],
        "local_imgs": post_imgs,
    })
    print(f"[{i+1}/{len(posts)}] {post['title']}: {len(post_imgs)} images")

# Save mapping
mapping_file = os.path.join(SCRIPT_DIR, "image_mapping.json")
with open(mapping_file, "w", encoding="utf-8") as f:
    json.dump(downloaded, f, ensure_ascii=False, indent=2)

print(f"\nDone! Mapping saved to {mapping_file}")
