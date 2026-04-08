import { app, BrowserWindow, ipcMain } from 'electron'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { setupWatcher } from './watcher'
import * as logger from './logger'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let mainWindow: BrowserWindow | null = null

function createWindow() {
  logger.info('Main', 'Creating main window...')
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    logger.info('Main', 'Window ready to show.')
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    logger.info('Main', 'Window closed.')
    mainWindow = null
  })
}

// Tray icon disabled until a proper icon file is added to public/icon.png

app.whenReady().then(() => {
  logger.info('Main', 'App ready. Initializing subsystems...')
  createWindow()
  if (mainWindow) {
    setupWatcher(mainWindow)
  }
})

ipcMain.on('show-window', () => {
  logger.info('Main', 'Received show-window request from Renderer')
  mainWindow?.show()
  mainWindow?.focus()
})

ipcMain.on('log-event', (_event, { level, source, message }) => {
  logger.log(level, source, message)
})

app.on('window-all-closed', () => {
  logger.info('Main', 'All windows closed.')
  if (process.platform !== 'darwin') {
    // Keep running in background is a feature of ScreenZen
  }
})
