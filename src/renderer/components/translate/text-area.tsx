import { Field, Textarea } from '@headlessui/react'
import { FunctionComponent, RefObject } from 'react'
import { LanguageSelect } from './language-select'
import clsx from 'clsx'

interface Props {
  textRef: RefObject<HTMLInputElement | null>,
  isSource: boolean,
  storeKey: string,
  title: string
}

export const TextArea: FunctionComponent<Props> = ({ textRef, isSource, storeKey, title }) => {
  return (
    <div className="w-full max-w-md">
      <Field>
        <LanguageSelect isSource={isSource} storeKey={storeKey} title={title} />
        <Textarea
          ref={textRef}
          spellCheck={false}
          className={`h-48 ${clsx(
            'mt-3 block w-full resize-none rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
          )}`}
          rows={3}
        />
      </Field>
    </div>
  )
}