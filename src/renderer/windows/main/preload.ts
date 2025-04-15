import { contextBridge, ipcRenderer } from 'electron'
import { FetchError } from 'node-fetch/@types'
import { StoreType, TranslateResponse } from '~shared/types'

contextBridge.exposeInMainWorld('main', {
  minimizeWindow: () => ipcRenderer.send('mainWindow:minimize'),
  maximizeWindow: () => ipcRenderer.send('mainWindow:maximize'),
  closeWindow: () => ipcRenderer.send('mainWindow:close'),
  store: {
    set: (key: string, value: unknown) => ipcRenderer.send('settings:set', key, value),
    get: async (key: string) => await ipcRenderer.invoke('settings:get', key),
    reset: (key: keyof StoreType) => ipcRenderer.send('settings:reset', key),
  },
  computer: {
    getAvailableThreads: async () => await ipcRenderer.invoke('availableThreads:get'),
  },
})

contextBridge.exposeInMainWorld('api', {
  translate: async (source: string, target: string, value: string): Promise<TranslateResponse | FetchError> =>
    await ipcRenderer.invoke('flaskApi:translate', source, target, value),
})
