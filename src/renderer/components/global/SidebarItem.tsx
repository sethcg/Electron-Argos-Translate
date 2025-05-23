import { FunctionComponent, ReactElement, useEffect, CSSProperties, useMemo } from 'react'

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
    <li className={`font-roboto font-bold text-xl transition-[margin] duration-700 ${expanded ? 'mx-2' : ''}`}>
      {useMemo(() => {
        // Special style to include two transition properties on the expanded sidebar
        const transitionStyle: CSSProperties = { transitionProperty: 'width, padding' } as CSSProperties

        return (
          <button
            className={`relative flex flex-row cursor-pointer items-center rounded-md p-2 
          ${active ? 'bg-primary-500' : 'hover:bg-primary-500/60 hover:text-charcoal-900'}
          `}
            onClick={() => callback(id, true)}>
            {icon}
            <span style={transitionStyle} className={`overflow-hidden text-start duration-700 ${expanded ? 'pl-4 w-32' : 'w-0'}`}>
              {text}
            </span>
          </button>
        )
      }, [active, icon, expanded, text, callback, id])}
    </li>
  )
}
