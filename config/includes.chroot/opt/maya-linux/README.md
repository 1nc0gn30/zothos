<div align="center">
  <img src="public/app/icon_256.png" width="128" height="128" alt="Maya Linux app icon" />

  # Maya for Linux (Studio Pro)

  **Wrap screen recordings in polished device mockups, customize pacing, apply 3D gyro tilt angles, animate cinematic zooms, place interactive tap ripples, add YouTube/MP3 background music, and export ready-to-share video clips.**

  *A high-performance Linux desktop application for creators, developers, and marketers.*

  [![Linux](https://img.shields.io/badge/Platform-Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)](https://github.com/)
  [![Package](https://img.shields.io/badge/Package-AppImage%20%7C%20DEB-00599C?style=for-the-badge&logo=appveyor&logoColor=white)](https://github.com/)
  [![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
</div>

---

## ⬇️ Download & Quick Run (AppImage)

Maya runs on **Ubuntu, Debian, Fedora, Arch, Pop!_OS, openSUSE, Manjaro**, and any modern Linux distribution with **zero extra setup**.

```bash
# 1. Download the latest AppImage release
# 2. Make it executable:
chmod +x Maya-1.1.0.AppImage

# 3. Run:
./Maya-1.1.0.AppImage
```

---

## ✨ Features

### 📱 Device Framing & 3D Mockups
- **iPhone 17 Pro**: Cosmic Orange, Deep Blue, Silver.
- **iPhone 16 Pro**: Natural Titanium, Black Titanium, White Titanium, Desert Titanium.
- **iPhone 15 Pro**: Natural Titanium, Black Titanium, White Titanium.
- **iPad Pro 11"** (Landscape M4), **MacBook Pro 14"**, **Google Pixel 9 Pro**, **Apple Watch Ultra 2**, **Retro Terminal**, and **Browser Frame** with traffic lights.
- **Generic Phone Mode**: Configurable bezel width, color, and corner radius.
- **Canvas Aspect Ratios**: **1:1** (Square), **9:16** (Reels / Shorts / TikTok), **4:5** (Portrait), **4:3** (Landscape), **16:9** (YouTube / Widescreen).
- **Interactive Drag & Drop**: Drop video files directly onto the canvas to start editing instantly.

### 🎬 CapCut & JianYing 1-Click Draft Exporter
- **Native Draft Export**: Export full multi-track project timelines directly into standard **CapCut** and **JianYing** draft folders (`draft_content.json`), compatible with CapCut Desktop and `capcut-cli` / `cutcli`.

### 🎤 Kinetic Word-by-Word Karaoke Captions
- **Spoken Word Highlighting**: Real-time word-by-word karaoke subtitle engine with dynamic accent highlights.
- **Preset Styles**: **Alex Hormozi Impact**, **Neon Glow**, **Glass Card**, **Minimal**, and **Elastic Pop Bounce**.

### ⏱ Multi-Track Timeline & Timecode Ruler
- **Timecode Ruler**: Precise timestamp ticks (`00:00`, `00:05`, `00:10`) along the timeline.
- **Zooms Track**: 6 easing curves (*Spring*, *Bouncy*, *Smooth*, *Snappy*, *Gentle*, *Linear*) with focus anchor panning.
- **Auto-Sync to Audio Beats**: Automatically detect music beats and snap camera zooms & cuts to the rhythm.
- **Taps Track**: Interactive *Ripple*, *Pulse*, and *Ring* feedback animations with click SFX.
- **Typewriter Headings**: Animated stroke-typed headlines & explainer text.
- **SFX Soundboard Library**: Built-in sound effects (Whooshes, Pops, Clicks, Bells, Risers).
- **Speed Retiming**: Non-destructive retiming from **0.25× to 4×**.
- **Non-Destructive Trimming**: Mark In (<kbd>I</kbd>) and Out (<kbd>O</kbd>) points on the recording.

### 🚀 4K Ultra HD & Vertical Reel Export Hub
- **4K 60 FPS & 2K Quad HD**: Render at 3840x2160 or 2560x1440 with max bitrate.
- **9:16 Vertical Reel Mode**: Direct export for Instagram Reels, YouTube Shorts, and TikTok.
- **Transparent Alpha (WebM/ProRes)**: Export transparent video overlays for OBS or video editors.

### 🎵 Background Audio & YouTube (`yt-dlp`) Downloader
- **Direct YouTube Audio Extraction**: Paste any YouTube video URL to automatically extract and attach the audio track using `yt-dlp`.
- **Custom Audio Upload**: Import local **MP3, WAV, AAC, or OGG** files.
- **Audio Controls**: Individual timeline volume slider and synchronized playback.

### 🎨 Backgrounds & Branding
- **8 Curated Gradients**: Brand-aligned Maya presets (`#6466FA`).
- **Solid Colors**: Brand palette + custom hex picker.
- **Video Blur Backdrop**: Blurred Keynote-style dynamic poster of your screen recording.
- **Transparent (Alpha)**: Exports transparent video for overlaying onto other video tracks in OBS, DaVinci Resolve, or Kdenlive.

### 💾 Saved Projects (`.mayaproj`)
- Save complete layouts, animation keyframes, callouts, and audio timelines to `.mayaproj` JSON files to easily reopen and edit past projects.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>Space</kbd> | Play / Pause |
| <kbd>M</kbd> | Mute / Unmute |
| <kbd>Delete</kbd> / <kbd>Backspace</kbd> | Delete selected Zoom, Tap, Callout, Audio, or Speed block |

---

## 🛠 Tech Stack

- **Desktop Framework**: Electron + TypeScript
- **UI Engine**: React 19 + Tailwind CSS + Framer Motion + Lucide Icons
- **Compositing**: High-performance HTML5 Canvas 2D / WebGL real-time frame renderer
- **Audio Extraction**: `yt-dlp`
- **Packaging**: `electron-builder` (`AppImage`, `.deb`, `.tar.gz`)

---

## 📦 Building from Source

### Prerequisites
Make sure you have Node.js (v18+) and npm installed:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/maya-linux.git
cd maya-linux

# Install dependencies
npm install

# Run in Development Mode
npm run dev

# Or Launch Desktop Electron App in Dev Mode
npm run app:dev
```

### Create the AppImage Package
```bash
npm run dist
```
The resulting portable `.AppImage` will be generated in `release/Maya-1.1.0.AppImage`.

---

## 🤝 License

Distributed under the [MIT License](LICENSE).
