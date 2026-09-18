import os

BASE_CLONE_DIR = os.path.abspath("sentinel_clones")
NEW_SITES_DIR = os.path.abspath(os.path.join(BASE_CLONE_DIR, "idk new sites folder"))
DOWNLOADS_DIR = os.path.abspath("downloads")
FFMPEG_INBOX_DIR = os.path.abspath(os.path.join("downloads", "ffmpeg", "inbox"))
CONFIG_FILE = "sentinel_config.json"

os.makedirs(BASE_CLONE_DIR, exist_ok=True)
os.makedirs(NEW_SITES_DIR, exist_ok=True)
os.makedirs(DOWNLOADS_DIR, exist_ok=True)
os.makedirs(FFMPEG_INBOX_DIR, exist_ok=True)

active_containers = {}
