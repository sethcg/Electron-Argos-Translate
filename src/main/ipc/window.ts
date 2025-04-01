import { app, BrowserWindow, ipcMain } from 'electron'
import Store from './store/store'

export default class MainWindow extends BrowserWindow {
  isDarwin: boolean

  constructor(isDarwin: boolean, options?: Electron.BrowserWindowConstructorOptions) {
    super(options)
    this.isDarwin = isDarwin

    new Store(this)

    // SETUP IPC EVENTS
    this.minimizeWindow()
    this.maximizeWindow()
    this.restoreWindow()
    this.closeWindow()
  }

  minimizeWindow = (): void => {
    ipcMain.on('mainWindow:minimize', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        this.minimize()
      }
    })
  }

  maximizeWindow = (): void => {
    ipcMain.on('mainWindow:maximize', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        this.maximize()
      }
    })
  }

  restoreWindow = (): void => {
    // RESTORE WINDOW FROM MINIMIZED TO PREVIOUS STATE
    ipcMain.on('mainWindow:restore', (event: Electron.IpcMainEvent) => {
      if (this.id === event.sender.id) {
        this.restore()
      }
    })
  }

  closeWindow = (): void => {
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
