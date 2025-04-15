import path from 'node:path'
import { app, BrowserWindow } from 'electron'
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

const assetFolder = path.join(process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), 'src/assets') : process.resourcesPath)
const isDarwin = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV === 'development'

// HANDLE CREATING/REMOVING SHORTCUTS ON WINDOWS WHEN INSTALLING/UNINSTALLING
if (started) app.quit()

const createMainWindow = (): MainWindow => {
  const mainWindow = new MainWindow(isDarwin, {
    width: 1000,
    height: 800,
    minWidth: 700,
    minHeight: 400,
    backgroundColor: '#242424',
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
  const splashScreenWindow = new BrowserWindow({
    width: 320,
    height: 320,
    frame: false,
    transparent: true,
    icon: getIconPath('icon.png'),
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
  const splashScreenWindow: BrowserWindow = createSplashScreenWindow()
  const mainWindow: MainWindow = createMainWindow()
  const store: Store = new Store(mainWindow)

  // INITIALIZE THE PRE-INSTALLED LANGUAGE PACKAGES
  const packageHandler: PackageHandler = new PackageHandler(store, isDevelopment)
  packageHandler.initializeConfig()

  const port: string = `${await getPort()}`
  const fileLocation: string = packageHandler.languageFileLocation
  const translateServer: TranslateServer = new TranslateServer(store, port, isDevelopment, fileLocation)

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

const getIconPath = (icon: string) => {
  return path.join(assetFolder, `${process.env.NODE_ENV === 'development' ? 'icons/' : ''}${icon}`)
}
