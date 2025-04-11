import { app, BrowserWindow, ipcMain } from 'electron'

export default class MainWindow extends BrowserWindow {
  isDarwin: boolean

  constructor(isDarwin: boolean, options?: Electron.BrowserWindowConstructorOptions) {
    super(options)
    this.isDarwin = isDarwin

    // SETUP WINDOW RELATED IPC EVENTS
    this.minimizeWindowEvent()
    this.maximizeWindowEvent()
    this.closeWindowEvent()
  }

  private minimizeWindowEvent = (): void => {
    ipcMain.on('mainWindow:minimize', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        this.minimize()
      }
    })
  }

  private maximizeWindowEvent = (): void => {
    ipcMain.on('mainWindow:maximize', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        if (this.isMaximized()) {
          this.restore()
        } else {
          this.maximize()
        }
      }
    })
  }

  private closeWindowEvent = (): void => {
    // CLOSE WINDOW, OR HIDE IF ON MAC
    ipcMain.on('mainWindow:close', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        if (this.isDarwin) {
          this.hide()
        } else {
          app.quit()
        }
      }
    })
  }
}
