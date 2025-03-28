export declare global {
  interface Window {
    main: {
      minimizeWindow(): void
      maximizeWindow(): void
      restoreWindow(): void
      closeWindow(): void
    }
    translate: {
      translateEnglishToSpanish(value: string): Promise<string | undefined>
      translateSpanishToEnglish(value: string): Promise<string | undefined>
    }
  }
}
