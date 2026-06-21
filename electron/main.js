'use strict';

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');

const isDev = process.argv.includes('--dev') || !app.isPackaged;
const VITE_DEV_URL = 'http://localhost:5174';

// Persist window size across restarts
let savedBounds = { width: 1440, height: 900 };

function createWindow() {
  const win = new BrowserWindow({
    ...savedBounds,
    minWidth: 900,
    minHeight: 600,
    frame: false,           // Custom title bar (TitleBar.tsx draws its own)
    backgroundColor: '#1e1e1e',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Notify renderer when maximized state changes
  win.on('maximize',   () => win.webContents.send('window-maximized', true));
  win.on('unmaximize', () => win.webContents.send('window-maximized', false));

  // Open external links in the default browser, not a new Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    win.loadURL(VITE_DEV_URL);
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  win.on('close', () => {
    savedBounds = win.getBounds();
  });

  return win;
}

app.whenReady().then(() => {
  const win = createWindow();

  // ── Window controls ────────────────────────────────────────
  ipcMain.handle('window:minimize',     () => win.minimize());
  ipcMain.handle('window:maximize',     () => win.isMaximized() ? win.unmaximize() : win.maximize());
  ipcMain.handle('window:close',        () => win.close());
  ipcMain.handle('window:is-maximized', () => win.isMaximized());

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
