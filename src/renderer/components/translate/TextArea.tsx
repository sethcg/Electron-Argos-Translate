import { Textarea } from '@headlessui/react'
import { FunctionComponent, RefObject } from 'react'
import clsx from 'clsx'

interface Props {
  className: string
  textRef: RefObject<HTMLInputElement | null>
  defaultValue?: string | undefined
  translateCallback?: () => void
}

export const SourceTextArea: FunctionComponent<Props> = ({ className, textRef, translateCallback }) => {
  return (
    <div className={`${className}`}>
      <Textarea
        ref={textRef}
        onChange={translateCallback}
        spellCheck={false}
        className={`min-w-24 ${clsx(
          'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
        rows={6}
      />
    </div>
  )
}

export const TargetTextArea: FunctionComponent<Props> = ({ className, textRef }) => {
  return (
    <div className={`${className}`}>
      <Textarea
        disabled
        ref={textRef}
        spellCheck={false}
        className={`min-w-24 ${clsx(
          'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white placeholder:text-gray-300 placeholder:italic',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
        placeholder="Translate"
        rows={6}
      />
    </div>
  )
}
