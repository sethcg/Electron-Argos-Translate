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
  package: {
    setMaxPackageListeners: (languageCount: number) => ipcRenderer.setMaxListeners(languageCount),
    removePackageListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
    deletePackage: async (code: string) => await ipcRenderer.invoke('package:delete', code),
    deleteComplete: (callback: (languageCode: string) => void) =>
      ipcRenderer.on('package:deleteComplete', (_, code: string) => callback(code)),
    downloadPackage: async (code: string) => await ipcRenderer.invoke('package:download', code),
    downloadComplete: (callback: (languageCode: string) => void) =>
      ipcRenderer.on('package:downloadComplete', (_, code: string) => callback(code)),
  },
})

contextBridge.exposeInMainWorld('api', {
  translate: async (source: string, target: string, value: string): Promise<TranslateResponse | FetchError> =>
    await ipcRenderer.invoke('flaskApi:translate', source, target, value),
})
