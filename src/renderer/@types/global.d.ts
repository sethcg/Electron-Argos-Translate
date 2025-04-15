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
    }
    api: {
      translate(source: string, target: string, value: string): Promise<TranslateResponse | FetchError>
    }
  }
}
