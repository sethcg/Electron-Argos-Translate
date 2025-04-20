import { FunctionComponent, ReactElement, useEffect, useMemo } from 'react'

interface Props {
  id: number
  icon: ReactElement
  text: string
  active: boolean
  expanded: boolean
  callback: (id: number, active: boolean) => void
}

export const SidebarItem: FunctionComponent<Props> = ({ id, icon, text, active, expanded = false, callback }) => {
  useEffect(() => {}, [expanded])

  return (
    <li className={`font-roboto font-bold text-xl ${expanded ? 'mx-2' : ''}`}>
      {useMemo(() => {
        return (
          <button
            className={`relative flex flex-row cursor-pointer items-center rounded-md p-2 
          ${active ? 'bg-primary-500' : 'hover:bg-primary-500/60 hover:text-charcoal-900'}
          `}
            onClick={() => callback(id, true)}>
            {icon}
            <span className={`overflow-hidden text-start transition-all ${expanded ? 'pl-4 w-32' : 'w-0'}`}>{text}</span>
          </button>
        )
      }, [id, text, icon, active, expanded, callback])}
    </li>
  )
}
