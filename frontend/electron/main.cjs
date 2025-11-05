const { app, BrowserWindow, session } = require('electron')
const path = require('path')

let windows = []

// Disable hardware acceleration to prevent black screen issues
app.disableHardwareAcceleration()

function createWindow() {
  const newWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#ffffff',
    show: false, // Don't show until ready
    title: 'Lernova',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      enableRemoteModule: false,
      sandbox: false
    },
    icon: path.join(__dirname, '../public/icon.png')
  })

  // Add to windows array
  windows.push(newWindow)

  // Show window when ready to prevent white/black flash
  newWindow.once('ready-to-show', () => {
    newWindow.show()
  })

  // Load the app
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
  
  if (isDev) {
    newWindow.loadURL('http://localhost:5173')
    newWindow.webContents.openDevTools()
  } else {
    newWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  // Handle navigation
  newWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription)
    if (isDev) {
      // Retry in dev mode
      setTimeout(() => {
        newWindow.loadURL('http://localhost:5173')
      }, 1000)
    }
  })

  // Handle new window requests from webview
  newWindow.webContents.on('did-attach-webview', (event, webContents) => {
    // Handle new window requests from the webview
    webContents.setWindowOpenHandler(({ url }) => {
      console.log('New window requested for URL:', url)
      // Open in a new application window
      createWindow()
      return { action: 'deny' }
    })
  })

  newWindow.on('closed', () => {
    // Remove from windows array
    windows = windows.filter(w => w !== newWindow)
  })
  
  return newWindow
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
