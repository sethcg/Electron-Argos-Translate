export type TranslateResponse = {
  text: string
  alternatives: string[]
}

export type LanguagePackage = {
  id: number
  package_version: string
  source_code: string /* ISO language code */
  target_code: string /* ISO language code */
  source_name: string
  target_name: string
  link: string
  filename: string
}

export type Language = {
  code: string /* ISO language code */
  name: string
  enabled: boolean
}

export type StoreType = {
  dark_mode: boolean
  source_language: Language | undefined
  target_language: Language | undefined
  translate: {
    inter_threads: number /* Maximum number of translation threads */
  }
  packages: LanguagePackage[]
  languages: Language[]
}
