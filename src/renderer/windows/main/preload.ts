// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'
import { FetchError } from 'node-fetch/@types'
import { TranslateResponse } from '~shared/types'

contextBridge.exposeInMainWorld('main', {
  minimizeWindow: () => ipcRenderer.send('mainWindow:minimize'),
  maximizeWindow: () => ipcRenderer.send('mainWindow:maximize'),
  restoreWindow: () => ipcRenderer.send('mainWindow:restore'),
  closeWindow: () => ipcRenderer.send('mainWindow:close'),
})
contextBridge.exposeInMainWorld('api', {
  translate: async (source: string, target: string, value: string): Promise<TranslateResponse | FetchError> =>
    await ipcRenderer.invoke('flaskApi:translate', source, target, value)
})
