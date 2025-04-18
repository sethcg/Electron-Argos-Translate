import { ipcMain } from 'electron'
import { StoreType } from '~shared/types'
import ElectronStore from 'electron-store'

export default class Store {
  defaults: StoreType = {
    dark_mode: true,
    source_language: { code: '', name: 'None', enabled: false, installed: false },
    target_language: { code: '', name: 'None', enabled: false, installed: false },
    translate: {
      inter_threads: 1,
    },
    packages: [],
    languages: [],
  }
  store: ElectronStore<StoreType>

  constructor() {
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
    this.store.reset(key)
  }

  public resetThenSet = (key: keyof StoreType, value?: unknown): void => {
    this.store.reset(key)
    this.store.set(key as string, value)
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
