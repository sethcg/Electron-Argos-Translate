export declare global {
  interface Window {
    main: {
      // GENERAL
      setMaxListeners: (count: number) => void
      removeListeners: (channel: string) => void

      // WINDOW FUNCTIONS
      minimizeWindow(): void
      maximizeWindow(): void
      closeWindow(): void

      // COLOR SCHEME
      changeColorScheme(isDarkMode: boolean): Promise<void>
      colorSchemeChanged: (callback: (isDarkMode: boolean) => void) => Electron.IpcRenderer

      // CONFIGURATION STORAGE
      store: {
        set(key: string, value: unknown): void
        get(key: string): Promise<unknown>
        reset(key: string): void
      }

      // COMPUTER SPECIFICATIONS
      computer: {
        getAvailableThreads(): Promise<number>
      }

      // PACKAGE MANAGEMENT
      package: {
        deletePackage(code: string): Promise<void>
        deleteComplete: (callback: (languageCode: string) => void) => Electron.IpcRenderer
        downloadPackage(code: string): Promise<void>
        downloadComplete: (callback: (languageCode: string) => void) => Electron.IpcRenderer
      }

      // TRANSLATION
      translate(source: string, target: string, value: string): Promise<TranslateResponse | FetchError>
    }
  }
}
