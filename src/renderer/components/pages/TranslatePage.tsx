import { FunctionComponent, useRef } from 'react'
import { LanguageSelect } from '~components/translate/LanguageSelect'
import { LanguageSwapButton } from '~components/translate/LanguageSwap'
import { SourceTextArea, TargetTextArea } from '~components/translate/TextArea'
import { TranslateButton } from '~components/translate/TranslateButton'

export const TranslatePage: FunctionComponent = () => {
  const defaultTargetValue = 'Translate'

  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  const inputSelectRef = useRef<HTMLInputElement>(null)
  const outputSelectRef = useRef<HTMLInputElement>(null)

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
          />
          <SourceTextArea className={'grow max-w-xl h-48'} defaultValue={undefined} textRef={inputTextRef} />
        </div>
        <div className="flex justify-center w-[64px] w-max-[64px] w-min-[64px]">
          <LanguageSwapButton
            className={''}
            defaultTargetValue={defaultTargetValue}
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
          />
          <TargetTextArea className={'grow max-w-xl h-48'} defaultValue={defaultTargetValue} textRef={outputTextRef} />
        </div>
      </div>

      {/* TO-DO: FIX TRANSLATION TO BE ON TEXT CHANGE, OR MAKE THIS BUTTON LOOK BETTER */}
      <TranslateButton className={''} defaultTargetValue={defaultTargetValue} inputTextRef={inputTextRef} outputTextRef={outputTextRef} />
    </div>
  )
}
