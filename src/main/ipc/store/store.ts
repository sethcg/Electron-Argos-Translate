import { BrowserWindow, ipcMain, safeStorage } from 'electron'
import { StoreType } from '~shared/types'
import ElectronStore from 'electron-store'

export default class Store {
  defaults: StoreType = {
    version: 1,
    language: {
      source_code: 'en',
      target_code: 'es',
    },
    packages: [],
  }
  store: ElectronStore<StoreType>

  canEncrypt: boolean
  window: BrowserWindow

  constructor(window: BrowserWindow) {
    this.window = window
    this.canEncrypt = safeStorage.isEncryptionAvailable()
    this.store = new ElectronStore<StoreType>({ defaults: this.defaults })

    // SETUP IPC EVENTS
    this.set()
    this.get()
    this.reset()
    this.encryptString()
    this.decryptString()
  }

  private set = (): void => {
    ipcMain.on('settings:set', (event, key: string, value?: unknown) => {
      if (this.window.id === event.sender.id && value) {
        this.store.set(key, value)
      }
    })
  }

  private get = (): void => {
    ipcMain.handle('settings:get', (event, key: string) => {
      if (this.window.id === event.sender.id) {
        return this.store.get(key)
      }
    })
  }

  private reset = (): void => {
    ipcMain.handle('settings:reset', (event, key: keyof StoreType) => {
      if (this.window.id === event.sender.id) {
        this.store.reset(key)
      }
    })
  }

  private encryptString = (): void => {
    ipcMain.handle('safeStorage:encryptString', (event, value: string) => {
      if (this.canEncrypt && this.window.id === event.sender.id) {
        return safeStorage.encryptString(value).toString('hex')
      }
    })
  }

  private decryptString = (): void => {
    ipcMain.handle('safeStorage:decryptString', (event, value: string) => {
      if (this.canEncrypt && this.window.id === event.sender.id) {
        return safeStorage.decryptString(Buffer.from(value, 'hex'))
      }
    })
  }
}
