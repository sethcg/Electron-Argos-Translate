import { ChevronLeftIcon, LanguageIcon, Cog8ToothIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { useState, useLayoutEffect, ReactElement, FunctionComponent, useCallback } from 'react'
import { SidebarItem } from './SidebarItem'

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
  pageChange: (items: NavBarItem[]) => void
}

export const Sidebar: FunctionComponent<Props> = () => {
  const [expanded, setExpanded] = useState(false)
  const [navItems, setNavItems] = useState([
    {
      id: 1,
      icon: <LanguageIcon strokeWidth={2} className={'size-8'} />,
      text: 'Translate',
      active: true,
    },
    {
      id: 2,
      icon: <ListBulletIcon strokeWidth={2} className={'size-8'} />,
      text: 'Languages',
      active: false,
    },
    {
      id: 3,
      icon: <Cog8ToothIcon strokeWidth={2} className={'size-8'} />,
      text: 'Settings',
      active: false,
    },
  ])

  const handleNavItemUpdate = useCallback(
    (id: number, active: boolean) => {
      setNavItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, active } : { ...item, active: false })))
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
            className="w-[36px] rounded-lg bg-gradient-to-tr from-0% from-gray-700 to-gray-600 p-1.5 hover:from-gray-500 hover:to-gray-500"
            onClick={() => setExpanded((current: boolean) => !current)}
          >
            <span className="h-6 w-6 transition-all">
              <ChevronLeftIcon className={`size-6 duration-300 ${expanded ? 'rotate-0' : 'rotate-180'}`} strokeWidth={2.5} />
            </span>
            <span className={`overflow-hidden text-start transition-all`} />
          </button>
        </div>
      </nav>
    </div>
  )
}
