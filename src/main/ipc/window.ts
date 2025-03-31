import { app, BrowserWindow, ipcMain } from 'electron'

export const windowEvents = (mainWindow: BrowserWindow, isDarwin: boolean) => {
  // MINIMIZE
  ipcMain.on('mainWindow:minimize', (event: Electron.IpcMainEvent) => {
    if (mainWindow.id === event.sender.id) {
      mainWindow.minimize()
    }
  })

  // MAXIMIZE
  ipcMain.on('mainWindow:maximize', (event: Electron.IpcMainEvent) => {
    if (mainWindow.id === event.sender.id) {
      mainWindow.maximize()
    }
  })

  // RESTORE WINDOW FROM MINIMIZED TO PREVIOUS STATE
  ipcMain.on('mainWindow:restore', (event: Electron.IpcMainEvent) => {
    if (mainWindow.id === event.sender.id) {
      mainWindow.restore()
    }
  })

  // CLOSE WINDOW, OR HIDE IF ON MAC
  ipcMain.on('mainWindow:close', (event: Electron.IpcMainEvent) => {
    if (mainWindow && event.sender === mainWindow.webContents) {
      if (isDarwin) {
        mainWindow.hide()
      } else {
        app.quit()
      }
    }
  })
}
