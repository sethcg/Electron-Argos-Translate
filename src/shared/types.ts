// RESPONSE FROM THE FLASK SERVER ON ENDPOINT "/api/translate"
export type TranslateResponse = {
  text: string
  alternatives: string[]
}
