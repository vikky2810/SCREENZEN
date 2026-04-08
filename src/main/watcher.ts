import chokidar from 'chokidar'
import path from 'node:path'
import os from 'node:os'
import { BrowserWindow } from 'electron'
import * as logger from './logger'

export function setupWatcher(mainWindow: BrowserWindow) {
  // Default screenshot directories
  const pathsToWatch: string[] = []
  
  if (process.platform === 'win32') {
    const home = os.homedir()
    const possiblePaths = [
      path.join(home, 'Pictures', 'Screenshots'),
      path.join(home, 'OneDrive', 'Pictures', 'Screenshots'),
      path.join(home, 'OneDrive - Personal', 'Pictures', 'Screenshots')
    ]
    
    possiblePaths.forEach(p => {
       pathsToWatch.push(p)
    })
  } else if (process.platform === 'darwin') {
    pathsToWatch.push(path.join(os.homedir(), 'Desktop')) // macOS defaults to Desktop
  }

  logger.info('Watcher', `Initial scan complete. Watching ${pathsToWatch.length} paths.`)

  const watcher = chokidar.watch(pathsToWatch, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true
  })

  watcher
    .on('add', filePath => {
      if (['.png', '.jpg', '.jpeg', '.webp'].includes(path.extname(filePath).toLowerCase())) {
        logger.info('Watcher', `New screenshot detected: ${filePath}`)
        mainWindow.webContents.send('new-screenshot', {
          path: filePath,
          timestamp: Date.now()
        })
      }
    })
    .on('error', (error: any) => {
      logger.error('Watcher', `Watcher error: ${error.message || error}`)
    })

  return watcher
}
