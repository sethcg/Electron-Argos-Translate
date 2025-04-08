import { Textarea } from '@headlessui/react'
import { ChangeEvent, FunctionComponent, RefObject, useState } from 'react'
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

  return (
    <div className="relative size-full">
      <Textarea
        ref={textRef}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          setCharCount(event.target.value.length)
          if (translateCallback) translateCallback()
        }}
        spellCheck={false}
        maxLength={charMax}
        className={`${className} ${clsx(
          'absolute block size-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
      />
      <span className="absolute select-none text-white text-sm pb-[5px] pr-[10px] bottom-0 right-0 font-roboto">{`${charCount} / ${charMax}`}</span>
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
          'absolute block size-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white placeholder:text-gray-300 placeholder:italic',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
      />
    </div>
  )
}
