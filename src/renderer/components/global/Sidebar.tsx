import { useState, useLayoutEffect, ReactElement, FunctionComponent, useCallback } from 'react'
import { SidebarItem } from './SidebarItem'
import { LanguagePage } from '~components/pages/LanguagePage'
import { SettingsPage } from '~components/pages/SettingsPage'
import { TranslatePage } from '~components/pages/TranslatePage'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import clsx from 'clsx'

export type SidebarItem = {
  id: number
  text: string
  icon: ReactElement
  content: ReactElement
  active: boolean
}

interface Props {
  callback: (content: ReactElement) => void
}

export const Sidebar: FunctionComponent<Props> = ({ callback }) => {
  const [expanded, setExpanded] = useState<boolean>(false)
  const [sidebarItems, setSidebarItems] = useState<SidebarItem[]>([
    {
      id: 1,
      text: 'Translate',
      icon: <TranslateRoundedIcon sx={{ fontSize: 32 }} />,
      content: <TranslatePage />,
      active: true,
    },
    {
      id: 2,
      text: 'Languages',
      icon: <FormatListBulletedRoundedIcon sx={{ fontSize: 32 }} />,
      content: <LanguagePage />,
      active: false,
    },
    {
      id: 3,
      text: 'Settings',
      icon: <SettingsRoundedIcon sx={{ fontSize: 32 }} />,
      content: <SettingsPage />,
      active: false,
    },
  ])

  const updateSidebar = useCallback(
    (id: number, active: boolean) => {
      const updated = sidebarItems.map(item => (item.id === id ? { ...item, active } : { ...item, active: false }))
      const activeItem = updated.filter(item => item.active)[0]
      setSidebarItems(updated)
      callback(activeItem.content)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSidebarItems]
  )

  // WHEN THE WINDOW GETS TOO SMALL, HIDE EXPANDED SIDEBAR
  useLayoutEffect(() => {
    function updateSize() {
      if (window.innerWidth < 800) {
        setExpanded(false)
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  }, [setExpanded])

  return (
    <div className={`w-min-[64px] w-max-[196px] transition-all ${expanded ? 'w-[196px]' : 'w-[64px]'}`}>
      <nav
        className={`${clsx(
          'flex h-full flex-col items-center justify-between border-r-2 shadow-sm',
          'bg-charcoal-200 border-charcoal-300 dark:bg-charcoal-700 dark:border-charcoal-800'
        )}`}>
        <ul className="flex flex-col gap-2 p-2 overflow-hidden items-center justify-between">
          {sidebarItems.map((item: SidebarItem) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              text={item.text}
              expanded={expanded}
              active={item.active}
              callback={updateSidebar}
            />
          ))}
        </ul>
        <div className={`hidden md:flex w-full py-2 ${expanded ? 'px-2 justify-end' : 'justify-center'}`}>
          <button
            className={`${clsx(
              'flex size-[32px] justify-center items-center rounded-xl bg-primary-500/50 hover:bg-primary-500/90',
              'text-charcoal-900 hover:text-charcoal-950 dark:text-charcoal-100 dark:hover:text-charcoal-50'
            )}`}
            onClick={() => setExpanded((current: boolean) => !current)}>
            <ChevronLeftRoundedIcon
              sx={{ fontSize: 32 }}
              className={`transition-all duration-300 ${expanded ? 'rotate-0' : 'rotate-180'}`}
              strokeWidth={2.5}
            />
            <span className={`overflow-hidden text-start transition-all`} />
          </button>
        </div>
      </nav>
    </div>
  )
}
