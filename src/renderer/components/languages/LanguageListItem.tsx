import { FunctionComponent, useCallback, useMemo, useState, useEffect } from 'react'
import { Checkbox, Switch } from '@headlessui/react'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import clsx from 'clsx'

interface Props {
  code: string
  name: string
  isEnabled?: boolean
  isSelected?: boolean
  updateCallback: (code: string, enabled: boolean, callback: (enabled: boolean) => void) => void
}

export const LanguageListItem: FunctionComponent<Props> = ({ code, name, updateCallback, isEnabled = false, isSelected = false }) => {
  const [enabled, setEnabled] = useState<boolean>(isEnabled)
  const [selected, setSelected] = useState<boolean>(isSelected)

  useEffect(() => {}, [selected, enabled])
  const callback = useCallback((enabled: boolean) => {
    setEnabled(enabled)
  }, [])

  // TO-DO: ADD FAVORITE FEATURE; ALLOWING USERS TO SELECT LANGUAGES AS FAVORITES
  return (
    <li className={`font-bold text-xl rounded-lg mx-2 border-2 border-charcoal-50 dark:border-charcoal-950`}>
      {useMemo(() => {
        return (
          <div
            className={`${clsx(
              'size-full flex flex-row justify-start items-center gap-4 rounded-md px-2 py-[6px]',
              'bg-charcoal-700 hover:bg-charcoal-800'
            )}`}
            onClick={() => updateCallback(code, !enabled, callback)}>
            <Checkbox
              hidden // TO-DO: ADD CHECKBOX/OPTIONS BUTTON FOR CHANGING MULTIPLE ROWS
              checked={selected}
              onClick={() => setSelected(!selected)}
              className={`${clsx(
                'flex justify-center items-center rounded-md p-[6px] cursor-pointer',
                `${selected ? 'bg-charcoal-600' : 'bg-charcoal-50'}`
              )}`}>
              <CheckRoundedIcon sx={{ fontSize: 16 }} className={`${selected ? 'block' : 'hidden'}`} />
            </Checkbox>
            <span className={`grow flex px-2`}>
              <span>{name}</span>
            </span>
            <Switch
              checked={enabled}
              className={`${clsx(
                'group relative flex h-7 w-14 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none',
                `${enabled ? 'dark:bg-emerald-500/30 dark:hover:bg-emerald-500/40' : 'dark:bg-red-500/30 dark:hover:bg-red-500/40'}`
              )}`}>
              <span
                className={`${clsx(
                  'pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg',
                  'bg-white transition duration-200 ease-in-out group-data-[checked]:translate-x-7'
                )}`}
              />
            </Switch>
          </div>
        )
      }, [code, name, selected, enabled, callback, updateCallback])}
    </li>
  )
}
