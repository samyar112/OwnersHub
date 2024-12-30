const { ipcMain } = require('electron');
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

//Error Handling
process.on('uncaughtException', (error) => {
    console.error("Unexpected error: ", error);
})

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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