import argparse
import json
import os
import re
import subprocess
import sys
import time
import urllib.request
from urllib.error import HTTPError, URLError

class RateLimitError(Exception):
    pass

def execute_tsx_extract(ts_path):
    """Temporarily appends export to the target file, imports it with tsx, and restores it."""
    with open(ts_path, "r", encoding="utf-8") as f:
        original_content = f.read()
        
    try:
        # Append temporary export to the end of the file
        with open(ts_path, "w", encoding="utf-8") as f:
            f.write(original_content + "\nexport { ALL_CREATORS };\n")
            
        # Run node inline script to print ALL_CREATORS as JSON
        cmd = [
            "npx", "tsx", "-e",
            "import { ALL_CREATORS } from './src/lib/creators.ts'; console.log(JSON.stringify(ALL_CREATORS));"
        ]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return json.loads(result.stdout)
    finally:
        # Restore original content
        with open(ts_path, "w", encoding="utf-8") as f:
            f.write(original_content)

def clean_bio(bio):
    if not bio:
        return ""
    return "\n".join(line.strip() for line in bio.split("\n") if line.strip())

def search_creator_metadata(handle):
    """Queries public API or search engine index for user metrics."""
    # We implement a default rate limit of 1 second as per Rule 2
    time.sleep(1.0)
    
    url = f"https://lite.duckduckgo.com/lite/"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    
    # Format POST data
    data = urllib.parse.urlencode({"q": f"site:x.com/{handle} follower count bio"}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode("utf-8")
            
            # Simple regex search for numbers preceding 'followers' or similar details in body text
            followers_match = re.search(r"([\d\.\,KkMm]+)\s*(?:Followers|followers)", html)
            followers_count = None
            followers_str = None
            
            if followers_match:
                followers_str = followers_match.group(1)
                # Clean followers_str to integer
                clean_str = followers_str.lower().replace(",", "").replace("+", "")
                if "k" in clean_str:
                    followers_count = int(float(clean_str.replace("k", "")) * 1000)
                elif "m" in clean_str:
                    followers_count = int(float(clean_str.replace("m", "")) * 1000000)
                else:
                    try:
                        followers_count = int(clean_str)
                    except ValueError:
                        pass
            
            return {
                "followers": followers_count,
                "followersStr": followers_str
            }
            
    except HTTPError as e:
        if e.code == 429:
            raise RateLimitError("Rate limited by search index.")
        # Log response body for details as per Rule 2
        body = e.read().decode("utf-8") if e else ""
        print(f"Error {e.code}: {body}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"Search failed for {handle}: {e}", file=sys.stderr)
        return None

def main():
    parser = argparse.ArgumentParser(description="Creator profile database enrichment utility")
    parser.add_argument("--input", required=True, help="Path to input TS or JSON file")
    parser.add_argument("--output", required=True, help="Path to output JSON file")
    parser.add_argument("--limit", type=int, required=True, help="Maximum number of profiles to update or fetch (0 for no limit)")
    parser.add_argument("--search", action="store_true", help="Perform online search to verify metrics")
    
    args = parser.parse_args()
    
    # 1. Load creators
    if args.input.endswith(".ts"):
        print(f"Extracting creators from TypeScript file: {args.input}...")
        try:
            creators = execute_tsx_extract(args.input)
        except Exception as e:
            print(f"Failed to extract TS module using node: {e}. Falling back to text regex parsing...", file=sys.stderr)
            sys.exit(1)
    else:
        print(f"Loading creators from JSON file: {args.input}...")
        with open(args.input, "r", encoding="utf-8") as f:
            creators = json.load(f)
            
    # 2. Process
    limit = args.limit if args.limit > 0 else len(creators)
    updated_count = 0
    
    for c in creators:
        if updated_count >= limit:
            break
            
        c_id = c.get("id", "")
        handle = c.get("xHandle", c_id)
        
        print(f"Processing creator: {c_id} (@{handle})...")
        c["bio"] = clean_bio(c.get("bio", ""))
        c["playsCount"] = len(c.get("plays", []))
        c["playbook_last_updated"] = time.strftime("%Y-%m-%d")
        
        # Populate focus_areas and strengths if missing
        if "focus_areas" not in c or not c["focus_areas"]:
            c["focus_areas"] = [tag.replace("-", " ").title() for tag in c.get("tags", [])[:3]]
        if "strengths" not in c or not c["strengths"]:
            c["strengths"] = [p.split("—")[0].strip() for p in c.get("pillars", [])[:2]]
            
        # Ensure correct plays structure
        for play in c.get("plays", []):
            if "emoji" not in play:
                play["emoji"] = "⚡"
            if "frequency" not in play:
                play["frequency"] = "Weekly"
                
        # Optional search queries
        if args.search:
            print(f"Searching X metrics for @{handle}...")
            metrics = search_creator_metadata(handle)
            if metrics:
                if metrics["followers"]:
                    c["followers"] = metrics["followers"]
                if metrics["followersStr"]:
                    c["followersStr"] = metrics["followersStr"]
                    
        updated_count += 1
        
    # 3. Save
    output_dir = os.path.dirname(args.output)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)
        
    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(creators, f, indent=2)
        
    print(f"Success! Enriched database saved to: {args.output}")

if __name__ == "__main__":
    main()
