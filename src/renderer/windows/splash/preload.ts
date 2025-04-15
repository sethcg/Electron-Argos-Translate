import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('main', {
  store: {
    get: async (key: string) => await ipcRenderer.invoke('settings:get', key),
  }
})
