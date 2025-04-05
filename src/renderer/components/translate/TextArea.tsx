import { Textarea } from '@headlessui/react'
import { FunctionComponent, RefObject } from 'react'
import clsx from 'clsx'

interface Props {
  className: string
  textRef: RefObject<HTMLInputElement | null>
  storeKey: string
  title: string
}

export const SourceTextArea: FunctionComponent<Props> = ({ className, textRef }) => {
  return (
    <div className={`${className}`}>
      <Textarea
        ref={textRef}
        spellCheck={false}
        className={`min-w-24 h-48 ${clsx(
          'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
        rows={3}
      />
    </div>
  )
}

export const TargetTextArea: FunctionComponent<Props> = ({ className, textRef }) => {
  return (
    <div className={`${className}`}>
      <Textarea
        ref={textRef}
        spellCheck={false}
        className={`min-w-24 h-48 ${clsx(
          'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
          'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
        )}`}
        rows={3}
      />
    </div>
  )
}