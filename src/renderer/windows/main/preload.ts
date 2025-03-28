// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('main', {
  minimizeWindow: () => ipcRenderer.send('mainWindow:minimize'),
  maximizeWindow: () => ipcRenderer.send('mainWindow:maximize'),
  restoreWindow: () => ipcRenderer.send('mainWindow:restore'),
  closeWindow: () => ipcRenderer.send('mainWindow:close'),
})
contextBridge.exposeInMainWorld('translate', {
  translateEnglishToSpanish: async (value: string): Promise<string | undefined> =>
    await ipcRenderer.invoke('handleTranslate:translateEnglishToSpanish', value),
  translateSpanishToEnglish: async (value: string): Promise<string | undefined> =>
    await ipcRenderer.invoke('handleTranslate:translateSpanishToEnglish', value),
})
