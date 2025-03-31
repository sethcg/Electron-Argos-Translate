export declare global {
  interface Window {
    main: {
      minimizeWindow(): void
      maximizeWindow(): void
      restoreWindow(): void
      closeWindow(): void
    }
    api: {
      translate(source: string, target: string, value: string): Promise<TranslateResponse | FetchError>
    }
  }
}
