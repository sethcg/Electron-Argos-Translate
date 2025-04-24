import { FunctionComponent, useCallback, useEffect, useRef, useState } from 'react'
import { Textarea } from '@headlessui/react'
import { LanguageSelect } from '~components/translate/LanguageSelect'
import { LanguageSwapButton } from '~components/translate/LanguageSwap'
import { TargetTextArea } from '~components/translate/TargetTextArea'
import { Language, TranslateResponse } from '~shared/types'
import clsx from 'clsx'

export const TranslatePage: FunctionComponent = () => {
  const targetTextRef = useRef<HTMLInputElement>(null)

  const charMax: number = 2000
  const [charCount, setCharCount] = useState<number>(0)
  const [sourceText, setSourceText] = useState<string>('')

  const translate = useCallback(async (): Promise<void> => {
    if (sourceText.length > 0) {
      const source: Language | undefined = (await window.main.store.get('source_language')) as Language | undefined
      const target: Language | undefined = (await window.main.store.get('target_language')) as Language | undefined

      if (source && target && targetTextRef.current) {
        const translation: TranslateResponse | undefined = await window.main.translate(source.code, target.code, sourceText)
        const text: string = translation?.text ?? ''
        targetTextRef.current.value = text
      }
    } else if (targetTextRef.current) {
      // NO SOURCE, THEN SET TARGET TO DEFAULT VALUE
      targetTextRef.current.value = ''
    }
  }, [targetTextRef, sourceText])

  const swap = useCallback(async (): Promise<void> => {
    if (!(sourceText.length <= 0 && targetTextRef.current?.value)) return

    const source: Language | undefined = (await window.main.store.get('source_language')) as Language | undefined
    const target: Language | undefined = (await window.main.store.get('target_language')) as Language | undefined

    if (source && target) {
      window.main.store.set('source_language', target)
      window.main.store.set('target_language', source)

      const targetText: string = targetTextRef.current.value
      setSourceText(targetText)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // PREVENT SPAMMING THE FLASK SERVER, CHANGE AFTER DONE TYPING
    const timer = setTimeout(async () => {
      setCharCount(sourceText.length)
      await translate()
    }, 250)
    return () => clearTimeout(timer)
  }, [sourceText, translate])

  return (
    <div className="grow flex flex-col size-full px-2 py-4">
      <div className="flex max-[960px]:flex-col flex-row grow px-4">
        <div className="flex flex-col min-[960px]:max-w-2xl max-h-96 grow">
          <LanguageSelect isSource={true} title={'Translate from'} callback={translate} />
          <div className="relative size-full">
            {/* SOURCE TEXT AREA */}
            <Textarea
              value={sourceText}
              onChange={event => setSourceText(event.target.value)}
              spellCheck={false}
              maxLength={2000}
              className={`${clsx(
                'absolute block size-full resize-none rounded-md border-none py-1.5 px-3 text-sm',
                'transition-colors duration-800',
                'dark:bg-charcoal-400/70 bg-charcoal-50',
                'focus:outline-none'
              )}`}
            />
            <span
              className={`${clsx(
                'absolute select-none text-sm pb-[5px] pr-[10px] bottom-0 right-0',
                'transition-[color] duration-800'
              )}`}>{`${charCount} / ${charMax}`}</span>
          </div>
        </div>
        <div className="flex m-4 size-10 justify-center">
          <LanguageSwapButton callback={swap} />
        </div>
        <div className="flex flex-col min-[960px]:max-w-2xl max-h-96 grow">
          <LanguageSelect isSource={false} title={'Translate to'} callback={translate} />
          <TargetTextArea textRef={targetTextRef} />
        </div>
      </div>
    </div>
  )
}
