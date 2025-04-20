import { FunctionComponent } from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

interface Props {
  enabled: boolean
  disabled: boolean
  installed: boolean
  callback: () => void
}

export const EnableColumn: FunctionComponent<Props> = ({ enabled, disabled, installed, callback }) => {
  return (
    <Switch
      checked={enabled}
      disabled={disabled}
      onChange={callback}
      className={`${clsx(
        'group relative flex h-7 w-14 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none',
        `${installed ? 'dark:bg-red-500/30 dark:hover:bg-red-500/40 data-checked:dark:bg-emerald-500/30 data-checked:dark:hover:bg-emerald-500/40' : 'dark:bg-charcoal-600 dark:hover:bg-charcoal-600'}`
      )}`}>
      <span
        className={`${clsx(
          'pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg',
          'transition duration-200 ease-in-out group-data-[checked]:translate-x-7',
          `${installed ? 'bg-white' : 'bg-charcoal-400'}`
        )}`}
      />
    </Switch>
  )
}
