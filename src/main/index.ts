import { app, BrowserWindow, ipcMain} from 'electron'
import started from 'electron-squirrel-startup'

import path from 'node:path'
import { ChildProcess, execFile } from 'node:child_process'
import fetch, { Response, FetchError } from 'node-fetch';

import { TranslateResponse } from '~shared/types';

// TO-DO: look into self-hosted: LibreTranslation
//    Maybe a background server to Express running that?
// import translate from 'translate'
// translate.engine = 'google'

// import { Translate } from "translate";

// const googleTranslate = Translate({ engine: "google", key: "..." });
// const deepLTranslate = Translate({ engine: "deepl", key: "..." });
// const yandexTranslate = Translate({ engine: "yandex", key: "..." });
// const libreTranslate = Translate({ engine: "libre", url: "", key: "..." });

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string

const assetFolder = path.join(
  process.env.NODE_ENV === 'development' ? path.join(app.getAppPath(), 'src/assets') : process.resourcesPath
)
const isDarwin = process.platform === 'darwin'
const isDevelopment = process.env.NODE_ENV === 'development'

let mainWindow: BrowserWindow | undefined
let flaskServer: ChildProcess | undefined

// HANDLE CREATING/REMOVING SHORTCUTS ON WINDOWS WHEN INSTALLING/UNINSTALLING
if (started) {
  app.quit()
}

const createMainWindow = () => {
  // CREATE THE BROWSER WINDOW
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 156,
    minHeight: 180,
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

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) throw new Error('No main window.')

    mainWindow.show()

    // OPEN DEV TOOLS
    if (isDevelopment) {
      mainWindow.webContents.openDevTools({
        mode: 'detach',
      })
    }
  })

  // LOAD INDEX.HTML
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/windows/main/index.html`))
  }

  // LOAD FLASK SERVER
  let backend = path.join(process.resourcesPath, 'translate_server.exe')
  if (isDevelopment) {
    backend = path.join(__dirname, './resources/translate_server.exe')
  }
  // flaskServer = execFile(backend, ['--host', '127.0.0.1', '--port', '8080'], (error, stdout, stderr) => {
    flaskServer = execFile(backend, ['--port', '8080'], (error, stdout, stderr) => {
    if (error || stdout || stderr) {
      console.log(`${error}\n${stdout}\n${stderr}`);
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {


  ipcMain.handle(
    'flaskApi:translate',
    async (event: Electron.IpcMainInvokeEvent, source: string, target: string, value: string): Promise<TranslateResponse | FetchError> => {
      console.log(BrowserWindow.getAllWindows())

      // CHECK IF THE MAIN WINDOW EXISTS, AND THE EVENT CAME FROM THE MAIN WINDOW
      if (!mainWindow || event.sender !== mainWindow.webContents) { 
        return new FetchError('Internal error with the Window.', 'Error');
      }

      // CHECK IF THE SOURCE AND TARGET ARE VALID, LANGUAGE ISO CODES
      const validISO = ['en', 'es'];
      if(!validISO.includes(source) || !validISO.includes(target)) {
        return new FetchError('Invalid source or target.', 'Error');
      }
      
      const params = new URLSearchParams();
      params.append('source', 'en');
      params.append('target', 'es');
      params.append('q', value);

      return await fetch(`http://127.0.0.1:8080/api/translate?${params}`)
      .then(async (response: Response): Promise<TranslateResponse> => {
        return await response.json() as Promise<TranslateResponse>;
      })
      .catch((error: FetchError) => {
        console.log(error);
        return error
      });
    }
  )

  // Handle main window ipc
  ipcMain.on('mainWindow:minimize', event => {
    if (mainWindow) {
      if (event.sender !== mainWindow.webContents) return
      mainWindow.minimize()
    }
  })

  ipcMain.on('mainWindow:maximize', event => {
    if (mainWindow) {
      if (event.sender !== mainWindow.webContents) return

      mainWindow.maximize()
    }
  })

  ipcMain.on('mainWindow:restore', event => {
    if (mainWindow) {
      if (event.sender !== mainWindow.webContents) return
      mainWindow.restore()
    }
  })

  ipcMain.on('mainWindow:close', event => {
    if (mainWindow) {
      if (event.sender !== mainWindow.webContents) return

      if (isDarwin) {
        mainWindow.hide()
      } else {
        app.quit()
      }
    }
  })

  createMainWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (isDarwin) return;
    
  app.quit()
})

app.on('before-quit', async () => {
  // END FLASK SERVER BEFORE QUITTING
  if(flaskServer && flaskServer.pid) {
    await fetch('http://127.0.0.1:8080/api/pid')
      .then(async (response) => {
        const pid = await response.json() as number;

        console.log(pid)
        process.kill(pid)
      });
    flaskServer.kill()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

function getIconPath(icon: string) {
  return path.join(assetFolder, `${process.env.NODE_ENV === 'development' ? 'icons/' : ''}${icon}`)
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
