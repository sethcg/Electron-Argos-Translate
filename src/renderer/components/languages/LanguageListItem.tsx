import { FunctionComponent, useState, useEffect } from 'react'
import { FavoriteColumn } from './LanguageListItem/FavoriteColumn'
import { EnableColumn } from './LanguageListItem/EnableColumn'
import { DownloadColumn } from './LanguageListItem/DownloadColumn'
import { Language } from '~shared/types'
import clsx from 'clsx'

interface Props {
  code: string
  name: string
  isEnabled: boolean
  isInstalled: boolean
  isFavorited: boolean
  enableCallback: (code: string, enabled: boolean, callback: (enabled: boolean) => void) => void
  favoriteCallback: (code: string, favorite: boolean, callback: (favorite: boolean) => void) => void
}

export const LanguageListItem: FunctionComponent<Props> = ({
  code,
  name,
  isEnabled,
  isInstalled,
  isFavorited,
  enableCallback,
  favoriteCallback,
}) => {
  const [enabled, setEnabled] = useState<boolean>(isEnabled)
  const [installed, setInstalled] = useState<boolean>(isInstalled)
  const [favorite, setFavorite] = useState<boolean>(isFavorited)

  const localStorageKey: string = `downloading:${code}`
  const isDownloading: boolean = localStorage.getItem(localStorageKey) === 'true'
  const [downloading, setDownloading] = useState<boolean>(isDownloading)

  useEffect(() => {}, [enabled, favorite, installed])
  const handleEnable = async (enabled: boolean) => {
    // WHEN DISABLING A LANGUAGE, SET SOURCE/TARGET TO DEFAULT IF NECESSARY
    if (!enabled) {
      const source: Language | undefined = (await window.main.store.get('source_language')) as Language | undefined
      const target: Language | undefined = (await window.main.store.get('target_language')) as Language | undefined

      const defaultLanguage: Language = { code: '', name: 'None', enabled: false, installed: false, favorited: false }
      if (source && source.code === code) window.main.store.set('source_language', defaultLanguage)
      if (target && target.code === code) window.main.store.set('target_language', defaultLanguage)
    }
    setEnabled(enabled)
  }

  const handleFavorite = async (favorite: boolean) => setFavorite(favorite)

  const handleInstall = (code: string, installed: boolean) => {
    const isRemove: boolean = installed
    if (isRemove) {
      window.main.package.deletePackage(code)
    } else {
      setDownloading(true)
      localStorage.setItem(localStorageKey, 'true')
      window.main.package.downloadPackage(code)
    }
  }

  useEffect(() => {
    localStorage.removeItem(localStorageKey)
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
        localStorage.removeItem(localStorageKey)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // TO-DO: ADD FAVORITE FEATURE COLUMN; ALLOWING USERS TO SELECT LANGUAGES AS FAVORITES
  return (
    <li className={`font-bold text-xl rounded-lg mx-2 border-2 border-charcoal-50 dark:border-charcoal-950`}>
      <div className={`${clsx('size-full flex flex-row justify-start items-center gap-4 rounded-md px-2 py-[6px]', 'bg-charcoal-700')}`}>
        <FavoriteColumn
          favorited={favorite}
          disabled={!installed || downloading}
          callback={() => favoriteCallback(code, !favorite, handleFavorite)}
        />
        <EnableColumn
          enabled={enabled}
          installed={installed}
          disabled={!installed || downloading}
          callback={() => enableCallback(code, !enabled, handleEnable)}
        />
        <span className={`grow flex items-center px-2 h-[40px]`}>
          <span className={`${installed ? '' : 'text-charcoal-700 dark:text-charcoal-200'}`}>{name}</span>
        </span>
        <DownloadColumn installed={installed} downloading={downloading} callback={() => handleInstall(code, installed)} />
      </div>
    </li>
  )
}
