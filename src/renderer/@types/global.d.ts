export declare global {
  interface Window {
    main: {
      minimizeWindow(): void
      maximizeWindow(): void
      restoreWindow(): void
      closeWindow(): void
      store: {
        set(key: string, value: unknown): void
        get(key: string): Promise<unknown>
        reset(key: string): void
      }
      safeStorage: {
        decryptString(value: string): string
        encryptString(value: string): Buffer
      }
    }
    api: {
      translate(source: string, target: string, value: string): Promise<TranslateResponse | FetchError>
      setup(): Promise<void>
    }
  }
}
