import { useState, useLayoutEffect, ReactElement, FunctionComponent, useCallback } from 'react'
import { SidebarItem } from './SidebarItem'
import { LanguagePage } from '~components/pages/LanguagePage'
import { SettingsPage } from '~components/pages/SettingsPage'
import { TranslatePage } from '~components/pages/TranslatePage'
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'

export type NavBarItem = {
  id: number
  icon: ReactElement
  text: string
  active: boolean
}

export type ActiveItem = {
  id: number
  active: boolean
}

interface Props {
  pageChange: (content: ReactElement) => void
}

export const Sidebar: FunctionComponent<Props> = ({ pageChange }) => {
  const [expanded, setExpanded] = useState(false)
  const [navItems, setNavItems] = useState([
    {
      id: 1,
      icon: <TranslateRoundedIcon sx={{ fontSize: 32 }} />,
      text: 'Translate',
      content: <TranslatePage />,
      active: true,
    },
    {
      id: 2,
      icon: <FormatListBulletedRoundedIcon sx={{ fontSize: 32 }} />,
      text: 'Languages',
      content: <LanguagePage />,
      active: false,
    },
    {
      id: 3,
      icon: <SettingsRoundedIcon sx={{ fontSize: 32 }} />,
      text: 'Settings',
      content: <SettingsPage />,
      active: false,
    },
  ])

  const handleNavItemUpdate = useCallback(
    (id: number, active: boolean) => {
      const updatedItems = navItems.map(item => (item.id === id ? { ...item, active } : { ...item, active: false }))
      const activeItem = updatedItems.filter(item => item.active)[0]
      setNavItems(updatedItems)
      pageChange(activeItem.content)
    },
    [setNavItems]
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
      <nav className="flex h-full flex-col items-center justify-between bg-neutral-900 border-r-2 border-neutral-950 shadow-sm">
        <ul className="flex flex-col gap-2 p-2 overflow-hidden items-center justify-between">
          {navItems.map((item: NavBarItem) => (
            <SidebarItem
              key={item.id}
              id={item.id}
              icon={item.icon}
              text={item.text}
              expanded={expanded}
              active={item.active}
              handleUpdate={handleNavItemUpdate}
            />
          ))}
        </ul>
        <div className={`hidden md:flex w-full py-2 ${expanded ? 'px-2 justify-end' : 'justify-center'}`}>
          <button
            className="flex size-[32px] justify-center items-center rounded-lg bg-gradient-to-tr from-0% from-gray-700 to-gray-600 p-1.5 hover:from-gray-500 hover:to-gray-500"
            onClick={() => setExpanded((current: boolean) => !current)}
          >
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
