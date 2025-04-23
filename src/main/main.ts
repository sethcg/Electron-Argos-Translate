import path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron'
import started from 'electron-squirrel-startup'
import getPort from 'get-port'

import MainWindow from './ipc/window'
import TranslateServer from './ipc/translate'
import PackageHandler from './ipc/package'
import Store from './ipc/store/store'
import ComputerInfo from './ipc/computer'

// THIS IS A "MAGIC" CONSTANT THAT IS GENERATED FROM FORGE'S WEBPACK,
// THE "MAIN_WINDOW" PORTION MATCHES THE "forge.config.ts -> vite-plugin -> renderer -> name" parameter.
// USED TO TELL THE ELECTRON APP WHERE TO FIND THE INDEX.HTML (IF USING LOCALHOST DEVELOPMENT SERVER OR NOT)
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string

const isDarwin: boolean = process.platform === 'darwin'
const isDevelopment: boolean = process.env.NODE_ENV === 'development'

const getIconPath = (icon: string) => {
  const assetFolder: string = path.join(isDevelopment ? path.join(app.getAppPath(), 'src/assets') : process.resourcesPath)
  return path.join(assetFolder, `${isDevelopment ? 'icons/' : ''}${icon}`)
}

// HANDLE CREATING/REMOVING SHORTCUTS ON WINDOWS WHEN INSTALLING/UNINSTALLING
if (started) app.quit()

const createMainWindow = (): MainWindow => {
  const mainWindow: MainWindow = new MainWindow(isDarwin, {
    width: 1000,
    height: 800,
    minWidth: 700,
    minHeight: 400,
    icon: getIconPath('icon.png'),
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, `../renderer/windows/main/preload.js`),
      devTools: true,
    },
    autoHideMenuBar: true,
  })

  // LOAD MAIN WINDOW INDEX.HTML
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/windows/main/index.html')
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/windows/main/index.html`))
  }

  return mainWindow
}

const createSplashScreenWindow = (): BrowserWindow => {
  const splashScreenWindow: BrowserWindow = new BrowserWindow({
    width: 320,
    height: 320,
    frame: false,
    transparent: true,
    icon: getIconPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, `../renderer/windows/main/preload.js`),
    },
    autoHideMenuBar: true,
  })

  // LOAD SPLASH SCREEN INDEX.HTML
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    splashScreenWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL + '/windows/splash/index.html')
  } else {
    splashScreenWindow.loadFile(path.join(__dirname, `../renderer/windows/splash/index.html`))
  }

  return splashScreenWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  const store: Store = new Store()
  const splashScreenWindow: BrowserWindow = createSplashScreenWindow()
  const mainWindow: MainWindow = createMainWindow()

  // COLOR SCHEME (DARK/LIGHT MODE) IPC EVENTS
  ipcMain.handle('colorScheme:change', async (_, isDarkMode: boolean): Promise<void> => {
    mainWindow.webContents.send('colorScheme:changed', isDarkMode)
  })

  const port: string = `${await getPort()}`
  const translateServer: TranslateServer = new TranslateServer(store, port)

  // INITIALIZE THE PRE-INSTALLED LANGUAGE PACKAGES
  const packageHandler: PackageHandler = new PackageHandler(store, mainWindow, translateServer)
  packageHandler.setConfig()

  // SETUP COMPUTER SPECIFICATION RELATED IPC EVENTS
  ComputerInfo.getAvailableThreadsEvent()

  mainWindow.on('ready-to-show', async () => {
    // OPEN SERVER, AND CACHE TRANSLATORS
    await translateServer.open()
    translateServer.setCache()

    // CHANGE SPLASH SCREEN TO MAIN WINDOW
    splashScreenWindow.destroy()
    mainWindow.show()

    // OPEN DEV TOOLS ON LAUNCH
    if (isDevelopment) mainWindow.webContents.openDevTools()
  })

  // CLOSE TRANSLATE SERVER BEFORE CLOSING APPLICATION
  app.on('before-quit', async () => {
    translateServer.close()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (!isDarwin) app.quit()
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
