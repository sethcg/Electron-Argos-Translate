import { BrowserWindow, ipcMain } from 'electron'
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

  window: BrowserWindow

  constructor(window: BrowserWindow) {
    this.window = window
    this.store = new ElectronStore<StoreType>({ defaults: this.defaults })

    // SETUP STORE RELATED IPC EVENTS
    this.setEvent()
    this.getEvent()
    this.resetEvent()
  }

  public set = (key: string, value?: unknown): void => {
    this.store.set(key, value)
  }

  public get = (key: string): unknown => {
    return this.store.get(key)
  }

  public reset = (key: keyof StoreType): void => {
    return this.store.reset(key)
  }

  private setEvent = (): void => {
    ipcMain.on('settings:set', (_event, key: string, value?: unknown) => this.store.set(key, value))
  }

  private getEvent = (): void => {
    ipcMain.handle('settings:get', (_event, key: string) => this.store.get(key))
  }

  private resetEvent = (): void => {
    ipcMain.handle('settings:reset', (_event, key: keyof StoreType) => this.store.reset(key))
  }
}
