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

export type StoreType = {
  version: number
  language: {
    source_code: string /* ISO language code */
    target_code: string /* ISO language code */
  }
  packages: LanguagePackage[]
}
