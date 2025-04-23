import { useState, FunctionComponent, useEffect } from 'react'
import { Switch } from '@headlessui/react'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import clsx from 'clsx'

interface Props {
  expanded: boolean
}

export const DarkModeToggle: FunctionComponent<Props> = ({ expanded }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  useEffect(() => {
    async function getDarkMode() {
      const isDarkMode: boolean = (await window.main.store.get('dark_mode')) as boolean
      setIsDarkMode(isDarkMode)
    }
    getDarkMode()
  }, [])

  const handleChange = async (isDarkMode: boolean) => {
    window.main.changeColorScheme(isDarkMode)
    setIsDarkMode(isDarkMode)
  }

  return (
    <div className={`grow m-[4px] flex transition-opacity duration-400 ease-linear ${expanded ? 'opacity-100' : 'opacity-0'}`}>
      <Switch
        checked={isDarkMode}
        disabled={!expanded}
        onChange={handleChange}
        className={`${clsx(
          'grow group relative flex max-h-[36px] max-w-[64px] cursor-pointer rounded-xl p-[2px] focus:outline-none',
          `${'bg-charcoal-300/60 hover:bg-charcoal-300/70 dark:bg-charcoal-600 dark:hover:bg-charcoal-600/70'}`
        )}`}>
        <span
          className={`${clsx(
            'flex flex-row size-[32px] justify-center items-center translate-x-0 rounded-xl ring-0 shadow-lg',
            'transition-[translate] duration-800 ease-in-out group-data-[checked]:translate-x-[28px]',
            `${'bg-charcoal-500/50 hover:bg-charcoal-400 dark:bg-charcoal-800 dark:hover:bg-charcoal-900/70'}`
          )}`}>
          {isDarkMode ? (
            <DarkModeRoundedIcon sx={{ fontSize: 24 }} className="text-charcoal-200" />
          ) : (
            <LightModeRoundedIcon sx={{ fontSize: 24 }} className="text-amber-500" />
          )}
        </span>
      </Switch>
    </div>
  )
}
