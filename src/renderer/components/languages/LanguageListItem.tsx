import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import clsx from 'clsx'

interface Props {
  code: string
  name: string
  isEnabled: boolean
  isInstalled: boolean
  isSelected?: boolean
  enableCallback: (code: string, enabled: boolean, callback: (enabled: boolean) => void) => void
  installCallback: (code: string, installed: boolean, callback: (installed: boolean) => void) => void
}

export const LanguageListItem: FunctionComponent<Props> = ({ code, name, enableCallback, isEnabled, installCallback, isInstalled }) => {
  const [enabled, setEnabled] = useState<boolean>(isEnabled)
  const [installed, setInstalled] = useState<boolean>(isInstalled)

  useEffect(() => {}, [enabled, installed])
  const setEnabledCallback = useCallback((enabled: boolean) => {
    setEnabled(enabled)
  }, [])
  const setInstalledCallback = useCallback((installed: boolean) => {
    setEnabled(false)
    setInstalled(installed)
  }, [])

  // TO-DO: ADD FAVORITE FEATURE; ALLOWING USERS TO SELECT LANGUAGES AS FAVORITES
  // TO-DO: ADD VISUAL FOR DOWNLOAD, SO USER IS AWARE OF THE PROCESS
  return (
    <li className={`font-bold text-xl rounded-lg mx-2 border-2 border-charcoal-50 dark:border-charcoal-950`}>
      <div className={`${clsx('size-full flex flex-row justify-start items-center gap-4 rounded-md px-2 py-[6px]', 'bg-charcoal-700')}`}>
        <Switch
          checked={enabled}
          disabled={!installed}
          onChange={() => enableCallback(code, !enabled, setEnabledCallback)}
          className={`${clsx(
            'group relative flex h-7 w-14 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none',
            `${!installed ? 'dark:bg-charcoal-600 dark:hover:bg-charcoal-600' : 'dark:bg-red-500/30 dark:hover:bg-red-500/40 data-checked:dark:bg-emerald-500/30 data-checked:dark:hover:bg-emerald-500/40'}`
          )}`}>
          <span
            className={`${clsx(
              'pointer-events-none inline-block size-5 translate-x-0 rounded-full ring-0 shadow-lg',
              'transition duration-200 ease-in-out group-data-[checked]:translate-x-7',
              `${installed ? 'bg-white' : 'bg-charcoal-400'}`
            )}`}
          />
        </Switch>
        <span className={`grow flex px-2`}>
          <span className={`${installed ? '' : 'text-charcoal-700 dark:text-charcoal-200'}`}>{name}</span>
        </span>
        <div className="group relative">
          <button
            onClick={() => installCallback(code, installed, setInstalledCallback)}
            className={`${clsx(
              'flex flex-row justify-center items-center cursor-pointer rounded-md p-1 gap-[1px] transition-all duration-200 ease-in-out focus:outline-none',
              `${installed ? 'dark:bg-red-500/30 dark:hover:bg-red-500/40' : 'dark:bg-emerald-500/30 dark:hover:bg-emerald-500/40'}`
            )}`}>
            {installed ? <DeleteForeverRoundedIcon sx={{ fontSize: 32 }} /> : <FileDownloadRoundedIcon sx={{ fontSize: 32 }} />}
          </button>
          <span
            className={`${clsx(
              'absolute right-12 top-1.5 scale-0 rounded px-2 py-1 text-sm text-white group-hover:scale-100 transition-opacity',
              `${installed ? 'bg-red-500/20' : 'bg-emerald-500/20'}`
            )}`}>
            <span>{installed ? 'Delete' : 'Download'}</span>
          </span>
        </div>
      </div>
    </li>
  )
}
