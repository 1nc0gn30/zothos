const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');

// ── Zoth Gold Aura — OS-layer magical gold glow that follows the cursor ─────
// Transparent, always-on-top, click-through overlay. The RENDERER polls the
// true X11 cursor itself (via xdotool + nodeIntegration) because the main
// process often has no DISPLAY. This window never steals input: it is
// click-through, so clicks fall through to the desktop.

let glowWindow = null;

let COLOR = process.env.ZOTH_GLOW_COLOR || '#ffd700';      // default gold
let INTENSITY = parseInt(process.env.ZOTH_GLOW_INTENSITY || '70', 10);
let ENABLED = true;

function log(...a) { try { console.log('[zoth-gold-glow]', ...a); } catch (e) {} }

function createGlowWindow() {
  const disp = screen.getPrimaryDisplay();
  const { x, y, width, height } = disp.bounds;

  glowWindow = new BrowserWindow({
    x, y, width, height,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    thickFrame: false,
    fullscreenable: false,
    enableLargerThanScreen: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  glowWindow.setAlwaysOnTop(true, 'screen-saver', 1);
  glowWindow.setIgnoreMouseEvents(true);   // click-through (forward is macOS/Win only)
  glowWindow.loadFile(path.join(__dirname, 'index.html'));

  glowWindow.on('ready-to-show', () => { glowWindow.showInactive(); });
  glowWindow.on('closed', () => { glowWindow = null; });
}

// ── IPC: toggle / recolor from a launcher or keybind ───────────────────────
ipcMain.on('glow-toggle', () => {
  ENABLED = !ENABLED;
  if (glowWindow && !glowWindow.isDestroyed()) glowWindow.webContents.send('aura-state', { enabled: ENABLED });
  log('toggled ->', ENABLED ? 'ON' : 'OFF');
});
ipcMain.on('glow-recolor', (_e, color) => {
  COLOR = color || '#ffd700';
  if (glowWindow && !glowWindow.isDestroyed()) glowWindow.webContents.send('aura-color', { color: COLOR });
  log('color ->', COLOR);
});

app.whenReady().then(() => {
  createGlowWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createGlowWindow(); });
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });