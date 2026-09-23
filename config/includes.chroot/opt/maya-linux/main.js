const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');
const { spawn, spawnSync } = require('child_process');

let mainWindow = null;

function findExecutable(name) {
  const commonPaths = [
    path.join(process.env.HOME || '', `.local/bin/${name}`),
    path.join(app.getPath('userData'), `bin/${name}`),
    path.join(process.env.HOME || '', `bin/${name}`),
    `/usr/local/bin/${name}`,
    `/usr/bin/${name}`,
    path.join(process.env.HOME || '', `.nvm/versions/node/${process.version}/bin/${name}`),
  ];
  for (const p of commonPaths) {
    if (!p) continue;
    try {
      if (fs.existsSync(p)) {
        return p;
      }
    } catch (_) {}
  }
  try {
    const res = spawnSync('which', [name]);
    if (res.status === 0 && res.stdout.toString().trim()) {
      return res.stdout.toString().trim();
    }
  } catch (_) {}
  return name;
}

function getEnrichedPath() {
  return [
    path.join(process.env.HOME || '', '.local/bin'),
    path.join(app.getPath('userData'), 'bin'),
    path.join(process.env.HOME || '', 'bin'),
    '/usr/local/bin',
    '/usr/bin',
    process.env.PATH || ''
  ].filter(Boolean).join(':');
}

// Linux Hardware acceleration & AppImage sandbox compatibility switches
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('no-sandbox');
  app.commandLine.appendSwitch('disable-gpu-sandbox');
  app.commandLine.appendSwitch('disable-dev-shm-usage');
  app.commandLine.appendSwitch('enable-transparent-visuals');
}

function resolveLocalFile(win, paths) {
  let foundPath = null;
  for (const p of paths) {
    if (p && fs.existsSync(p)) {
      foundPath = p;
      break;
    }
  }

  if (foundPath) {
    win.loadFile(foundPath).catch((err) => {
      console.warn('loadFile failed, attempting file:// URL fallback:', err);
      const fileUrl = url.pathToFileURL(foundPath).href;
      win.loadURL(fileUrl);
    });
  } else {
    console.error('Maya UI: index.html not found in any expected location.');
  }
}

function loadAppWindow(win) {
  const possiblePaths = [
    path.join(__dirname, 'dist', 'index.html'),
    path.join(__dirname, 'index.html'),
    path.join(process.resourcesPath || __dirname, 'app.asar', 'dist', 'index.html'),
    path.join(process.resourcesPath || __dirname, 'app', 'dist', 'index.html'),
    path.join(app.getAppPath(), 'dist', 'index.html'),
    path.join(app.getAppPath(), 'index.html')
  ];

  if (process.env.NODE_ENV === 'development' && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL).catch(() => {
      resolveLocalFile(win, possiblePaths);
    });
    return;
  }

  resolveLocalFile(win, possiblePaths);
}

function createWindow() {
  const iconPath = path.join(__dirname, 'public/app/icon_512.png');
  const distIconPath = path.join(__dirname, 'dist/app/icon_512.png');
  const iconFile = fs.existsSync(iconPath) ? iconPath : (fs.existsSync(distIconPath) ? distIconPath : undefined);

  mainWindow = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: 'Maya Pro Studio - Video Editor',
    backgroundColor: '#090a0f',
    icon: iconFile,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      sandbox: false,
      allowRunningInsecureContent: true,
    },
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load Maya UI:', errorCode, errorDescription, validatedURL);
  });
  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Renderer process gone:', details);
  });

  loadAppWindow(mainWindow);
}

// IPC Handler: Check System Dependencies (yt-dlp, ffmpeg)
ipcMain.handle('check-system-deps', async () => {
  const ytdlpPath = findExecutable('yt-dlp');
  const ffmpegPath = findExecutable('ffmpeg');
  
  let hasYtdlp = false;
  let hasFfmpeg = false;
  let ytdlpVersion = '';
  let ffmpegVersion = '';

  try {
    const r1 = spawnSync(ytdlpPath, ['--version'], {
      env: { ...process.env, PATH: getEnrichedPath() }
    });
    if (r1.status === 0) {
      hasYtdlp = true;
      ytdlpVersion = r1.stdout.toString().trim();
    }
  } catch (_) {}

  try {
    const r2 = spawnSync(ffmpegPath, ['-version'], {
      env: { ...process.env, PATH: getEnrichedPath() }
    });
    if (r2.status === 0) {
      hasFfmpeg = true;
      ffmpegVersion = r2.stdout.toString().split('\n')[0] || '';
    }
  } catch (_) {}

  return {
    isDesktop: true,
    ytdlp: hasYtdlp,
    ytdlpVersion,
    ytdlpPath,
    ffmpeg: hasFfmpeg,
    ffmpegVersion,
    platform: process.platform,
  };
});

// IPC Handler: Update / Install Latest yt-dlp Binary
ipcMain.handle('update-ytdlp', async () => {
  return new Promise((resolve, reject) => {
    try {
      const localBinDir = path.join(process.env.HOME || '', '.local/bin');
      const userBinDir = path.join(app.getPath('userData'), 'bin');
      const targetDir = fs.existsSync(localBinDir) ? localBinDir : userBinDir;
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      const targetPath = path.join(targetDir, 'yt-dlp');

      const curl = spawn('curl', [
        '-L',
        'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp',
        '-o',
        targetPath
      ]);

      curl.on('close', (code) => {
        if (code === 0 && fs.existsSync(targetPath)) {
          try {
            fs.chmodSync(targetPath, 0o755);
            const ver = spawnSync(targetPath, ['--version'], {
              env: { ...process.env, PATH: getEnrichedPath() }
            });
            if (ver.status === 0) {
              const ytdlpVersion = ver.stdout.toString().trim();
              return resolve({ success: true, version: ytdlpVersion, path: targetPath });
            }
          } catch (e) {
            return reject(new Error(`Failed to set permissions on yt-dlp: ${e.message}`));
          }
        }
        reject(new Error(`Failed to download yt-dlp binary (curl exit code ${code}).`));
      });

      curl.on('error', (err) => {
        reject(new Error(`Could not execute curl to update yt-dlp: ${err.message}`));
      });
    } catch (err) {
      reject(err);
    }
  });
});

// IPC Handler: Download YouTube Audio via yt-dlp
ipcMain.handle('download-youtube-audio', async (event, url) => {
  return new Promise((resolve, reject) => {
    try {
      let cleanUrl = (url || '').trim();
      if (!cleanUrl) {
        return reject(new Error('Please enter a valid YouTube URL.'));
      }
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
      }

      const tempDir = path.join(app.getPath('temp'), 'maya_audio');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const ytdlpPath = findExecutable('yt-dlp');
      const ffmpegPath = findExecutable('ffmpeg');
      const nodePath = findExecutable('node');
      const outputFileTemplate = path.join(tempDir, `audio_${Date.now()}_%(id)s.%(ext)s`);

      const args = [
        '-x',
        '--audio-format', 'mp3',
        '--audio-quality', '0',
        '--ffmpeg-location', ffmpegPath,
        '--no-playlist',
        '--no-check-certificates',
        '--extractor-args', 'youtube:player_client=mweb,android,ios,web'
      ];

      if (nodePath && fs.existsSync(nodePath)) {
        args.push('--js-runtimes', `node:${nodePath}`);
      } else {
        args.push('--js-runtimes', 'node');
      }

      args.push('-o', outputFileTemplate, cleanUrl);

      const customPath = getEnrichedPath();
      const yt = spawn(ytdlpPath, args, {
        env: { ...process.env, PATH: customPath }
      });

      let outputData = '';
      let errorData = '';

      yt.stdout.on('data', (data) => {
        outputData += data.toString();
      });

      yt.stderr.on('data', (data) => {
        errorData += data.toString();
      });

      yt.on('close', (code) => {
        if (code === 0) {
          const files = fs.readdirSync(tempDir);
          const recentFile = files
            .filter(f => f.endsWith('.mp3'))
            .sort((a, b) => fs.statSync(path.join(tempDir, b)).mtimeMs - fs.statSync(path.join(tempDir, a)).mtimeMs)[0];

          if (recentFile) {
            const filePath = path.join(tempDir, recentFile);
            const fileBuffer = fs.readFileSync(filePath);
            const base64Audio = `data:audio/mp3;base64,${fileBuffer.toString('base64')}`;
            resolve({ success: true, audioDataUrl: base64Audio, fileName: recentFile, filePath });
          } else {
            reject(new Error('Audio file was not found after conversion.'));
          }
        } else {
          let formattedError = errorData || outputData;
          if (formattedError.includes('The page needs to be reloaded') || formattedError.includes('SABR streaming')) {
            formattedError = 'YouTube requires updated yt-dlp extractor rules. Click "Update yt-dlp" in the dialog to update the engine, then try again.';
          } else {
            const errLines = formattedError
              .split('\n')
              .filter(l => l.includes('ERROR:') || l.includes('Error:'))
              .map(l => l.replace(/^ERROR:\s*/i, ''));
            if (errLines.length > 0) {
              formattedError = errLines.join('. ');
            }
          }
          reject(new Error(formattedError || `yt-dlp extraction failed with code ${code}`));
        }
      });

      yt.on('error', (err) => {
        reject(new Error(`Could not execute yt-dlp: ${err.message}`));
      });
    } catch (err) {
      reject(err);
    }
  });
});

// IPC Handler: Download YouTube Audio via Interactive Desktop Terminal
ipcMain.handle('download-youtube-audio-terminal', async (event, url) => {
  return new Promise((resolve, reject) => {
    try {
      let cleanUrl = (url || '').trim();
      if (!cleanUrl) {
        return reject(new Error('Please enter a valid YouTube URL.'));
      }
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = 'https://' + cleanUrl;
      }

      const tempDir = path.join(app.getPath('temp'), 'maya_audio');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const ytdlpPath = findExecutable('yt-dlp');
      const ffmpegPath = findExecutable('ffmpeg');
      const nodePath = findExecutable('node');
      const timeStamp = Date.now();
      const outputFileTemplate = path.join(tempDir, `audio_${timeStamp}_%(id)s.%(ext)s`);
      const scriptPath = path.join(tempDir, `run_ytdlp_${timeStamp}.sh`);

      const jsRuntimeArg = nodePath && fs.existsSync(nodePath) ? `--js-runtimes "node:${nodePath}"` : '--js-runtimes node';

      const scriptContent = `#!/usr/bin/env bash
echo "========================================================"
echo "    Maya Pro Studio - YouTube Audio Extractor"
echo "========================================================"
echo "URL: ${cleanUrl}"
echo "Output: ${tempDir}"
echo ""

export PATH="$HOME/.local/bin:${path.join(app.getPath('userData'), 'bin')}:$HOME/bin:/usr/local/bin:/usr/bin:$PATH"

echo "Running yt-dlp..."
"${ytdlpPath}" ${jsRuntimeArg} --extractor-args "youtube:player_client=mweb,android,ios,web" -x --audio-format mp3 --audio-quality 0 --ffmpeg-location "${ffmpegPath}" --no-playlist --no-check-certificates -o "${outputFileTemplate}" "${cleanUrl}"

EXIT_CODE=$?
echo ""
if [ $EXIT_CODE -eq 0 ]; then
  echo ">>> [SUCCESS] Audio converted to MP3. Importing into Maya..."
  sleep 1.5
else
  echo ">>> [ERROR] yt-dlp exited with code $EXIT_CODE."
  echo "Press Enter to close window..."
  read
fi
exit $EXIT_CODE
`;

      fs.writeFileSync(scriptPath, scriptContent, { mode: 0o755 });

      // Find terminal
      const terminalBins = ['konsole', 'gnome-terminal', 'x-terminal-emulator', 'xterm', 'kitty', 'alacritty'];
      let termBin = null;
      for (const t of terminalBins) {
        const found = findExecutable(t);
        if (found && found !== t && fs.existsSync(found)) {
          termBin = { name: t, path: found };
          break;
        }
      }

      if (!termBin) {
        return reject(new Error('No desktop terminal emulator (konsole, gnome-terminal, xterm) found on system.'));
      }

      let termArgs = [];
      if (termBin.name === 'konsole') {
        termArgs = ['--title', 'Maya YouTube Download', '-e', '/bin/bash', scriptPath];
      } else if (termBin.name === 'gnome-terminal') {
        termArgs = ['--', '/bin/bash', scriptPath];
      } else if (termBin.name === 'xterm') {
        termArgs = ['-title', 'Maya YouTube Download', '-e', '/bin/bash', scriptPath];
      } else {
        termArgs = ['-e', '/bin/bash', scriptPath];
      }

      const termProc = spawn(termBin.path, termArgs, {
        env: { ...process.env, PATH: getEnrichedPath() }
      });

      termProc.on('close', () => {
        try { if (fs.existsSync(scriptPath)) fs.unlinkSync(scriptPath); } catch (_) {}

        const files = fs.readdirSync(tempDir);
        const recentFile = files
          .filter(f => f.endsWith('.mp3'))
          .sort((a, b) => fs.statSync(path.join(tempDir, b)).mtimeMs - fs.statSync(path.join(tempDir, a)).mtimeMs)[0];

        if (recentFile) {
          const filePath = path.join(tempDir, recentFile);
          const fileBuffer = fs.readFileSync(filePath);
          const base64Audio = `data:audio/mp3;base64,${fileBuffer.toString('base64')}`;
          resolve({ success: true, audioDataUrl: base64Audio, fileName: recentFile, filePath });
        } else {
          reject(new Error('No audio file was produced from the terminal download.'));
        }
      });

      termProc.on('error', (err) => {
        reject(new Error(`Failed to launch terminal: ${err.message}`));
      });
    } catch (err) {
      reject(err);
    }
  });
});

// IPC Handler: File Dialog & Explorer
ipcMain.handle('show-save-dialog', async (event, options) => {
  const win = BrowserWindow.getFocusedWindow() || mainWindow;
  const videosDir = app.getPath('videos') || app.getPath('downloads') || app.getPath('home');
  return await dialog.showSaveDialog(win, {
    title: options?.title || 'Export Video',
    defaultPath: path.join(videosDir, options?.defaultName || 'Maya-Video.mp4'),
    filters: options?.filters || [
      { name: 'MP4 Video (*.mp4)', extensions: ['mp4'] },
      { name: 'WebM Video (*.webm)', extensions: ['webm'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
});

ipcMain.handle('show-item-in-folder', async (event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
    return true;
  }
  return false;
});

// IPC Native Video Export Engine (FFmpeg Stdin Stream)
let currentExportProcess = null;
let currentExportTempFiles = [];

ipcMain.handle('start-native-export', async (event, config) => {
  if (currentExportProcess) {
    try {
      currentExportProcess.stdin.end();
      currentExportProcess.kill();
    } catch (_) {}
    currentExportProcess = null;
  }

  currentExportTempFiles = [];
  const ffmpegPath = findExecutable('ffmpeg');
  const { width, height, fps = 60, outputPath, transparent = false, bgAudioBase64, bgAudioVolume = 0.8 } = config;

  const args = [
    '-y',
    '-f', 'rawvideo',
    '-vcodec', 'rawvideo',
    '-s', `${width}x${height}`,
    '-pix_fmt', 'rgba',
    '-r', `${fps}`,
    '-i', 'pipe:0'
  ];

  let audioInputIndex = -1;
  if (bgAudioBase64) {
    try {
      const tempAudioPath = path.join(app.getPath('temp'), `maya_export_bg_${Date.now()}.mp3`);
      const cleanBase64 = bgAudioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
      fs.writeFileSync(tempAudioPath, Buffer.from(cleanBase64, 'base64'));
      currentExportTempFiles.push(tempAudioPath);
      args.push('-stream_loop', '-1', '-i', tempAudioPath);
      audioInputIndex = 1;
    } catch (e) {
      console.warn('Could not write temp audio file for export:', e);
    }
  }

  if (transparent) {
    args.push(
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuva420p',
      '-b:v', '0',
      '-crf', '20',
      '-deadline', 'realtime',
      '-cpu-used', '4'
    );
    if (audioInputIndex !== -1) {
      args.push(
        '-filter_complex', `[${audioInputIndex}:a]volume=${bgAudioVolume}[a]`,
        '-map', '0:v',
        '-map', '[a]',
        '-c:a', 'libopus',
        '-shortest'
      );
    }
  } else {
    args.push(
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '18',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart'
    );
    if (audioInputIndex !== -1) {
      args.push(
        '-filter_complex', `[${audioInputIndex}:a]volume=${bgAudioVolume}[a]`,
        '-map', '0:v',
        '-map', '[a]',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest'
      );
    }
  }

  args.push(outputPath);

  return new Promise((resolve, reject) => {
    try {
      const customPath = `${process.env.PATH || ''}:/usr/bin:/usr/local/bin:${path.join(process.env.HOME || '', '.local/bin')}`;
      const proc = spawn(ffmpegPath, args, {
        env: { ...process.env, PATH: customPath }
      });
      currentExportProcess = proc;

      let errLogs = '';
      proc.stderr.on('data', (d) => {
        errLogs += d.toString();
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to start FFmpeg: ${err.message}`));
      });

      setTimeout(() => {
        resolve({ success: true, outputPath });
      }, 40);
    } catch (err) {
      reject(err);
    }
  });
});

ipcMain.handle('feed-native-export-frame', async (event, buffer) => {
  if (!currentExportProcess || !currentExportProcess.stdin || currentExportProcess.killed) {
    throw new Error('Native export process is not active');
  }

  return new Promise((resolve) => {
    const nodeBuf = Buffer.from(buffer);
    const canAcceptMore = currentExportProcess.stdin.write(nodeBuf);
    if (!canAcceptMore) {
      currentExportProcess.stdin.once('drain', () => resolve(true));
    } else {
      resolve(true);
    }
  });
});

ipcMain.handle('finish-native-export', async () => {
  if (!currentExportProcess) {
    return { success: true };
  }

  return new Promise((resolve, reject) => {
    const proc = currentExportProcess;
    currentExportProcess = null;

    let errorOutput = '';
    proc.stderr.on('data', (d) => {
      errorOutput += d.toString();
    });

    proc.on('close', (code) => {
      for (const f of currentExportTempFiles) {
        try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (_) {}
      }
      currentExportTempFiles = [];

      if (code === 0) {
        resolve({ success: true });
      } else {
        reject(new Error(`FFmpeg export failed with exit code ${code}: ${errorOutput}`));
      }
    });

    proc.stdin.end();
  });
});

ipcMain.handle('cancel-native-export', async () => {
  if (currentExportProcess) {
    try {
      currentExportProcess.kill();
    } catch (_) {}
    currentExportProcess = null;
  }
  for (const f of currentExportTempFiles) {
    try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch (_) {}
  }
  currentExportTempFiles = [];
  return { success: true };
});

ipcMain.handle('export-capcut-draft', async (event, { contentJson, metaJson, projectName }) => {
  try {
    const defaultName = `${projectName || 'Maya_Project'}_CapCut_Draft`;
    const result = await dialog.showSaveDialog({
      title: 'Export CapCut Project Draft Folder',
      defaultPath: path.join(app.getPath('downloads'), defaultName),
      buttonLabel: 'Export Draft Folder',
    });

    if (result.canceled || !result.filePath) {
      return { success: false, cancelled: true };
    }

    const targetDir = result.filePath;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(path.join(targetDir, 'draft_content.json'), contentJson, 'utf8');
    fs.writeFileSync(path.join(targetDir, 'draft_meta_info.json'), metaJson, 'utf8');

    shell.showItemInFolder(path.join(targetDir, 'draft_content.json'));

    return {
      success: true,
      folderPath: targetDir,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
});

// IPC Handler: List Neural Voices
ipcMain.handle('list-neural-voices', async () => {
  return [
    { id: 'en-US-ChristopherNeural', name: 'Christopher (US Male - Deep / Authority)', gender: 'Male', lang: 'en-US' },
    { id: 'en-US-JennyNeural', name: 'Jenny (US Female - Natural / Friendly)', gender: 'Female', lang: 'en-US' },
    { id: 'en-US-GuyNeural', name: 'Guy (US Male - Casual / Podcaster)', gender: 'Male', lang: 'en-US' },
    { id: 'en-US-AriaNeural', name: 'Aria (US Female - Confident / Expressive)', gender: 'Female', lang: 'en-US' },
    { id: 'en-US-AndrewNeural', name: 'Andrew (US Male - Warm / Modern)', gender: 'Male', lang: 'en-US' },
    { id: 'en-US-AvaNeural', name: 'Ava (US Female - Playful / Upbeat)', gender: 'Female', lang: 'en-US' },
    { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male - British Accent)', gender: 'Male', lang: 'en-GB' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female - British Accent)', gender: 'Female', lang: 'en-GB' },
    { id: 'en-US-BrianNeural', name: 'Brian (US Male - Sincere)', gender: 'Male', lang: 'en-US' },
    { id: 'en-US-AnaNeural', name: 'Ana (US Female - Cute / Youth)', gender: 'Female', lang: 'en-US' },
  ];
});

// IPC Handler: Generate AI Voice with edge-tts and parse timed subtitles
ipcMain.handle('generate-neural-tts', async (event, { text, voice, rate, pitch, style, startTime = 0 }) => {
  try {
    if (!text || !text.trim()) {
      return { success: false, error: 'Text cannot be empty' };
    }

    const edgeTtsBin = findExecutable('edge-tts');
    const tmpId = `tts_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const tempDir = app.getPath('temp');
    const outMp3 = path.join(tempDir, `${tmpId}.mp3`);
    const outVtt = path.join(tempDir, `${tmpId}.vtt`);

    const selectedVoice = voice || 'en-US-ChristopherNeural';
    let rateArg = '+0%';
    if (rate && rate !== 1.0) {
      const pct = Math.round((rate - 1.0) * 100);
      rateArg = pct >= 0 ? `+${pct}%` : `${pct}%`;
    }

    const args = [
      '--text', text,
      '--voice', selectedVoice,
      '--rate', rateArg,
      '--write-media', outMp3,
      '--write-subtitles', outVtt,
    ];

    const result = spawnSync(edgeTtsBin, args, {
      env: { ...process.env, PATH: getEnrichedPath() }
    });

    if (result.status !== 0 || !fs.existsSync(outMp3)) {
      const errMsg = result.stderr ? result.stderr.toString() : 'TTS process failed';
      return { success: false, error: errMsg };
    }

    const audioBuffer = fs.readFileSync(outMp3);
    const audioDataUrl = `data:audio/mp3;base64,${audioBuffer.toString('base64')}`;

    let audioDuration = 3.0;
    try {
      const ffmpegBin = findExecutable('ffmpeg');
      const probeRes = spawnSync(ffmpegBin, ['-i', outMp3], {
        env: { ...process.env, PATH: getEnrichedPath() }
      });
      const probeStr = probeRes.stderr.toString();
      const durMatch = probeStr.match(/Duration:\s*(\d+):(\d+):(\d+\.\d+)/);
      if (durMatch) {
        audioDuration = parseFloat(durMatch[1]) * 3600 + parseFloat(durMatch[2]) * 60 + parseFloat(durMatch[3]);
      }
    } catch (_) {}

    const subtitles = [];
    if (fs.existsSync(outVtt)) {
      const vttContent = fs.readFileSync(outVtt, 'utf8');
      const lines = vttContent.split('\n');
      let currentStart = 0;
      let currentEnd = 0;

      const parseTime = (timeStr) => {
        const parts = timeStr.replace(',', '.').split(':');
        if (parts.length === 3) {
          return parseFloat(parts[0]) * 3600 + parseFloat(parts[1]) * 60 + parseFloat(parts[2]);
        }
        return 0;
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const timeMatch = line.match(/(\d{2}:\d{2}:\d{2}[,\.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,\.]\d{3})/);
        if (timeMatch) {
          currentStart = parseTime(timeMatch[1]);
          currentEnd = parseTime(timeMatch[2]);
          let textLines = [];
          while (i + 1 < lines.length && lines[i + 1].trim() !== '' && !lines[i + 1].includes('-->')) {
            i++;
            textLines.push(lines[i].trim());
          }
          const subText = textLines.join(' ');
          if (subText) {
            const dur = Math.max(0.5, currentEnd - currentStart);
            subtitles.push({
              id: `sub_${Date.now()}_${subtitles.length}`,
              startTime: startTime + currentStart,
              duration: dur,
              text: subText,
              style: style || 'hormozi',
              fontSize: 38,
              colorHex: '#FDE047',
              strokeHex: '#000000',
              uppercase: true,
              positionY: 0.82,
            });
          }
        }
      }
    }

    try { fs.unlinkSync(outMp3); } catch (_) {}
    try { fs.unlinkSync(outVtt); } catch (_) {}

    return {
      success: true,
      audioDataUrl,
      duration: audioDuration,
      subtitles,
      voice: selectedVoice,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
