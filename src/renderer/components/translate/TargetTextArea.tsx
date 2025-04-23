import { Textarea } from '@headlessui/react'
import { FunctionComponent, RefObject } from 'react'
import clsx from 'clsx'

interface Props {
  textRef: RefObject<HTMLInputElement | null>
}

export const TargetTextArea: FunctionComponent<Props> = ({ textRef }) => {
  return (
    <div className={'relative size-full transition-colors duration-700'}>
      <Textarea
        ref={textRef}
        disabled
        spellCheck={false}
        placeholder={'Translate'}
        className={`${clsx(
          'absolute block size-full resize-none rounded-lg border-none py-1.5 px-3 text-sm',
          'dark:bg-charcoal-400/70 bg-charcoal-50',
          'focus:outline-none dark:placeholder:text-charcoal-200 placeholder:text-charcoal-700 placeholder:italic'
        )}`}
      />
    </div>
  )
}
