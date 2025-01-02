const { ipcMain } = require('electron');
const { app, BrowserWindow } = require('electron/main');
const path = require('node:path');
const sqlite3 = require('sqlite3').verbose();

//Error Handling
process.on('uncaughtException', (error) => {
    console.error("Unexpected error: ", error);
})

// Sqlite3 connection
const db = new sqlite3.Database(path.join(__dirname, 'test.db'), (err) => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Database connected!');
  }
});

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height:900,
    resizable: true,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,

    }
  })

  win.loadFile('dist/owners-hub/browser/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('message', (event, message) => {
    console.log("Message from Renderer:", message);
})