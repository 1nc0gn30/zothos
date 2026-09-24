const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 820,
    height: 560,
    minWidth: 640,
    minHeight: 460,
    backgroundColor: '#05070c',
    frame: true,
    titleBarStyle: 'default',
    title: 'ZOTH MUSIC // HERMETIC AUDIO STUDIO',
    icon: '/usr/share/pixmaps/zoth-soundtrack.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('get-tracks', (event) => {
  const audioDir = '/usr/share/zothos/audio';
  let tracks = [];
  if (fs.existsSync(audioDir)) {
    const files = fs.readdirSync(audioDir);
    tracks = files.filter(f => f.endsWith('.mp3') || f.endsWith('.ogg') || f.endsWith('.wav')).map(f => {
      let title = f.replace(/^[0-9]+_/, '').replace(/\.(mp3|ogg|wav)$/, '').replace(/_/g, ' ');
      return {
        filename: f,
        title: title,
        path: path.join(audioDir, f)
      };
    });
  }
  event.reply('tracks-list', tracks);
});
