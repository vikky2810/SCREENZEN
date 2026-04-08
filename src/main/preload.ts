import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  onNewScreenshot: (callback: (data: any) => void) => {
    ipcRenderer.on('new-screenshot', (_event, data) => callback(data))
  },
  send: (channel: string, data?: any) => {
    ipcRenderer.send(channel, data)
  },
  log: (level: string, source: string, message: string) => {
    ipcRenderer.send('log-event', { level, source, message })
  }
})
