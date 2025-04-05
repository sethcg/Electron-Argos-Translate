import { FunctionComponent, useRef } from 'react'
import { TextArea } from '~components/translate/TextArea.tsx'
import { TranslateButton } from '~components/translate/TranslateButton'

export const TranslatePage: FunctionComponent = () => {
  const inputTextRef = useRef<HTMLInputElement>(null)
  const outputTextRef = useRef<HTMLInputElement>(null)

  return (
    <div className="grow flex flex-col gap-6 px-4 pt-2">
      <div className="flex flex-row w-full h-64 gap-4">
        <TextArea title={'Translate from'} isSource={true} storeKey={'language.source_code'} textRef={inputTextRef} />
        <TextArea title={'Translate to'} isSource={false} storeKey={'language.target_code'} textRef={outputTextRef} />
      </div>
      <TranslateButton className={'self-start'} inputTextRef={inputTextRef} outputTextRef={outputTextRef} />
    </div>
  )
}
