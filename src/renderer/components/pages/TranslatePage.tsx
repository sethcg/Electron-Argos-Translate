import { FunctionComponent, useCallback, useRef } from 'react'
import { LanguageSelect } from '~components/translate/LanguageSelect'
import { LanguageSwapButton } from '~components/translate/LanguageSwap'
import { SourceTextArea, TargetTextArea } from '~components/translate/TextArea'
import { TranslateResponse } from '~shared/types'

export const TranslatePage: FunctionComponent = () => {
  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  const inputSelectRef = useRef<HTMLInputElement>(null)
  const outputSelectRef = useRef<HTMLInputElement>(null)

  const translate = useCallback(async (): Promise<void> => {
    if (inputTextRef.current) {
      const source: string = (await window.main.store.get('language.source_code')) as string
      const target: string = (await window.main.store.get('language.target_code')) as string

      const translation: TranslateResponse | undefined = await window.api.translate(source, target, inputTextRef.current.value)
      const text: string = translation?.text ?? ''

      if (outputTextRef.current) {
        outputTextRef.current.value = text
        console.log(text)
      }
    }
  }, [inputTextRef])

  return (
    <div className="grow flex flex-col w-full h-64 p-2">
      <div className="flex flex-row grow px-4">
        <div className="flex flex-col grow max-w-xl">
          <LanguageSelect
            className={'grow-0 pl-2 '}
            selectRef={inputSelectRef}
            isSource={true}
            title={'Translate from'}
            storeKey={'language.source_code'}
            translateCallback={translate}
          />
          <SourceTextArea className={'grow max-w-xl h-48'} textRef={inputTextRef} translateCallback={translate} />
        </div>
        <div className="flex justify-center w-[64px] w-max-[64px] w-min-[64px]">
          <LanguageSwapButton
            className={''}
            translateCallback={translate}
            inputSelectRef={inputSelectRef}
            outputSelectRef={outputSelectRef}
            inputTextRef={inputTextRef}
            outputTextRef={outputTextRef}
          />
        </div>
        <div className="flex flex-col grow max-w-xl">
          <LanguageSelect
            className={'grow-0 pl-2'}
            selectRef={outputSelectRef}
            isSource={false}
            title={'Translate to'}
            storeKey={'language.target_code'}
            translateCallback={translate}
          />
          <TargetTextArea className={'grow max-w-xl h-48'} textRef={outputTextRef} />
        </div>
      </div>
    </div>
  )
}
