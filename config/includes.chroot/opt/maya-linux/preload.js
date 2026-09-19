const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isDesktopApp: true,
  checkSystemDeps: () => ipcRenderer.invoke('check-system-deps'),
  downloadYouTubeAudio: (url) => ipcRenderer.invoke('download-youtube-audio', url),
  downloadYouTubeAudioInTerminal: (url) => ipcRenderer.invoke('download-youtube-audio-terminal', url),
  updateYtdlp: () => ipcRenderer.invoke('update-ytdlp'),
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  showItemInFolder: (path) => ipcRenderer.invoke('show-item-in-folder', path),
  startNativeExport: (config) => ipcRenderer.invoke('start-native-export', config),
  feedNativeExportFrame: (buffer) => ipcRenderer.invoke('feed-native-export-frame', buffer),
  finishNativeExport: () => ipcRenderer.invoke('finish-native-export'),
  cancelNativeExport: () => ipcRenderer.invoke('cancel-native-export'),
  exportCapCutDraft: (data) => ipcRenderer.invoke('export-capcut-draft', data),
  generateNeuralTTS: (params) => ipcRenderer.invoke('generate-neural-tts', params),
  listNeuralVoices: () => ipcRenderer.invoke('list-neural-voices'),
});
