import { FunctionComponent, useMemo } from 'react'
import { Switch } from '@headlessui/react'
import clsx from 'clsx'

interface Props {
  enabled: boolean
  disabled: boolean
  installed: boolean
  callback: () => void
}

export const EnableColumn: FunctionComponent<Props> = ({ enabled, disabled, installed, callback }) => {
  return useMemo(() => {
    return (
      <Switch
        checked={enabled}
        disabled={disabled}
        onChange={callback}
        className={`${clsx(
          'group relative cursor-pointer flex h-7 w-14 rounded-full p-1 focus:outline-none',
          'transition-[background-color] duration-700',
          `${
            installed
              ? 'bg-red-500/55 hover:bg-red-500/65 data-checked:bg-emerald-500/60 data-checked:hover:bg-emerald-500/80 dark:bg-red-500/30 dark:hover:bg-red-500/40 data-checked:dark:bg-emerald-500/30 data-checked:dark:hover:bg-emerald-500/40'
              : 'bg-charcoal-100 dark:bg-charcoal-600'
          }`
        )}`}>
        <span
          className={`${clsx(
            'pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg group-data-[checked]:translate-x-7',
            'transition-all duration-700',
            `${installed ? 'bg-charcoal-700 dark:bg-charcoal-50' : 'bg-charcoal-400 dark:bg-charcoal-400'}`
          )}`}
        />
      </Switch>
    )
  }, [callback, disabled, enabled, installed])
}
