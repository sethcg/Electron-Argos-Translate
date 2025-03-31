// RESPONSE FROM THE FLASK SERVER ON ENDPOINT "/api/translate"
export type TranslateResponse = {
    translatedText: string,
    alternatives: string[],
};
  