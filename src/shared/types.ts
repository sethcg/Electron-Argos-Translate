export type TranslateResponse = {
  text: string
  alternatives: string[]
}

export type LanguagePackage = {
  id: number
  package_version: string
  source_code: string
  target_code: string
  source_name: string
  target_name: string
  link: string
  filename: string
}

export type Language = {
  code: string
  name: string
  enabled: boolean
  installed: boolean
}

export type StoreType = {
  dark_mode: boolean
  source_language: Language | undefined
  target_language: Language | undefined
  translate: {
    inter_threads: number /* Maximum number of translation threads */
  }
  languages: Language[]
}
