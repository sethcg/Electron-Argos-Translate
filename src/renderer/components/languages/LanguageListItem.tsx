import { FunctionComponent, useCallback, useState, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import clsx from 'clsx'

interface Props {
  code: string
  name: string
  isEnabled: boolean
  isInstalled: boolean
  enableCallback: (code: string, enabled: boolean, callback: (enabled: boolean) => void) => void
}

export const LanguageListItem: FunctionComponent<Props> = ({ code, name, enableCallback, isEnabled, isInstalled }) => {
  const [enabled, setEnabled] = useState<boolean>(isEnabled)
  const [installed, setInstalled] = useState<boolean>(isInstalled)
  const [downloading, setDownloading] = useState<boolean>(false)

  useEffect(() => {}, [enabled, installed])
  const setEnabledCallback = useCallback((enabled: boolean) => {
    setEnabled(enabled)
  }, [])

  const handleInstall = (code: string, installed: boolean) => {
    const isRemove: boolean = installed
    if (isRemove) {
      window.main.package.deletePackage(code)
    } else {
      setDownloading(true)
      window.main.package.downloadPackage(code)
    }
  }

  useEffect(() => {
    window.main.package.deleteComplete((languageCode: string) => {
      if (languageCode == code) {
        setEnabled(false)
        setInstalled(false)
      }
    })
    window.main.package.downloadComplete((languageCode: string) => {
      if (languageCode == code) {
        setEnabled(true)
        setInstalled(true)
        setDownloading(false)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TO-DO: ADD FAVORITE FEATURE; ALLOWING USERS TO SELECT LANGUAGES AS FAVORITES
  // TO-DO: ADD VISUAL FOR DOWNLOAD, SO USER IS AWARE OF THE PROCESS
  return (
    <li className={`font-bold text-xl rounded-lg mx-2 border-2 border-charcoal-50 dark:border-charcoal-950`}>
      <div className={`${clsx('size-full flex flex-row justify-start items-center gap-4 rounded-md px-2 py-[6px]', 'bg-charcoal-700')}`}>
        <Switch
          checked={enabled}
          disabled={!installed || downloading}
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
        <span className={`grow flex items-center px-2 h-[40px]`}>
          <span className={`${installed ? '' : 'text-charcoal-700 dark:text-charcoal-200'}`}>{name}</span>
        </span>
        <div
          className={`${clsx(
            `${downloading ? '' : 'hidden'}`,
            'flex flex-row gap-[3px] justify-center items-center px-[10px] py-[5px] rounded-lg',
            'dark:bg-amber-500/30'
          )}`}>
          <span className="text-sm font-roboto">Downloading</span>
          <div className="pt-3 flex flex-row gap-[3px]">
            <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-1.6s]"></div>
            <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-2.4s]"></div>
            <div className="size-1 rounded-full bg-charcoal-700 dark:bg-charcoal-50 animate-bounce [animation-delay:-3.2s]"></div>
          </div>
        </div>
        <div className="group relative size-[40px]">
          <button
            disabled={downloading}
            onClick={() => handleInstall(code, installed)}
            className={`${clsx(
              'flex flex-row justify-center items-center cursor-pointer rounded-md p-1 gap-[1px] transition-all duration-200 ease-in-out focus:outline-none',
              `${
                installed
                  ? 'dark:bg-red-500/30 dark:hover:bg-red-500/40'
                  : downloading
                    ? 'dark:bg-amber-500/30 dark:hover:bg-amber-500/40'
                    : 'dark:bg-emerald-500/30 dark:hover:bg-emerald-500/40'
              }`
            )}`}>
            {installed ? (
              <DeleteForeverRoundedIcon sx={{ fontSize: 32 }} />
            ) : downloading ? (
              <AccessTimeRoundedIcon sx={{ fontSize: 32 }} />
            ) : (
              <FileDownloadRoundedIcon sx={{ fontSize: 32 }} />
            )}
          </button>
          <span
            className={`${clsx(
              `${downloading ? 'hidden' : ''}`,
              'absolute right-12 top-1.5 scale-0 rounded px-2 py-1 text-sm group-hover:scale-100 transition-opacity',
              `${installed ? 'bg-red-500/20' : 'bg-emerald-500/20'}`
            )}`}>
            <span>{installed ? 'Delete' : 'Download'}</span>
          </span>
        </div>
      </div>
    </li>
  )
}
