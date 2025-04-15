import { FunctionComponent } from 'react'
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HorizontalRuleRoundedIcon from '@mui/icons-material/HorizontalRuleRounded'
import clsx from 'clsx'

export const WindowBar: FunctionComponent = () => {
  return (
    <div
      className={`${clsx(
        'flex h-[32px] shadow-sm border-b-2',
        'bg-charcoal-300 border-charcoal-500 dark:bg-charcoal-700 dark:border-charcoal-800'
      )}`}
    >
      <div className="grow window-drag" /> {/* Draggable Bar */}
      <div className="grid grid-cols-3 h-full w-[96px]">
        <button
          className="flex justify-center items-center outline-none hover:bg-charcoal-200 dark:hover:bg-charcoal-600"
          onClick={window.main.minimizeWindow}
        >
          <HorizontalRuleRoundedIcon sx={{ fontSize: 24 }} />
        </button>

        <button
          className="flex justify-center items-center outline-none hover:bg-charcoal-200 dark:hover:bg-charcoal-600"
          onClick={window.main.maximizeWindow}
        >
          <CropSquareRoundedIcon sx={{ fontSize: 24 }} />
        </button>

        <button className="flex justify-center items-center outline-none hover:bg-red-600/50" onClick={window.main.closeWindow}>
          <CloseRoundedIcon sx={{ fontSize: 24 }} />
        </button>
      </div>
    </div>
  )
}
