import { FunctionComponent, useCallback, useRef, useState } from 'react'
import { LanguageSelect } from '~components/translate/LanguageSelect'
import { LanguageSwapButton } from '~components/translate/LanguageSwap'
import { SourceTextArea, TargetTextArea } from '~components/translate/TextArea'
import { TranslateResponse, Language } from '~shared/types'

export const TranslatePage: FunctionComponent = () => {
  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  const [inputSelectState, setInputSelectState] = useState<Language>({ code: '', name: '', enabled: false })
  const [outputSelectState, setOutputSelectState] = useState<Language>({ code: '', name: '', enabled: false })

  const translate = useCallback(async (): Promise<void> => {
    if (inputTextRef.current && inputTextRef.current.value) {
      const source: string = (await window.main.store.get('language.source_code')) as string
      const target: string = (await window.main.store.get('language.target_code')) as string

      const translation: TranslateResponse | undefined = await window.api.translate(source, target, inputTextRef.current.value)
      const text: string = translation?.text ?? ''
      // console.log(translation)

      if (outputTextRef.current) {
        outputTextRef.current.value = text
        // console.log(text)
      }
    }
  }, [inputTextRef])

  return (
    <div className="grow flex flex-col size-full px-2 py-4">
      <div className="flex max-[900px]:flex-col flex-row grow px-4">
        <div className="flex flex-col min-[900px]:max-w-2xl max-h-96 grow">
          <LanguageSelect
            isSource={true}
            title={'Translate from'}
            selectState={inputSelectState}
            setSelectState={setInputSelectState}
            translateCallback={translate}
          />
          <SourceTextArea className={'flex grow'} textRef={inputTextRef} translateCallback={translate} />
        </div>
        <div className="flex m-4 justify-center">
          <LanguageSwapButton
            translateCallback={translate}
            inputSelectState={inputSelectState}
            setInputSelectState={setInputSelectState}
            outputSelectState={outputSelectState}
            setOutputSelectState={setOutputSelectState}
            inputTextRef={inputTextRef}
            outputTextRef={outputTextRef}
          />
        </div>
        <div className="flex flex-col min-[900px]:max-w-2xl max-h-96 grow">
          <LanguageSelect
            isSource={false}
            title={'Translate to'}
            selectState={outputSelectState}
            setSelectState={setOutputSelectState}
            translateCallback={translate}
          />
          <TargetTextArea className={'flex grow'} textRef={outputTextRef} />
        </div>
      </div>
    </div>
  )
}
