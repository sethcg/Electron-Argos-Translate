import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'

import { windowEvents } from './ipc/window'
import { TranslateServer } from './ipc/api'

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

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string

const assetFolder = path.join(
  process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), 'src/assets') : process.resourcesPath
)
const isDarwin = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV === 'development'

// HANDLE CREATING/REMOVING SHORTCUTS ON WINDOWS WHEN INSTALLING/UNINSTALLING
if (started) {
  app.quit()
}

const createMainWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 156,
    minHeight: 180,
    icon: getIconPath('icon.png'),
    // show: false,
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
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/windows/main/index.html`))
  }

  // OPEN DEV TOOLS ON LAUNCH
  if (isDevelopment) mainWindow.webContents.openDevTools()

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createMainWindow()
  const translateServer = new TranslateServer(isDevelopment, '127.0.0.1', '8080')

  // HANDLE IPC EVENTS
  windowEvents(mainWindow, isDarwin)
  translateServer.translateEvents()

  // CLOSE FLASK SERVER BEFORE CLOSING APPLICATION
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
