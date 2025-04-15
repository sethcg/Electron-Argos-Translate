import { Textarea } from '@headlessui/react'
import { FunctionComponent, RefObject, useEffect, useState } from 'react'
import clsx from 'clsx'

interface Props {
  className: string
  textRef: RefObject<HTMLInputElement | null>
  defaultValue?: string | undefined
  charMax?: number | undefined
  translateCallback?: () => void
}

export const SourceTextArea: FunctionComponent<Props> = ({ className, textRef, charMax = 2000, translateCallback }) => {
  const [charCount, setCharCount] = useState<number>(0)
  const [text, setText] = useState<string>('')

  // PREVENT SPAMMING THE FLASK SERVER,
  // CHANGE AFTER DONE TYPING
  useEffect(() => {
    const timer = setTimeout(() => {
      setCharCount(text.length)
      if (translateCallback) translateCallback()
    }, 250)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <div className="relative size-full">
      <Textarea
        ref={textRef}
        value={text}
        onChange={event => setText(event.target.value)}
        spellCheck={false}
        maxLength={charMax}
        className={`${className} ${clsx(
          'absolute block size-full resize-none rounded-md border-none py-1.5 px-3 text-sm',
          'dark:bg-charcoal-400/70 bg-charcoal-50',
          'focus:outline-none'
        )}`}
      />
      <span className="absolute select-none text-sm pb-[5px] pr-[10px] bottom-0 right-0">{`${charCount} / ${charMax}`}</span>
    </div>
  )
}

export const TargetTextArea: FunctionComponent<Props> = ({ className, textRef }) => {
  return (
    <div className="relative size-full">
      <Textarea
        disabled
        ref={textRef}
        spellCheck={false}
        placeholder={'Translate'}
        className={`${className} ${clsx(
          'absolute block size-full resize-none rounded-lg border-none py-1.5 px-3 text-sm',
          'dark:bg-charcoal-400/70 bg-charcoal-50',
          'focus:outline-none dark:placeholder:text-charcoal-200 placeholder:text-charcoal-700 placeholder:italic'
        )}`}
      />
    </div>
  )
}
