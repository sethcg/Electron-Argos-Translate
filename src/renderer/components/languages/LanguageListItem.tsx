import { FunctionComponent, useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'

interface Props {
  code: string
  name: string
  isEnabled: boolean
  updateCallback: (code: string, enabled: boolean, callback: (enabled: boolean) => void) => void
}

export const LanguageListItem: FunctionComponent<Props> = ({ code, name, updateCallback, isEnabled = false }) => {
  const [enabled, setEnabled] = useState<boolean>(isEnabled)
  const callback = useCallback((enabled: boolean) => {
    setEnabled(enabled)
  }, [])

  return (
    <li className={`font-bold text-xl rounded-lg mx-2 border-2 border-charcoal-50 dark:border-charcoal-950`}>
      {useMemo(() => {
        return (
          <button
            onClick={() => updateCallback(code, !enabled, callback)}
            className={`${clsx(
              'size-full flex flex-row justify-start items-center gap-4 rounded-md',
              `${enabled ? 'dark:bg-emerald-600/50 dark:hover:bg-emerald-500/50' : 'dark:bg-red-600/50 dark:hover:bg-red-500/50'}`,
              'bg-charcoal-900 hover:bg-charcoal-950 '
            )}`}
          >
            <span className={`grow`}>{name}</span>
            <span className={`text-sm px-2`}>{enabled ? 'enabled' : 'disabled'}</span>
          </button>
        )
      }, [code, name, enabled])}
    </li>
  )
}
