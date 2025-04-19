export declare global {
  interface Window {
    main: {
      minimizeWindow(): void
      maximizeWindow(): void
      closeWindow(): void
      store: {
        set(key: string, value: unknown): void
        get(key: string): Promise<unknown>
        reset(key: string): void
      }
      computer: {
        getAvailableThreads(): Promise<number>
      }
      package: {
        setMaxPackageListeners: (languageCount: number) => void
        removePackageListeners: (channel: string) => void
        deletePackage(code: string): Promise<void>
        deleteComplete: (callback: (languageCode: string) => void) => Electron.IpcRenderer
        downloadPackage(code: string): Promise<void>
        downloadComplete: (callback: (languageCode: string) => void) => Electron.IpcRenderer
      }
    }
    api: {
      translate(source: string, target: string, value: string): Promise<TranslateResponse | FetchError>
    }
  }
}
