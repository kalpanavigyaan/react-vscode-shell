'use strict';

const { contextBridge, ipcRenderer } = require('electron');

// Expose a minimal, safe API to the renderer process.
// Add your own channels here as your app grows.
contextBridge.exposeInMainWorld('electronShell', {
  minimize:        ()    => ipcRenderer.invoke('window:minimize'),
  maximize:        ()    => ipcRenderer.invoke('window:maximize'),
  close:           ()    => ipcRenderer.invoke('window:close'),
  isMaximized:     ()    => ipcRenderer.invoke('window:is-maximized'),
  onMaximizedChange: (cb) => ipcRenderer.on('window-maximized', (_ev, val) => cb(val)),
});
