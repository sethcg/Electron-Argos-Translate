import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'
import getPort from 'get-port'

import MainWindow from './ipc/window'
import TranslateServer from './ipc/translate'
import { PackageHandler } from './ipc/package'

// TO-DO: Try implementing 'translate' to get different translation options;
// allowing for more/better alternative translations
/*
import translate from 'translate'
translate.engine = 'google'

import { Translate } from "translate";

const googleTranslate = Translate({ engine: "google", key: "..." });
const deepLTranslate = Translate({ engine: "deepl", key: "..." });
const yandexTranslate = Translate({ engine: "yandex", key: "..." });
const libreTranslate = Translate({ engine: "libre", url: "", key: "..." });
*/

// THIS IS A "MAGIC" CONSTANT THAT IS GENERATED FROM FORGE'S WEBPACK,
// THE "ALL_WINDOWS" PORTION MATCHES THE "forge.config.ts -> vite-plugin -> renderer -> name" parameter.
// USED TO TELL THE ELECTRON APP WHERE TO FIND THE INDEX.HTML (IF USING LOCALHOST DEVELOPMENT SERVER OR NOT)
declare const ALL_WINDOWS_VITE_DEV_SERVER_URL: string

const assetFolder = path.join(
  process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), 'src/assets') : process.resourcesPath
)
const isDarwin = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV === 'development'

// HANDLE CREATING/REMOVING SHORTCUTS ON WINDOWS WHEN INSTALLING/UNINSTALLING
if (started) {
  app.quit()
}

const createMainWindow = (): MainWindow => {
  const mainWindow = new MainWindow(isDarwin, {
    width: 800,
    height: 600,
    minWidth: 156,
    minHeight: 180,
    backgroundColor: '#242424',
    icon: getIconPath('icon.png'),
    show: false,
    // HIDE TITLE BAR AND FRAME
    // frame: false,
    // titleBarStyle: "hidden",
    // titleBarOverlay: {
    //   color: "#BBBBBB",
    //   symbolColor: "#000000",
    //   height: 36
    // },
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
      preload: path.join(__dirname, `../renderer/windows/main/preload.js`),
      devTools: true,
    },
    autoHideMenuBar: true,
  })

  // LOAD INDEX.HTML
  if (ALL_WINDOWS_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(ALL_WINDOWS_VITE_DEV_SERVER_URL + '/windows/main/index.html')
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/windows/main/index.html`))
  }

  return mainWindow
}

const createSplashScreenWindow = (): BrowserWindow => {
  const splashScreenWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 156,
    minHeight: 180,
    backgroundColor: '#242424',
    frame: false,
    icon: getIconPath('icon.png'),
  })

  // LOAD INDEX.HTML
  if (ALL_WINDOWS_VITE_DEV_SERVER_URL) {
    splashScreenWindow.loadURL(ALL_WINDOWS_VITE_DEV_SERVER_URL + '/windows/splash/index.html')
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

  const port: string = `${await getPort()}`
  const translateServer: TranslateServer = new TranslateServer(port, isDevelopment)
  const packageHandler: PackageHandler = new PackageHandler(isDevelopment)

  // DOWNLOAD ALL LANGUAGE PACKAGES
  packageHandler.downloadPackages(true)

  mainWindow.on('ready-to-show', async () => {
    await translateServer.open()

    splashScreenWindow.destroy()
    mainWindow.show()

    await translateServer.setup('es', 'en')

    // OPEN DEV TOOLS ON LAUNCH
    if (isDevelopment) {
      mainWindow.webContents.openDevTools()
    }
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
